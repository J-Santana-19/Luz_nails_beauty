---
trigger: model_decision
description: Reglas para diseño de tablas PostgreSQL, políticas RLS, Supabase Storage y migraciones SQL.
---

# Reglas de Base de Datos y Supabase

- **RLS obligatorio:** Toda tabla en el esquema `public` debe tener `ENABLE ROW LEVEL SECURITY` y políticas explícitas de lectura/escritura.
- **Visibilidad pública controlada:** El rol `anon` solo puede leer categorías activas (`is_active = true`) e imágenes publicadas (`is_published = true`).
- **Migraciones versionadas:** Todo cambio de esquema, índice o política debe guardarse como archivo SQL secuencial en `supabase/migrations/`.
- **Integridad referencial:** Usar `ON DELETE RESTRICT` en `gallery_images.category_id` para evitar borrados accidentales de categorías con fotos.
- **Limpieza de Storage:** Al eliminar una fotografía desde el panel administrativo, eliminar primero o coordinadamente el objeto en Supabase Storage (`storage_path`) y luego el registro en `gallery_images`.
- **Referencia:** Consultar `docs/DATABASE.md` antes de crear o modificar migraciones.
