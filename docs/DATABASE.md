# DATABASE.md — Diseño de Base de Datos y Almacenamiento

Este documento describe el esquema de **PostgreSQL** y **Supabase Storage** para **Luz Beauty Studio**.

> **Estado:** Migración SQL inicial versionada en [`supabase/migrations/0001_initial_schema.sql`](../supabase/migrations/0001_initial_schema.sql) (tablas, índices, triggers `updated_at`, RLS y bucket `gallery`). Todavía no existe una instancia de Supabase conectada ni ejecutada contra un servidor remoto.

---

## 1. Tablas Propuestas

### Tabla `categories`
Almacena las categorías oficiales de servicios del estudio.

| Columna | Tipo PostgreSQL | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Identificador único de la categoría |
| `name` | `text` | `NOT NULL UNIQUE` | Nombre visible (ej. `Uñas`, `Pedicure`, `Maquillaje`, `Pestañas`, `Cejas`, `Depilación`) |
| `slug` | `text` | `NOT NULL UNIQUE` | Identificador amigable para URLs/filtros (ej. `unas`, `pedicure`) |
| `description` | `text` | `NULL` | Descripción corta de la categoría |
| `price_info` | `text` | `NULL` | Información de precios cuando el negocio la confirme (`PENDIENTE DE CONFIRMACIÓN`) |
| `display_order` | `integer` | `NOT NULL DEFAULT 0` | Orden de aparición en el sitio |
| `is_active` | `boolean` | `NOT NULL DEFAULT true` | Indica si la categoría está visible al público |
| `created_at` | `timestamptz` | `NOT NULL DEFAULT now()` | Fecha de creación |
| `updated_at` | `timestamptz` | `NOT NULL DEFAULT now()` | Fecha de última actualización |

### Tabla `gallery_images`
Almacena los metadatos de cada fotografía del portafolio.

| Columna | Tipo PostgreSQL | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Identificador único de la imagen |
| `category_id` | `uuid` | `NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT` | Clave foránea hacia `categories` |
| `title` | `text` | `NULL` | Título breve o referencia del trabajo |
| `description` | `text` | `NULL` | Descripción opcional del trabajo |
| `image_url` | `text` | `NOT NULL` | URL pública de la imagen en Supabase Storage |
| `storage_path` | `text` | `NOT NULL UNIQUE` | Ruta interna del archivo en el bucket (para poder eliminarlo limpiamente) |
| `display_order` | `integer` | `NOT NULL DEFAULT 0` | Orden de visualización |
| `is_published` | `boolean` | `NOT NULL DEFAULT false` | Controla si la imagen es visible en la galería pública |
| `created_at` | `timestamptz` | `NOT NULL DEFAULT now()` | Fecha de subida |
| `updated_at` | `timestamptz` | `NOT NULL DEFAULT now()` | Fecha de última modificación |

---

## 2. Relaciones

- **Uno a muchos (`1:N`):** Una categoría (`categories.id`) puede tener múltiples fotografías (`gallery_images.category_id`).
- Se recomienda `ON DELETE RESTRICT` en `category_id` para evitar borrar accidentalmente una categoría que aún tenga imágenes asociadas (el administrador deberá reasignar o eliminar las fotos primero, o desactivar la categoría con `is_active = false`).

---

## 3. Índices Necesarios

Para mantener consultas rápidas en la galería pública y filtrados:

- `idx_categories_active_order` sobre `categories (is_active, display_order)`
- `idx_gallery_images_published_category` sobre `gallery_images (is_published, category_id, display_order, created_at DESC)`
- `idx_gallery_images_category_id` sobre `gallery_images (category_id)`

---

## 4. Políticas RLS (Row Level Security)

**RLS debe estar habilitado (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`) en todas las tablas públicas.**

### Políticas propuestas para `categories`
- **Lectura pública (`SELECT`):** Permitida para `anon` y `authenticated` cuando `is_active = true` (y para `authenticated` todas, para que el admin vea también las inactivas).
- **Escritura (`INSERT`, `UPDATE`, `DELETE`):** Permitida únicamente para usuarios autenticados autorizados (`authenticated`) — ver nota de rol/admin en [`SECURITY.md`](./SECURITY.md).

### Políticas propuestas para `gallery_images`
- **Lectura pública (`SELECT`):** Permitida para `anon` únicamente cuando `is_published = true` (y opcionalmente verificando que su categoría esté activa).
- **Lectura administrativa (`SELECT`):** Permitida para `authenticated` sobre todos los registros (publicados y ocultos).
- **Escritura (`INSERT`, `UPDATE`, `DELETE`):** Permitida únicamente para administradores autenticados (`authenticated`).

---

## 5. Almacenamiento (Supabase Storage)

- **Bucket propuesto:** `gallery` (público para lectura de imágenes publicadas mediante URL).
- **Estructura sugerida de rutas dentro del bucket:**
  `<category_slug>/<uuid>-<nombre-sanitizado>.<ext>`
- **Políticas de Storage (`storage.objects`):**
  - `SELECT`: Lectura pública para el bucket `gallery`.
  - `INSERT`, `UPDATE`, `DELETE`: Restringido exclusivamente a administradores autenticados (`auth.role() = 'authenticated'`, idealmente validando además que sea cuenta admin autorizada).
- **Restricciones de archivo recomendadas:**
  - Formatos permitidos: `image/jpeg`, `image/png`, `image/webp`.
  - Tamaño máximo recomendado por imagen: `5 MB`.

---

## 6. Versionado de Migraciones

Todos los cambios de esquema, índices y políticas RLS se versionarán como archivos SQL secuenciales dentro de `supabase/migrations/`. Consultar [`supabase/README.md`](../supabase/README.md).
