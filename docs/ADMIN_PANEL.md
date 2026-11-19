# ADMIN_PANEL.md — Documentación del Panel Administrativo

El panel administrativo es el área privada de **Luz Beauty Studio** diseñada para que la administración gestione el portafolio visual y las categorías sin conocimientos técnicos.

---

## 1. Acceso y Autenticación

- **Ruta propuesta:** `/admin` (y `/admin/login`).
- **Mecanismo:** Inicio de sesión mediante correo electrónico y contraseña con **Supabase Auth**.
- **Sin registro público:** No existirá formulario de registro ni creación de cuentas abierta en la web. Las cuentas administrativas se crean directamente desde el panel de Supabase.
- **Protección de rutas:** Cualquier acceso sin sesión válida debe redirigir a `/admin/login`. Al cerrar sesión, se limpia el estado local y se revoca la sesión en Supabase.

---

## 2. Secciones del Panel Administrativo

Menú de navegación estructurado (ver [`PROJECT_MASTER.md`](./PROJECT_MASTER.md), Sección 19.4): `1. Inicio / Dashboard`, `2. Galería de trabajos`, `3. Cargar fotografías`, `4. Categorías de servicio`, `5. Ajustes generales`, `6. Cerrar sesión`.

### A. Dashboard (Resumen)
- Vista inicial tras iniciar sesión.
- Muestra métricas básicas obtenidas de PostgreSQL:
  - Total de fotografías en galería.
  - Fotografías publicadas vs ocultas.
  - Total de categorías activas.
- Accesos rápidos a *Subir fotografía* y *Ver galería*.

### B. Galería Administrativa
- Muestra todas las fotografías (tanto `is_published = true` como `is_published = false`).
- Filtros por categoría y por estado (Todas / Publicadas / Ocultas).
- Acciones rápidas por cada tarjeta de imagen:
  - Publicar / Ocultar (interruptor de `is_published`).
  - Editar detalles.
  - Eliminar.

### C. Subida de Fotografías
- Selección de categoría obligatoria (de la tabla `categories`).
- Carga de archivo desde el dispositivo (compatible con móvil y escritorio).
- Campos opcionales: Título, Descripción, Orden de visualización.
- Opción para publicar inmediatamente o guardar como oculta (borrador).
- Validación previa en cliente: formato permitido (`JPG`, `PNG`, `WEBP`) y tamaño máximo (`5 MB`).
- Indicador de progreso y confirmación clara tras completar la subida a Storage + inserción en PostgreSQL.

### D. Edición de Fotografías
- Permite actualizar:
  - Categoría asignada.
  - Título y descripción.
  - Orden de visualización (`display_order`).
  - Estado de publicación (`is_published`).

### E. Gestión de Categorías
- Listado de las categorías existentes (inicialmente las 6 oficiales).
- Permite editar nombre, descripción, orden de aparición, estado activo/inactivo (`is_active`) y, cuando se confirme, información de precios (`price_info`).
- No permite eliminar una categoría que tenga imágenes asociadas (`ON DELETE RESTRICT`).

### F. Eliminación de Fotografías
- Requiere confirmación explícita mediante modal (*"¿Estás segura de eliminar esta fotografía? Esta acción no se puede deshacer"*).
- Proceso atómico lógico:
  1. Eliminar el archivo físico en Supabase Storage usando `storage_path`.
  2. Eliminar el registro en la tabla `gallery_images`.
  3. Actualizar la vista y mostrar notificación de éxito.

---

## 3. Experiencia de Uso (UX)

- Diseño limpio, mobile-friendly (para poder subir fotos directamente desde el teléfono del estudio) y coherente con los colores y tipografías de [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md).
- Mensajes de retroalimentación claros (éxito, carga, error de red o archivo inválido).
- Enlace directo para regresar a la web pública.
