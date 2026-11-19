import { useState, type ChangeEvent, type FormEvent } from 'react';
import { validateImageFile } from '../../services/file-validation.service';
import {
  createAdminGalleryItem,
  isSupabaseConfigured,
  removeAdminGalleryItem,
  signOutAdmin,
  slugifyCategoryName,
  type AdminGalleryItem,
  type AdminSession,
} from '../../services/supabase.service';
import type { CategorySlug, ServiceCategory } from '../../types/catalog';
import { BrandMonogram, CloseIcon, MenuIcon } from '../ui/BrandIcons';
import { ImagePlaceholder } from '../ui/ImagePlaceholder';

type AdminTab = 'dashboard' | 'gallery' | 'upload' | 'categories' | 'settings';

interface AdminPanelViewProps {
  session: AdminSession;
  items: AdminGalleryItem[];
  categories: ServiceCategory[];
  onUpdateItems: (items: AdminGalleryItem[]) => void;
  onUpdateCategories: (categories: ServiceCategory[]) => void;
  onResetDemoData?: () => void;
  onLogout: () => void;
  onBackToPublic: () => void;
}

interface PendingUploadFile {
  id: string;
  file?: File;
  name: string;
  type: string;
  size: number;
}

export function AdminPanelView({
  session,
  items,
  categories,
  onUpdateItems,
  onUpdateCategories,
  onResetDemoData,
  onLogout,
  onBackToPublic,
}: AdminPanelViewProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filtros en Galería de trabajos
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('todas');
  const [statusFilter, setStatusFilter] = useState<'todas' | 'publicadas' | 'ocultas'>('todas');

  // Edición y eliminación
  const [editingItem, setEditingItem] = useState<AdminGalleryItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<AdminGalleryItem | null>(null);

  // Subida de fotografías
  const [pendingFiles, setPendingFiles] = useState<PendingUploadFile[]>([]);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadPublishNow, setUploadPublishNow] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Gestión de categorías
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');
  const [editingCatDesc, setEditingCatDesc] = useState('');
  const [editingCatPrice, setEditingCatPrice] = useState('');

  const publishedCount = items.filter((item) => item.isPublished).length;
  const hiddenCount = items.length - publishedCount;
  const recentItems = items.slice(0, 4);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      item.categoryName.toLowerCase().includes(searchQuery.trim().toLowerCase());

    const matchesCategory =
      categoryFilter === 'todas' || item.categorySlug === categoryFilter;

    const matchesStatus =
      statusFilter === 'todas' ||
      (statusFilter === 'publicadas' && item.isPublished) ||
      (statusFilter === 'ocultas' && !item.isPublished);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const switchTab = (tab: AdminTab) => {
    setActiveTab(tab);
    setMobileNavOpen(false);
    setNotice(null);
  };

  const handleTogglePublish = (itemId: string) => {
    let wasPublished = false;
    const next = items.map((item) => {
      if (item.id !== itemId) return item;
      wasPublished = !item.isPublished;
      return {
        ...item,
        isPublished: wasPublished,
        temporaryLabel: wasPublished ? 'Trabajo publicado' : 'Borrador privado',
      };
    });
    onUpdateItems(next);
    setNotice({
      type: 'success',
      text: wasPublished
        ? 'La fotografía fue publicada'
        : 'La fotografía fue ocultada',
    });
  };

  const handleSaveEdit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingItem) return;

    const targetCategory = categories.find(
      (cat) => cat.slug === editingItem.categorySlug,
    );

    const next = items.map((item) =>
      item.id === editingItem.id
        ? {
            ...editingItem,
            categoryName: targetCategory?.name ?? editingItem.categoryName,
          }
        : item,
    );
    onUpdateItems(next);
    setEditingItem(null);
    setNotice({ type: 'success', text: 'Los cambios se guardaron' });
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    try {
      await removeAdminGalleryItem(deletingItem, session);
      onUpdateItems(items.filter((item) => item.id !== deletingItem.id));
      setDeletingItem(null);
      setNotice({ type: 'success', text: 'Fotografía eliminada del catálogo' });
    } catch (error) {
      setNotice({
        type: 'error',
        text:
          error instanceof Error
            ? error.message
            : 'No fue posible eliminar la fotografía',
      });
    }
  };

  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;

    const validFiles: PendingUploadFile[] = [];
    for (const file of Array.from(fileList)) {
      const check = validateImageFile({
        name: file.name,
        type: file.type,
        size: file.size,
      });
      if (!check.valid) {
        setNotice({
          type: 'error',
          text: check.error ?? 'El formato del archivo no es compatible',
        });
        return;
      }
      validFiles.push({
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        file,
        name: file.name,
        type: file.type,
        size: file.size,
      });
    }

    setPendingFiles((prev) => [...prev, ...validFiles]);
    setNotice(null);
  };

  const handleAddPlaceholderUpload = () => {
    setPendingFiles((prev) => [
      ...prev,
      {
        id: `placeholder-${Date.now()}`,
        name: `trabajo-studio-${prev.length + 1}.jpg`,
        type: 'image/jpeg',
        size: 245000,
      },
    ]);
    setNotice(null);
  };

  const handleUploadSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(null);

    if (!uploadCategory) {
      setNotice({ type: 'error', text: 'Selecciona una categoría' });
      return;
    }

    const filesToProcess =
      pendingFiles.length > 0
        ? pendingFiles
        : session.mode === 'local-preview'
          ? [
              {
                id: `preview-${Date.now()}`,
                name: 'espacio-reservado.jpg',
                type: 'image/jpeg',
                size: 120000,
              },
            ]
          : [];

    if (filesToProcess.length === 0) {
      setNotice({ type: 'error', text: 'Selecciona al menos una fotografía.' });
      return;
    }

    try {
      setIsUploading(true);
      const created: AdminGalleryItem[] = [];
      for (let i = 0; i < filesToProcess.length; i += 1) {
        const entry = filesToProcess[i];
        const titleForItem =
          filesToProcess.length > 1 && uploadTitle.trim()
            ? `${uploadTitle.trim()} (${i + 1})`
            : uploadTitle;

        const newItem = await createAdminGalleryItem(
          {
            file: entry.file,
            fileName: entry.name,
            fileType: entry.type,
            fileSize: entry.size,
            title: titleForItem,
            description: uploadDescription,
            categorySlug: uploadCategory,
            isPublished: uploadPublishNow,
          },
          categories,
          session,
        );
        created.push(newItem);
      }

      onUpdateItems([...created, ...items]);
      setPendingFiles([]);
      setUploadTitle('');
      setUploadDescription('');
      setNotice({ type: 'success', text: 'Fotografía agregada correctamente' });
    } catch (error) {
      setNotice({
        type: 'error',
        text:
          error instanceof Error
            ? error.message
            : 'No fue posible subir la imagen',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateCategory = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanName = newCategoryName.trim();
    if (!cleanName) {
      setNotice({ type: 'error', text: 'Ingresa el nombre de la categoría.' });
      return;
    }

    const slug = slugifyCategoryName(cleanName);
    if (categories.some((cat) => cat.slug === slug)) {
      setNotice({ type: 'error', text: 'Ya existe una categoría con ese nombre.' });
      return;
    }

    const nextCategory: ServiceCategory = {
      id: `cat-${slug}-${Date.now()}`,
      number: String(categories.length + 1).padStart(2, '0'),
      name: cleanName,
      slug: slug as CategorySlug,
      description:
        newCategoryDesc.trim() ||
        `Trabajos y estilos realizados en ${cleanName}.`,
      placeholderId: `PH-SRV-${categories.length + 1}`,
      aspectRatio: '1:1',
      desktopSpan: 4,
      isActive: true,
      priceStatus: 'Consultar precio por WhatsApp',
    };

    onUpdateCategories([...categories, nextCategory]);
    setNewCategoryName('');
    setNewCategoryDesc('');
    setNotice({ type: 'success', text: 'Categoría agregada correctamente' });
  };

  const handleSaveCategoryEdit = (categoryId: string) => {
    const cleanName = editingCatName.trim();
    if (!cleanName) return;

    const target = categories.find((c) => c.id === categoryId);
    if (!target) return;

    onUpdateCategories(
      categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              name: cleanName,
              description: editingCatDesc.trim() || cat.description,
              priceStatus: editingCatPrice.trim() || cat.priceStatus,
            }
          : cat,
      ),
    );
    onUpdateItems(
      items.map((item) =>
        item.categorySlug === target.slug ? { ...item, categoryName: cleanName } : item,
      ),
    );
    setEditingCategoryId(null);
    setNotice({ type: 'success', text: 'Los cambios se guardaron' });
  };

  const handleToggleCategoryActive = (category: ServiceCategory) => {
    const nextActive = !category.isActive;
    onUpdateCategories(
      categories.map((cat) =>
        cat.id === category.id ? { ...cat, isActive: nextActive } : cat,
      ),
    );
    setNotice({
      type: 'success',
      text: nextActive
        ? `Categoría "${category.name}" activada`
        : `Categoría "${category.name}" desactivada en el sitio público`,
    });
  };

  const handleDeleteCategory = (category: ServiceCategory) => {
    const linkedCount = items.filter(
      (item) => item.categorySlug === category.slug,
    ).length;

    if (linkedCount > 0) {
      setNotice({
        type: 'error',
        text: `No se puede eliminar "${category.name}" porque tiene ${linkedCount} trabajo(s) vinculado(s). Reasigna o elimina esas fotografías primero.`,
      });
      return;
    }

    onUpdateCategories(categories.filter((c) => c.id !== category.id));
    setNotice({ type: 'success', text: `Categoría "${category.name}" eliminada` });
  };

  const handleLogoutClick = async () => {
    await signOutAdmin(session);
    onLogout();
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar" aria-label="Menú administrativo">
        <div>
          <div className="admin-sidebar__header">
            <div className="brand-lockup">
              <div style={{ backgroundColor: '#171317', borderRadius: '9999px', padding: '4px' }}>
                <BrandMonogram size={36} />
              </div>
              <span className="brand-lockup__text">
                <span className="brand-lockup__name" style={{ color: '#171317', fontSize: '20px' }}>
                  Luz Beauty <em>Admin</em>
                </span>
                <span className="brand-lockup__tag" style={{ color: '#8C7C84' }}>
                  {session.mode === 'local-preview' ? 'Vista previa local' : session.email}
                </span>
              </span>
            </div>

            <button
              type="button"
              className="mobile-menu-toggle"
              style={{ color: '#171317', borderColor: 'rgba(232,62,120,0.35)' }}
              aria-label="Alternar menú administrativo"
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen((prev) => !prev)}
            >
              {mobileNavOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>

          <nav
            className={`admin-nav ${mobileNavOpen ? '' : 'admin-nav--collapsed'}`}
            style={{ marginTop: '20px' }}
          >
            {(
              [
                ['dashboard', 'Inicio / Dashboard'],
                ['gallery', 'Galería de trabajos'],
                ['upload', 'Cargar fotografías'],
                ['categories', 'Categorías de servicio'],
                ['settings', 'Ajustes generales'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={`admin-nav__btn ${activeTab === key ? 'admin-nav__btn--active' : ''}`}
                onClick={() => switchTab(key)}
              >
                <span>{label}</span>
              </button>
            ))}

            <button
              type="button"
              className="admin-nav__btn admin-nav__btn--logout"
              onClick={handleLogoutClick}
            >
              Cerrar sesión
            </button>
          </nav>
        </div>

        <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(245,200,217,0.5)' }}>
          <button
            type="button"
            className="btn btn--secondary btn--full"
            onClick={onBackToPublic}
          >
            Ver página pública ↗
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <span className="section-heading__eyebrow">Gestión del catálogo visual</span>
            <h1 className="admin-page-title">
              {activeTab === 'dashboard' && 'Inicio / Dashboard'}
              {activeTab === 'gallery' && 'Galería de trabajos'}
              {activeTab === 'upload' && 'Cargar fotografías'}
              {activeTab === 'categories' && 'Categorías de servicio'}
              {activeTab === 'settings' && 'Ajustes generales'}
            </h1>
          </div>

          <div className="admin-actions-row">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => switchTab('upload')}
            >
              Cargar imágenes
            </button>
          </div>
        </div>

        {notice ? (
          <div
            className={`admin-notice ${
              notice.type === 'error' ? 'admin-notice--error' : 'admin-notice--success'
            }`}
            role="status"
            style={{ marginBottom: '20px' }}
          >
            {notice.text}
          </div>
        ) : null}

        {activeTab === 'dashboard' ? (
          <>
            <div className="admin-metrics-grid">
              <div className="admin-metric-card">
                <span className="admin-metric-card__value">{items.length}</span>
                <span className="admin-metric-card__label">Cantidad total de imágenes</span>
              </div>
              <div className="admin-metric-card">
                <span className="admin-metric-card__value">{publishedCount}</span>
                <span className="admin-metric-card__label">Imágenes visibles al público</span>
              </div>
              <div className="admin-metric-card">
                <span className="admin-metric-card__value">{hiddenCount}</span>
                <span className="admin-metric-card__label">Imágenes ocultas</span>
              </div>
              <div className="admin-metric-card">
                <span className="admin-metric-card__value">{categories.length}</span>
                <span className="admin-metric-card__label">Total de secciones registradas</span>
              </div>
            </div>

            <div className="admin-card">
              <h2 className="service-card__title" style={{ marginBottom: '14px' }}>
                Accesos rápidos
              </h2>
              <div className="admin-actions-row">
                <button type="button" className="btn btn--primary" onClick={() => switchTab('upload')}>
                  Cargar imágenes
                </button>
                <button type="button" className="btn btn--secondary" onClick={() => switchTab('gallery')}>
                  Gestionar portafolio
                </button>
                <button type="button" className="btn btn--secondary" onClick={() => switchTab('categories')}>
                  Organizar categorías
                </button>
              </div>
            </div>

            <div className="admin-card">
              <h2 className="service-card__title" style={{ marginBottom: '14px' }}>
                Actividad reciente
              </h2>
              <div className="admin-table-list">
                {recentItems.map((item) => (
                  <div key={item.id} className="admin-list-row">
                    <div>
                      <strong>{item.title}</strong>
                      <div style={{ fontSize: '13px', color: '#8C7C84' }}>
                        {item.categoryName} • {item.createdAt}
                      </div>
                    </div>
                    <span
                      className={`admin-status-pill ${
                        item.isPublished
                          ? 'admin-status-pill--published'
                          : 'admin-status-pill--hidden'
                      }`}
                    >
                      {item.isPublished ? 'Publicada' : 'Oculta'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}

        {activeTab === 'gallery' ? (
          <>
            <div className="admin-toolbar">
              <input
                type="search"
                className="form-control"
                placeholder="Buscar por título o categoría..."
                aria-label="Buscar fotografías"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select
                className="form-control"
                aria-label="Filtrar por categoría"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="todas">Todas las categorías</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <select
                className="form-control"
                aria-label="Filtrar por estado"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as 'todas' | 'publicadas' | 'ocultas',
                  )
                }
              >
                <option value="todas">Todos los estados</option>
                <option value="publicadas">Publicadas</option>
                <option value="ocultas">Ocultas</option>
              </select>
            </div>

            {filteredItems.length === 0 ? (
              <div className="admin-card">
                <p style={{ color: '#8C7C84' }}>
                  No hay elementos que coincidan con los filtros seleccionados.
                </p>
              </div>
            ) : (
              <div className="admin-gallery-grid">
                {filteredItems.map((item) => (
                  <article key={item.id} className="admin-photo-card">
                    <ImagePlaceholder slot={item} theme="light" />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                      <div>
                        <strong style={{ display: 'block', fontSize: '15px' }}>{item.title}</strong>
                        <span style={{ fontSize: '12px', color: '#8C7C84' }}>
                          {item.categoryName} • {item.createdAt}
                        </span>
                      </div>
                      <span
                        className={`admin-status-pill ${
                          item.isPublished
                            ? 'admin-status-pill--published'
                            : 'admin-status-pill--hidden'
                        }`}
                      >
                        {item.isPublished ? 'Publicada' : 'Oculta'}
                      </span>
                    </div>

                    <div className="admin-actions-row">
                      <button
                        type="button"
                        className="btn btn--secondary"
                        style={{ minHeight: '38px', padding: '6px 14px', fontSize: '13px' }}
                        onClick={() => handleTogglePublish(item.id)}
                      >
                        {item.isPublished ? 'Ocultar' : 'Publicar'}
                      </button>
                      <button
                        type="button"
                        className="btn btn--secondary"
                        style={{ minHeight: '38px', padding: '6px 14px', fontSize: '13px' }}
                        onClick={() => setEditingItem(item)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn--primary"
                        style={{ minHeight: '38px', padding: '6px 14px', fontSize: '13px' }}
                        onClick={() => setDeletingItem(item)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        ) : null}

        {activeTab === 'upload' ? (
          <div className="admin-card">
            <form className="form-grid" onSubmit={handleUploadSubmit} noValidate>
              <div className="form-field">
                <label htmlFor="upload-files" className="form-label">
                  Fotografías (JPG, PNG o WebP • Máximo 5 MB)
                </label>
                <input
                  id="upload-files"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="form-control"
                  onChange={handleFileSelection}
                />
                {session.mode === 'local-preview' ? (
                  <button
                    type="button"
                    className="btn-link"
                    onClick={handleAddPlaceholderUpload}
                  >
                    + Simular espacio reservado en modo vista previa
                  </button>
                ) : null}
              </div>

              {pendingFiles.length > 0 ? (
                <div className="admin-table-list">
                  {pendingFiles.map((file) => (
                    <div key={file.id} className="admin-list-row">
                      <span style={{ fontSize: '14px' }}>
                        {file.name} ({Math.max(1, Math.round(file.size / 1024))} KB)
                      </span>
                      <button
                        type="button"
                        className="btn-link"
                        onClick={() =>
                          setPendingFiles((prev) =>
                            prev.filter((item) => item.id !== file.id),
                          )
                        }
                      >
                        Descartar
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="form-grid form-grid--two">
                <div className="form-field">
                  <label htmlFor="upload-title" className="form-label">
                    Título
                  </label>
                  <input
                    id="upload-title"
                    type="text"
                    className="form-control"
                    placeholder="Ej. Diseño francés perlado"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="upload-category" className="form-label">
                    Categoría <span className="form-label__required">*</span>
                  </label>
                  <select
                    id="upload-category"
                    className="form-control"
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    required
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="upload-description" className="form-label">
                  Descripción
                </label>
                <textarea
                  id="upload-description"
                  className="form-control form-textarea"
                  placeholder="Detalles u observaciones del servicio realizado"
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label className="form-label">Estado de publicación</label>
                <div className="admin-actions-row">
                  <button
                    type="button"
                    className={`filter-pill ${uploadPublishNow ? 'filter-pill--active' : ''}`}
                    onClick={() => setUploadPublishNow(true)}
                  >
                    Publicar de inmediato
                  </button>
                  <button
                    type="button"
                    className={`filter-pill ${!uploadPublishNow ? 'filter-pill--active' : ''}`}
                    onClick={() => setUploadPublishNow(false)}
                  >
                    Guardar en modo privado
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn--primary"
                disabled={isUploading}
              >
                {isUploading ? 'Guardando...' : 'Guardar fotografías'}
              </button>
            </form>
          </div>
        ) : null}

        {activeTab === 'categories' ? (
          <>
            <div className="admin-card">
              <h2 className="service-card__title" style={{ marginBottom: '14px' }}>
                Incorporar nueva categoría
              </h2>
              <form className="form-grid" onSubmit={handleCreateCategory}>
                <div className="form-grid form-grid--two">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nombre de nueva categoría"
                    aria-label="Nombre de nueva categoría"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Descripción breve (opcional)"
                    aria-label="Descripción de nueva categoría"
                    value={newCategoryDesc}
                    onChange={(e) => setNewCategoryDesc(e.target.value)}
                  />
                </div>
                <div>
                  <button type="submit" className="btn btn--primary">
                    Agregar categoría
                  </button>
                </div>
              </form>
            </div>

            <div className="admin-card">
              <h2 className="service-card__title" style={{ marginBottom: '14px' }}>
                Categorías registradas ({categories.length})
              </h2>
              <div className="admin-table-list">
                {categories.map((cat) => {
                  const linkedCount = items.filter(
                    (item) => item.categorySlug === cat.slug,
                  ).length;

                  return (
                    <div key={cat.id} className="admin-list-row">
                      <div style={{ flex: 1 }}>
                        {editingCategoryId === cat.id ? (
                          <div className="form-grid" style={{ gap: '10px' }}>
                            <div className="form-grid form-grid--two">
                              <input
                                type="text"
                                className="form-control"
                                aria-label="Editar nombre de categoría"
                                value={editingCatName}
                                onChange={(e) => setEditingCatName(e.target.value)}
                              />
                              <input
                                type="text"
                                className="form-control"
                                aria-label="Editar información de precio"
                                placeholder="Ej. Consultar precio por WhatsApp"
                                value={editingCatPrice}
                                onChange={(e) => setEditingCatPrice(e.target.value)}
                              />
                            </div>
                            <input
                              type="text"
                              className="form-control"
                              aria-label="Editar descripción de categoría"
                              value={editingCatDesc}
                              onChange={(e) => setEditingCatDesc(e.target.value)}
                            />
                            <div className="admin-actions-row">
                              <button
                                type="button"
                                className="btn btn--primary"
                                style={{ minHeight: '40px', padding: '8px 16px' }}
                                onClick={() => handleSaveCategoryEdit(cat.id)}
                              >
                                Guardar
                              </button>
                              <button
                                type="button"
                                className="btn btn--secondary"
                                style={{ minHeight: '40px', padding: '8px 16px' }}
                                onClick={() => setEditingCategoryId(null)}
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <strong>{cat.name}</strong>
                              <span
                                className={`admin-status-pill ${
                                  cat.isActive
                                    ? 'admin-status-pill--published'
                                    : 'admin-status-pill--hidden'
                                }`}
                              >
                                {cat.isActive ? 'Activa' : 'Inactiva'}
                              </span>
                            </div>
                            <div style={{ fontSize: '13px', color: '#8C7C84' }}>
                              {linkedCount} trabajo(s) vinculado(s) • {cat.priceStatus} • Slug: {cat.slug}
                            </div>
                          </>
                        )}
                      </div>

                      {editingCategoryId !== cat.id ? (
                        <div className="admin-actions-row">
                          <button
                            type="button"
                            className="btn btn--secondary"
                            style={{ minHeight: '38px', padding: '6px 14px', fontSize: '13px' }}
                            onClick={() => handleToggleCategoryActive(cat)}
                          >
                            {cat.isActive ? 'Desactivar' : 'Activar'}
                          </button>
                          <button
                            type="button"
                            className="btn btn--secondary"
                            style={{ minHeight: '38px', padding: '6px 14px', fontSize: '13px' }}
                            onClick={() => {
                              setEditingCategoryId(cat.id);
                              setEditingCatName(cat.name);
                              setEditingCatDesc(cat.description);
                              setEditingCatPrice(cat.priceStatus);
                            }}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="btn btn--secondary"
                            style={{ minHeight: '38px', padding: '6px 14px', fontSize: '13px' }}
                            onClick={() => handleDeleteCategory(cat)}
                          >
                            Eliminar
                          </button>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : null}

        {activeTab === 'settings' ? (
          <div className="admin-card">
            <h2 className="service-card__title" style={{ marginBottom: '14px' }}>
              Estado de configuración e integraciones
            </h2>
            <div className="admin-table-list">
              <div className="admin-list-row">
                <div>
                  <strong>Conexión con Supabase</strong>
                  <div style={{ fontSize: '13px', color: '#8C7C84' }}>
                    Variables requeridas: <code>PUBLIC_SUPABASE_URL</code> y{' '}
                    <code>PUBLIC_SUPABASE_ANON_KEY</code>
                  </div>
                </div>
                <span className="admin-status-pill admin-status-pill--hidden">
                  {isSupabaseConfigured() ? 'Configurado' : 'Pendiente (.env)'}
                </span>
              </div>

              <div className="admin-list-row">
                <div>
                  <strong>Número empresarial de WhatsApp</strong>
                  <div style={{ fontSize: '13px', color: '#8C7C84' }}>
                    Variable requerida: <code>PUBLIC_WHATSAPP_NUMBER</code>
                  </div>
                </div>
                <span className="admin-status-pill admin-status-pill--hidden">
                  {import.meta.env.PUBLIC_WHATSAPP_NUMBER
                    ? 'Configurado'
                    : 'Pendiente de confirmación'}
                </span>
              </div>

              {onResetDemoData ? (
                <div className="admin-list-row">
                  <div>
                    <strong>Catálogo de demostración local</strong>
                    <div style={{ fontSize: '13px', color: '#8C7C84' }}>
                      Restablece las 6 categorías oficiales y los 7 espacios reservados iniciales.
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn--secondary"
                    style={{ minHeight: '38px', padding: '6px 14px', fontSize: '13px' }}
                    onClick={() => {
                      onResetDemoData();
                      setNotice({
                        type: 'success',
                        text: 'Catálogo de demostración restablecido',
                      });
                    }}
                  >
                    Restaurar catálogo de demostración
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </main>

      {editingItem ? (
        <div className="admin-modal-backdrop" role="dialog" aria-modal="true" aria-label="Editar fotografía">
          <div className="admin-modal">
            <h2 className="service-card__title">Editar fotografía</h2>
            <form className="form-grid" onSubmit={handleSaveEdit}>
              <div className="form-field">
                <label htmlFor="edit-title" className="form-label">
                  Título
                </label>
                <input
                  id="edit-title"
                  type="text"
                  className="form-control"
                  value={editingItem.title}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, title: e.target.value })
                  }
                />
              </div>

              <div className="form-field">
                <label htmlFor="edit-category" className="form-label">
                  Categoría
                </label>
                <select
                  id="edit-category"
                  className="form-control"
                  value={editingItem.categorySlug}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      categorySlug: e.target.value as CategorySlug,
                    })
                  }
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="edit-desc" className="form-label">
                  Descripción
                </label>
                <textarea
                  id="edit-desc"
                  className="form-control form-textarea"
                  value={editingItem.description ?? ''}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="admin-actions-row">
                <button type="submit" className="btn btn--primary">
                  Guardar cambios
                </button>
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => setEditingItem(null)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {deletingItem ? (
        <div className="admin-modal-backdrop" role="dialog" aria-modal="true" aria-label="Confirmar eliminación">
          <div className="admin-modal">
            <h2 className="service-card__title">Confirmar eliminación</h2>
            <p style={{ fontSize: '14px', color: '#8C7C84' }}>
              ¿Estás segura de eliminar <strong>{deletingItem.title}</strong>? Esta
              acción retirará el recurso del catálogo de forma definitiva.
            </p>
            <div className="admin-actions-row">
              <button
                type="button"
                className="btn btn--primary"
                onClick={handleConfirmDelete}
              >
                Confirmar eliminación
              </button>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setDeletingItem(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
