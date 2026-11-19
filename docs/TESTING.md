# TESTING.md — Plan de Pruebas y Criterios de Verificación

Este documento define la estrategia de pruebas para **Luz Beauty Studio**.

> **Estado actual:** Suite completa de pruebas implementada con **Vitest + Testing Library** (`npm test`) cubriendo las carpetas `components/`, `integration/` y `e2e/` (flujos públicos, Lightbox, WhatsApp, validación de archivos, panel administrativo `/admin` y sincronización en tiempo real en modo vista previa local). Quedan pendientes las pruebas contra una instancia remota real de Supabase.

---

## 1. Organización de la Carpeta `tests/`

- `tests/components/`: Pruebas unitarias y de componentes de interfaz (ej. renderizado de tarjetas, filtros de galería, validación del formulario).
- `tests/integration/`: Pruebas de integración entre módulos (ej. flujo de construcción de enlace WhatsApp, interacción simulada o controlada con cliente Supabase, protección de rutas admin).
- `tests/e2e/`: Pruebas de extremo a extremo sobre flujos completos de visitante y administrador en navegador real o headless.

---

## 2. Casos de Prueba Planificados

### A. Web Pública
- Renderizado correcto de todas las secciones (Inicio, Servicios, Galería, Solicitud de cita, FAQ, Contacto, Footer) en móvil (`375px`) y escritorio (`1280px`).
- Visualización de las 6 categorías oficiales.
- Filtrado de galería por categoría y estado vacío cuando una categoría no tiene fotos.
- Apertura, navegación y cierre del modal/lightbox de imagen ampliada.
- Carga exclusiva de imágenes con `is_published = true`.

### B. Formulario de Solicitud de Cita y WhatsApp
- Bloqueo de envío si faltan campos obligatorios (Nombre, Servicio, Fecha, Horario).
- Rechazo de fechas pasadas.
- Generación exacta de la URL `https://wa.me/...` con texto correctamente codificado (`encodeURIComponent`).
- Presencia de botones de acceso directo y botón flotante de WhatsApp.

### C. Panel Administrativo y Seguridad
- Redirección a login si se intenta acceder a `/admin` sin sesión.
- Inicio y cierre de sesión con Supabase Auth.
- Subida de imagen válida (`JPG/PNG/WEBP <= 5 MB`) y rechazo de formatos o tamaños inválidos.
- Edición, publicación/ocultamiento (`is_published`) y eliminación (Storage + BD).
- Verificación de RLS: peticiones anónimas no pueden insertar, actualizar ni eliminar registros ni leer imágenes ocultas.

---

## 3. Lista de Verificación Manual Previa a Despliegue

Antes de publicar una versión en producción:
1. Comprobar que no hay errores en consola del navegador.
2. Verificar comportamiento responsive en móvil real o emulador.
3. Confirmar que no hay secretos en el bundle generado.
4. Verificar que la carpeta `Assets/` permanece intacta.
