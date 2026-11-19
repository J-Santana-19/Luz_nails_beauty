import { useState } from 'react';
import { CategoryFilterBar } from '../components/collage/CategoryFilterBar';
import { EditorialCollageGrid } from '../components/collage/EditorialCollageGrid';
import { LightboxModal } from '../components/ui/LightboxModal';
import { SectionHeading } from '../components/ui/SectionHeading';
import {
  getGalleryPlaceholders,
  resolvePublicGalleryItems,
} from '../services/catalog.service';
import type { AdminGalleryItem } from '../services/supabase.service';
import {
  buildWhatsAppUrl,
  DEFAULT_WHATSAPP_MESSAGE,
} from '../services/whatsapp.service';
import type {
  CategorySlug,
  PlaceholderSlot,
  ServiceCategory,
} from '../types/catalog';

interface GallerySectionProps {
  categories: ServiceCategory[];
  selectedCategory: CategorySlug | 'todos';
  onSelectCategory: (category: CategorySlug | 'todos') => void;
  adminItems?: AdminGalleryItem[];
}

export function GallerySection({
  categories,
  selectedCategory,
  onSelectCategory,
  adminItems,
}: GallerySectionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const items = adminItems
    ? resolvePublicGalleryItems(selectedCategory, adminItems, categories)
    : getGalleryPlaceholders(selectedCategory);

  const layoutVariant =
    selectedCategory === 'todos' ? 'magazine-spread' : 'category-spotlight';

  const activeItem: PlaceholderSlot | null =
    selectedIndex !== null && items[selectedIndex] ? items[selectedIndex] : null;

  const handleSelectItem = (item: PlaceholderSlot) => {
    const idx = items.findIndex((entry) => entry.id === item.id);
    setSelectedIndex(idx >= 0 ? idx : 0);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => {
      if (prev === null || items.length === 0) return null;
      return (prev - 1 + items.length) % items.length;
    });
  };

  const handleNext = () => {
    setSelectedIndex((prev) => {
      if (prev === null || items.length === 0) return null;
      return (prev + 1) % items.length;
    });
  };

  return (
    <section
      id="galeria"
      className="section-band section-band--light"
      aria-labelledby="gallery-heading"
    >
      <div className="container">
        <SectionHeading
          eyebrow="Portafolio editorial"
          title="Nuestros"
          highlightWord="Trabajos"
          subtitle="Resultados que hablan por sí solos. Explora nuestras composiciones por categoría y pulsa cualquier espacio para verlo en vista ampliada."
          align="center"
          headingId="gallery-heading"
        />

        <CategoryFilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedIndex(null);
            onSelectCategory(cat);
          }}
        />

        {items.length === 0 ? (
          <div
            className="admin-card"
            style={{ textAlign: 'center', padding: '40px 24px', maxWidth: '640px', margin: '0 auto' }}
          >
            <p style={{ fontSize: '16px', color: '#8C7C84', marginBottom: '18px' }}>
              Aún no hay trabajos publicados en esta categoría.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => onSelectCategory('todos')}
              >
                Ver todos los trabajos
              </button>
              <a
                href={buildWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--secondary"
              >
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className="gallery-status-bar">
              <span>
                {selectedCategory === 'todos'
                  ? `Vista editorial general (${items.length} espacios asimétricos)`
                  : `Vista destacada de categoría (${items.length} espacios asimétricos)`}
              </span>
              <span>Pulsa un espacio reservado para abrir vista ampliada</span>
            </div>

            <EditorialCollageGrid
              items={items}
              layoutVariant={layoutVariant}
              onSelectItem={handleSelectItem}
            />
          </>
        )}

        <LightboxModal
          item={activeItem}
          onClose={() => setSelectedIndex(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </div>
    </section>
  );
}
