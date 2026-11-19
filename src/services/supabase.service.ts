import { SERVICE_CATEGORIES } from '../data/categories.data';
import { MAGAZINE_PLACEHOLDERS } from '../data/placeholders.data';
import type {
  AspectRatio,
  CategorySlug,
  PlaceholderSlot,
  ServiceCategory,
} from '../types/catalog';
import {
  buildStoragePath,
  validateImageFile,
} from './file-validation.service';

export interface AdminSession {
  email: string;
  accessToken: string | null;
  mode: 'supabase' | 'local-preview';
}

export interface AdminGalleryItem extends PlaceholderSlot {
  description?: string;
  storagePath?: string;
  createdAt: string;
}

export interface CreateGalleryItemInput {
  file?: File;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  title: string;
  description?: string;
  categorySlug: string;
  isPublished: boolean;
  aspectRatio?: AspectRatio;
}

export interface UpdateGalleryItemInput {
  id: string;
  title: string;
  description?: string;
  categorySlug: string;
  isPublished: boolean;
}

function getSupabaseConfig(): { url: string; anonKey: string } | null {
  const url = (import.meta.env.PUBLIC_SUPABASE_URL as string | undefined)?.trim();
  const anonKey = (
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined
  )?.trim();

  if (!url || !anonKey) {
    return null;
  }

  return {
    url: url.replace(/\/+$/, ''),
    anonKey,
  };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig() !== null;
}

export function createInitialAdminItems(): AdminGalleryItem[] {
  return MAGAZINE_PLACEHOLDERS.map((slot, index) => ({
    ...slot,
    description: slot.subtitle,
    createdAt: `2026-11-1${Math.min(index + 1, 9)}`,
  }));
}

export function createInitialAdminCategories(): ServiceCategory[] {
  return SERVICE_CATEGORIES.map((category) => ({ ...category }));
}

export function slugifyCategoryName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function signInAdmin(
  email: string,
  password: string,
): Promise<AdminSession> {
  const trimmedEmail = email.trim();
  if (!trimmedEmail || !password) {
    throw new Error('Ingresa tu correo electrónico y contraseña.');
  }

  const config = getSupabaseConfig();
  if (!config) {
    return {
      email: trimmedEmail,
      accessToken: null,
      mode: 'local-preview',
    };
  }

  const response = await fetch(`${config.url}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      apikey: config.anonKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: trimmedEmail,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error('No fue posible iniciar sesión. Verifica tus credenciales.');
  }

  const data = (await response.json()) as {
    access_token?: string;
    user?: { email?: string };
  };

  if (!data.access_token) {
    throw new Error('Respuesta de autenticación inválida.');
  }

  return {
    email: data.user?.email ?? trimmedEmail,
    accessToken: data.access_token,
    mode: 'supabase',
  };
}

export async function signOutAdmin(session: AdminSession | null): Promise<void> {
  const config = getSupabaseConfig();
  if (!config || !session?.accessToken) {
    return;
  }

  await fetch(`${config.url}/auth/v1/logout`, {
    method: 'POST',
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${session.accessToken}`,
    },
  });
}

async function uploadFileToSupabaseStorage(
  config: { url: string; anonKey: string },
  accessToken: string,
  storagePath: string,
  file: File,
): Promise<string> {
  const uploadResponse = await fetch(
    `${config.url}/storage/v1/object/gallery/${storagePath}`,
    {
      method: 'POST',
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': file.type,
        'x-upsert': 'false',
      },
      body: file,
    },
  );

  if (!uploadResponse.ok) {
    throw new Error('No fue posible subir la imagen');
  }

  return `${config.url}/storage/v1/object/public/gallery/${storagePath}`;
}

