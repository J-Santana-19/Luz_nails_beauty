-- ============================================================================
-- SEED PROPUESTO PARA LUZ BEAUTY STUDIO
-- Estado: PROPUESTA / PENDIENTE DE REVISIÓN Y EJECUCIÓN
-- Nota: Este archivo NO ha sido ejecutado contra ninguna base de datos real.
--       Las descripciones son marcadores iniciales y los precios están
--       PENDIENTE DE CONFIRMACIÓN por el negocio.
-- ============================================================================

-- Categorías oficiales del estudio (6 categorías confirmadas):
-- 1. Uñas
-- 2. Pedicure
-- 3. Maquillaje
-- 4. Pestañas
-- 5. Cejas
-- 6. Depilación

INSERT INTO public.categories (name, slug, description, display_order, is_active)
VALUES
  ('Uñas', 'unas', NULL, 1, true),
  ('Pedicure', 'pedicure', NULL, 2, true),
  ('Maquillaje', 'maquillaje', NULL, 3, true),
  ('Pestañas', 'pestanas', NULL, 4, true),
  ('Cejas', 'cejas', NULL, 5, true),
  ('Depilación', 'depilacion', NULL, 6, true)
ON CONFLICT (slug) DO NOTHING;
