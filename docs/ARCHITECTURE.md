# ARCHITECTURE.md — Arquitectura Técnica

Este documento describe la arquitectura planificada para **Luz Beauty Studio**, sus componentes, integraciones y flujo de datos.

> **Estado:** Arquitectura **planificada**. La implementación de código frontend y despliegue aún no ha iniciado.

---

## 1. Visión General de la Arquitectura

El sistema sigue una arquitectura **Jamstack / SPA desacoplada sin servidor backend propio**:

- **Frontend:** Aplicación web estática/SPA alojada en **Cloudflare Pages** (framework frontend `PENDIENTE DE CONFIRMACIÓN`).
- **Backend as a Service (BaaS):** **Supabase**, que provee:
  - **PostgreSQL** para persistencia de categorías y metadatos de galería.
  - **Supabase Auth** para autenticación del administrador.
  - **Supabase Storage** para almacenamiento y entrega pública de fotografías.
- **Control de versiones y CI/CD:** **GitHub** conectado a **Cloudflare Pages** para despliegues automáticos.
- **Canal de citas:** Enlaces estructurados hacia **WhatsApp (`wa.me`)** generados en el navegador.

---

## 2. Diagrama Lógico de Componentes

```text
+-------------------------------------------------------------------+
|                        VISITANTE / ADMIN                          |
|                    (Navegador Móvil / Desktop)                    |
+---------------------------------+---------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                   CLOUDFLARE PAGES (CDN Global)                   |
|   - Web Pública (Catálogo, Galería, Formulario WhatsApp, FAQ)     |
|   - Panel Administrativo (/admin)                                 |
+----------------+---------------------------------+----------------+
                 |                                 |
    Lectura/Auth | (HTTPS + Anon Key + JWT)        | Redirección wa.me
                 v                                 v
+---------------------------------+       +-------------------------+
|            SUPABASE             |       |        WHATSAPP         |
|  - Auth (Sesiones Admin)        |       |  (App / Web del cliente |
|  - PostgreSQL + RLS             |       |   con mensaje armado)   |
|  - Storage (Bucket de fotos)    |       +-------------------------+
+---------------------------------+
```

---

## 3. Responsabilidades por Componente

### Frontend (Cloudflare Pages)
- Renderizar la web pública con diseño Mobile-First.
- Consultar categorías activas e imágenes publicadas desde Supabase mediante el cliente oficial de Supabase (usando únicamente `SUPABASE_URL` y `SUPABASE_ANON_KEY`).
- Validar el formulario de solicitud de cita y construir el enlace `wa.me` codificado.
- Proveer la interfaz del panel administrativo protegido por sesión de Supabase Auth.

### GitHub
- Repositorio central del código fuente, documentación y migraciones SQL (`supabase/migrations/`).
- Dispara compilaciones y despliegues en Cloudflare Pages ante cambios en la rama principal (`main`) o previews en Pull Requests.

### Cloudflare Pages
- Aloja los archivos estáticos generados en el build.
- Provee HTTPS automático, CDN global y gestión segura de variables de entorno de compilación.

### Supabase (PostgreSQL + Auth + Storage)
- **PostgreSQL:** Almacena las tablas `categories` y `gallery_images` con Row Level Security (RLS) habilitado.
- **Supabase Auth:** Emite tokens JWT para administradores autenticados; no existe registro público de visitantes.
- **Supabase Storage:** Almacena las fotografías subidas desde el panel administrativo dentro de un bucket dedicado (lectura pública, escritura restringida a administradores autenticados).

---

## 4. Flujos Principales de Información

### Flujo A: Visitante consulta la galería pública
1. El navegador carga la web desde Cloudflare Pages.
2. El frontend solicita a Supabase las categorías activas (`is_active = true`) y las imágenes publicadas (`is_published = true`) ordenadas por `display_order` y fecha.
3. PostgreSQL evalúa las políticas RLS públicas y devuelve únicamente los registros permitidos.
4. El navegador carga las imágenes directamente desde las URLs públicas de Supabase Storage.

### Flujo B: Visitante solicita una cita
1. El visitante completa el formulario (Nombre, Servicio, Fecha, Horario, Hora opcional, Comentarios).
2. El frontend valida los campos requeridos.
3. Se genera un mensaje formateado y codificado (`encodeURIComponent`) y se abre `https://wa.me/<NUMERO>?text=<MENSAJE>`.
4. No se envían datos personales a PostgreSQL ni se confirma la cita automáticamente.

### Flujo C: Administrador gestiona fotografías
1. El administrador inicia sesión en `/admin` mediante Supabase Auth (correo + contraseña).
2. Al subir una imagen:
   - El frontend valida tipo MIME y tamaño antes de subir.
   - Se sube el archivo a Supabase Storage (verificado por política del bucket para usuarios autenticados).
   - Se inserta el registro correspondiente en `gallery_images` con `category_id`, URL/path y estado `is_published`.
3. Al ocultar, editar o eliminar:
   - PostgreSQL valida el JWT mediante RLS antes de aplicar cambios.
   - Al eliminar una foto, se elimina tanto el objeto en Storage como la fila en `gallery_images`.

---

## 5. Decisiones Arquitectónicas Pendientes

- Selección definitiva del **framework frontend** (`PENDIENTE DE CONFIRMACIÓN`).
- Definición del dominio personalizado en Cloudflare Pages (`PENDIENTE DE CONFIRMACIÓN`).
- Decisión sobre si las rutas del panel administrativo usarán enrutamiento SPA (`_redirects` en Cloudflare Pages) o rutas estáticas según el framework elegido.