async function deleteFileFromSupabaseStorage(
  config: { url: string; anonKey: string },
  accessToken: string,
  storagePath: string,
): Promise<void> {
  const response = await fetch(
    `${config.url}/storage/v1/object/gallery/${storagePath}`,
    {
      method: 'DELETE',
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error('No fue posible eliminar el archivo en Storage.');
  }
}

export async function createAdminGalleryItem(
  input: CreateGalleryItemInput,
  categories: ServiceCategory[],
  session: AdminSession | null,
): Promise<AdminGalleryItem> {
  if (!input.categorySlug) {
    throw new Error('Selecciona una categoría');
  }

  const category = categories.find((c) => c.slug === input.categorySlug);
  if (!category) {
    throw new Error('Selecciona una categoría');
  }

  const fileName = input.file?.name ?? input.fileName ?? 'trabajo-estudio.jpg';
  const fileType = input.file?.type ?? input.fileType ?? 'image/jpeg';
  const fileSize = input.file?.size ?? input.fileSize ?? 1024;

  const validation = validateImageFile({
    name: fileName,
    type: fileType,
    size: fileSize,
  });

  if (!validation.valid) {
    throw new Error(validation.error ?? 'No fue posible subir la imagen');
  }

  const storagePath = buildStoragePath(category.slug, fileName);
  const config = getSupabaseConfig();

  if (config && session?.accessToken && input.file) {
    const publicUrl = await uploadFileToSupabaseStorage(
      config,
      session.accessToken,
      storagePath,
      input.file,
    );

    try {
      const insertResponse = await fetch(`${config.url}/rest/v1/gallery_images`, {
        method: 'POST',
        headers: {
          apikey: config.anonKey,
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          category_id: category.id,
          title: input.title.trim() || `Trabajo de ${category.name}`,
          description: input.description?.trim() || null,
          image_url: publicUrl,
          storage_path: storagePath,
          is_published: input.isPublished,
        }),
      });

      if (!insertResponse.ok) {
        throw new Error('No fue posible registrar la imagen en la base de datos.');
      }
    } catch (error) {
      // Limpieza preventiva para evitar archivos huérfanos en Storage
      await deleteFileFromSupabaseStorage(
        config,
        session.accessToken,
        storagePath,
      ).catch(() => undefined);
      throw error;
    }
  }

  const nowDate = new Date().toISOString().slice(0, 10);
  return {
    id: `ADM-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: input.title.trim() || `Trabajo de ${category.name}`,
    temporaryLabel: input.isPublished ? 'Trabajo publicado' : 'Borrador privado',
    subtitle:
      input.description?.trim() ||
      `Espacio reservado • ${storagePath}`,
    description: input.description?.trim() || '',
    categorySlug: category.slug as CategorySlug,
    categoryName: category.name,
    aspectRatio: input.aspectRatio ?? '4:5',
    role: 'secondary',
    storagePath,
    isPublished: input.isPublished,
    createdAt: nowDate,
    imageUrl: null,
  };
}

export async function removeAdminGalleryItem(
  item: AdminGalleryItem,
  session: AdminSession | null,
): Promise<void> {
  const config = getSupabaseConfig();
  if (!config || !session?.accessToken) {
    return;
  }

  if (item.storagePath) {
    await deleteFileFromSupabaseStorage(
      config,
      session.accessToken,
      item.storagePath,
    );
  }

  const response = await fetch(
    `${config.url}/rest/v1/gallery_images?id=eq.${encodeURIComponent(item.id)}`,
    {
      method: 'DELETE',
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${session.accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error('No fue posible eliminar el registro de la galería.');
  }
}

export interface SupabasePublicCatalogResult {
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price_info: string | null;
    display_order: number;
    is_active: boolean;
  }>;
  images: Array<{
    id: string;
    category_id: string;
    title: string | null;
    description: string | null;
    image_url: string;
    storage_path: string;
    display_order: number;
    is_published: boolean;
    created_at: string;
  }>;
}

export async function fetchPublicCatalogFromSupabase(): Promise<SupabasePublicCatalogResult | null> {
  const config = getSupabaseConfig();
  if (!config) {
    return null;
  }

  const headers = {
    apikey: config.anonKey,
    Authorization: `Bearer ${config.anonKey}`,
  };

  const [catResponse, imgResponse] = await Promise.all([
    fetch(
      `${config.url}/rest/v1/categories?is_active=eq.true&order=display_order.asc`,
      { headers },
    ),
    fetch(
      `${config.url}/rest/v1/gallery_images?is_published=eq.true&order=display_order.asc,created_at.desc`,
      { headers },
    ),
  ]);

  if (!catResponse.ok || !imgResponse.ok) {
    throw new Error('No fue posible consultar el catálogo desde Supabase.');
  }

  const [categories, images] = (await Promise.all([
    catResponse.json(),
    imgResponse.json(),
  ])) as [
    SupabasePublicCatalogResult['categories'],
    SupabasePublicCatalogResult['images'],
  ];

  return { categories, images };
}
