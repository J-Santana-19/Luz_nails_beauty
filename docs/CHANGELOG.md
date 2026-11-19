# CHANGELOG.md — Registro de Cambios

Todos los cambios notables en la documentación, arquitectura y código de **Luz Beauty Studio** se registrarán en este archivo.

---

## [0.4.0] - 2026-11-19 — Sincronización Integral Público-Admin, Favicon y E2E

### Añadido
- Favicon SVG vectorial (`public/favicon.svg`) enlazado desde `index.html`.
- Sincronización unificada del catálogo mediante `resolvePublicGalleryItems` en `src/services/catalog.service.ts` y soporte de consulta pública REST (`fetchPublicCatalogFromSupabase`) en `src/services/supabase.service.ts`.
- Estado vacío editorial (*Empty State*) en `src/sections/GallerySection.tsx` cuando una categoría aún no tiene trabajos publicados.
- Edición completa de categorías (nombre, descripción, precio y activación/desactivación) y botón de restauración de catálogo en `src/components/admin/AdminPanelView.tsx`.
- Suite E2E `tests/e2e/catalog-flow.test.tsx` validando Lightbox, navegación desde Servicios y flujo completo Admin -> Público.

---

## [0.3.0] - 2026-11-19 — Migración SQL de Supabase, Validación de Archivos y Panel `/admin`

### Añadido
- Migración SQL inicial en `supabase/migrations/0001_initial_schema.sql` (`categories`, `gallery_images`, triggers `updated_at`, índices, políticas RLS y configuración del bucket `gallery` en Storage).
- Archivo `public/_redirects` para enrutamiento SPA en Cloudflare Pages.
- Validador de imágenes (`src/services/file-validation.service.ts`) para JPG/PNG/WebP hasta `5 MB` y construcción segura de `storage_path`.
- Servicio de integración con Supabase (`src/services/supabase.service.ts`) usando `fetch` nativo y modo vista previa local mientras no haya credenciales en `.env`.
- Panel Privado de Administración (`/admin`) con login (`AdminLoginView.tsx`), Dashboard, Galería administrativa, Carga con validación, Gestión de categorías, Ajustes y cierre de sesión (`AdminPanelView.tsx`), manteniendo intactos los placeholders en la web pública.
- Nuevas pruebas automatizadas en `tests/integration/file-validation.test.ts` y `tests/components/admin.test.tsx`.

---

## [0.2.0] - 2026-11-19 — Primera Etapa Visual (Placeholders y Collages Editoriales)

### Añadido
- Configuración base con **React + Vite + TypeScript + Vitest**.
- Sistema de tokens visuales (`src/styles/tokens.css`, `global.css`, `collage.css`) con la paleta y tipografías oficiales.
- Componente `ImagePlaceholder` y sistema de collages editoriales asimétricos (`Hero Diptych`, `Services Mosaic`, `Magazine Spread`, `Category Spotlight` y `Appointment Triptych`) adaptados a móvil, tablet y escritorio sin utilizar fotografías reales ni de stock.
- Secciones públicas completas: Inicio, Servicios, Galería filtrable con Lightbox, Formulario de solicitud de cita conectado a WhatsApp (`wa.me`), Preguntas Frecuentes confirmadas, Contacto, Footer y Botón flotante de WhatsApp.
- Pruebas automatizadas iniciales en `tests/integration/whatsapp.service.test.ts` y `tests/components/app.test.tsx`.

---

## [0.1.0] - 2026-11-19 — Organización y Documentación Inicial

### Añadido
- Incorporación de `docs/PROJECT_MASTER.md` como documento maestro de referencia (20 secciones) y alineación de `AGENTS.md`, `SPEC.md`, `README.md`, `BRAND_GUIDE.md`, `WHATSAPP.md` y `ADMIN_PANEL.md`.
- Creación de documentos principales en la raíz: `AGENTS.md`, `SPEC.md` y `README.md`.
- Creación de la carpeta `docs/` con los manuales: `BRAND_GUIDE.md`, `DESIGN_SYSTEM.md`, `ARCHITECTURE.md`, `DATABASE.md`, `ADMIN_PANEL.md`, `SECURITY.md`, `WHATSAPP.md`, `TESTING.md`, `DEPLOYMENT.md` y `CHANGELOG.md`.
- Creación de reglas y habilidades para Antigravity en `.agents/rules/` y `.agents/skills/`.
- Creación de la estructura base `supabase/` (`README.md`, `migrations/`, `seed.sql` propuesto) y `tests/` (`README.md`, `components/`, `integration/`, `e2e/`).
- Creación de `.gitignore` y `.env.example`.

### Notas
- Se mantiene completamente intacta la carpeta `Assets/` existente en la raíz del proyecto.
- Se mantiene la carpeta `Brand/` existente sin alteraciones.
- No se ha iniciado la implementación del frontend ni se ha conectado una base de datos real.
