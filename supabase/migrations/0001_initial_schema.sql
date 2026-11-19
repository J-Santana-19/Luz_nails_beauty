-- ============================================================================
-- LUZ BEAUTY STUDIO — MIGRACIÓN INICIAL DE POSTGRESQL Y SUPABASE STORAGE
-- Archivo: 0001_initial_schema.sql
-- Referencia: docs/DATABASE.md, docs/SECURITY.md
-- ============================================================================

-- 1. Función y triggers para actualización automática de updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 2. Tabla de categorías de servicios
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  price_info text,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_categories_updated_at ON public.categories;
CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- 3. Tabla de fotografías del portafolio (ON DELETE RESTRICT protege categorías con fotos)
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  title text,
  description text,
  image_url text NOT NULL,
  storage_path text NOT NULL UNIQUE,
  display_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_gallery_images_updated_at ON public.gallery_images;
CREATE TRIGGER trg_gallery_images_updated_at
  BEFORE UPDATE ON public.gallery_images
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- 4. Índices de rendimiento para consultas públicas y administrativas
CREATE INDEX IF NOT EXISTS idx_categories_active_order
  ON public.categories (is_active, display_order);

CREATE INDEX IF NOT EXISTS idx_gallery_images_published_category
  ON public.gallery_images (is_published, category_id, display_order, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_gallery_images_category_id
  ON public.gallery_images (category_id);

-- 5. Habilitación obligatoria de Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para public.categories
DROP POLICY IF EXISTS "Public can read active categories" ON public.categories;
CREATE POLICY "Public can read active categories"
  ON public.categories
  FOR SELECT
  TO anon
  USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated admin can read all categories" ON public.categories;
CREATE POLICY "Authenticated admin can read all categories"
  ON public.categories
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated admin can insert categories" ON public.categories;
CREATE POLICY "Authenticated admin can insert categories"
  ON public.categories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated admin can update categories" ON public.categories;
CREATE POLICY "Authenticated admin can update categories"
  ON public.categories
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated admin can delete categories" ON public.categories;
CREATE POLICY "Authenticated admin can delete categories"
  ON public.categories
  FOR DELETE
  TO authenticated
  USING (true);

-- Políticas RLS para public.gallery_images
DROP POLICY IF EXISTS "Public can read published gallery images" ON public.gallery_images;
CREATE POLICY "Public can read published gallery images"
  ON public.gallery_images
  FOR SELECT
  TO anon
  USING (
    is_published = true
    AND EXISTS (
      SELECT 1
      FROM public.categories c
      WHERE c.id = gallery_images.category_id
        AND c.is_active = true
    )
  );

DROP POLICY IF EXISTS "Authenticated admin can read all gallery images" ON public.gallery_images;
CREATE POLICY "Authenticated admin can read all gallery images"
  ON public.gallery_images
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated admin can insert gallery images" ON public.gallery_images;
CREATE POLICY "Authenticated admin can insert gallery images"
  ON public.gallery_images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated admin can update gallery images" ON public.gallery_images;
CREATE POLICY "Authenticated admin can update gallery images"
  ON public.gallery_images
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated admin can delete gallery images" ON public.gallery_images;
CREATE POLICY "Authenticated admin can delete gallery images"
  ON public.gallery_images
  FOR DELETE
  TO authenticated
  USING (true);

-- 6. Configuración de Supabase Storage (Bucket 'gallery')
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery',
  'gallery',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Políticas de Storage sobre storage.objects para el bucket 'gallery'
DROP POLICY IF EXISTS "Public can read gallery objects" ON storage.objects;
CREATE POLICY "Public can read gallery objects"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'gallery');

DROP POLICY IF EXISTS "Authenticated admin can upload gallery objects" ON storage.objects;
CREATE POLICY "Authenticated admin can upload gallery objects"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'gallery');

DROP POLICY IF EXISTS "Authenticated admin can update gallery objects" ON storage.objects;
CREATE POLICY "Authenticated admin can update gallery objects"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'gallery')
  WITH CHECK (bucket_id = 'gallery');

DROP POLICY IF EXISTS "Authenticated admin can delete gallery objects" ON storage.objects;
CREATE POLICY "Authenticated admin can delete gallery objects"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'gallery');
