---
name: gallery-management
description: >-
  Guía práctica para implementar y probar el flujo completo de gestión de
  fotografías (subida, validación, publicación/ocultamiento y eliminación) entre
  el panel administrativo, Supabase Storage y la galería pública.
---

# Gestión de Galería (Storage + PostgreSQL)

Usa esta habilidad al desarrollar o depurar funcionalidades de la galería pública o del panel administrativo.

## Flujo de Subida de Imagen

1. **Validar en cliente:** Comprobar tipo MIME (`image/jpeg`, `image/png`, `image/webp`) y tamaño (`<= 5 MB`).
2. **Construir ruta segura:** Generar ruta `<category_slug>/<uuid>-<nombre-sanitizado>.<ext>` para el bucket `gallery`.
3. **Subir a Storage:** Subir el archivo y verificar que no haya error antes de insertar en base de datos.
4. **Registrar en PostgreSQL:** Insertar en `gallery_images` con `category_id`, `image_url`, `storage_path`, `title`, `description`, `display_order` e `is_published`.
   - Si falla la inserción en PostgreSQL, eliminar el archivo recién subido en Storage para evitar archivos huérfanos.

## Flujo de Eliminación

1. Solicitar confirmación explícita en UI.
2. Eliminar el archivo en Supabase Storage usando `storage_path`.
3. Eliminar el registro en `gallery_images`.
4. Refrescar el estado de la vista administrativa.

## Verificación

- Comprobar que las imágenes con `is_published = false` no aparecen en la galería pública.
- Confirmar que la carpeta local `Assets/` no se modifica en ningún paso.
