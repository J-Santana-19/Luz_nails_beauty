# SECURITY.md — Políticas y Requisitos de Seguridad

Este documento establece las medidas obligatorias de seguridad para proteger los datos, la administración del catálogo y la infraestructura de **Luz Beauty Studio**.

---

## 1. Gestión de Secretos y Variables de Entorno

- **Prohibido subir secretos a GitHub:** Los archivos `.env`, `.env.local` y cualquier archivo con credenciales reales deben estar excluidos en `.gitignore`.
- **Claves en el Frontend:** En el código cliente únicamente pueden utilizarse la URL de Supabase y la `anon key` (clave pública diseñada para trabajar con RLS).
- **Prohibido usar `service_role` en el frontend:** La clave `service_role` otorga acceso total saltando RLS y **jamás** debe incluirse en el código cliente ni en variables públicas de compilación.
- **Almacenamiento de variables en producción:** Todas las variables se configuran directamente en el panel de **Cloudflare Pages** (Settings -> Environment variables).

---

## 2. Autenticación Administrativa (Supabase Auth)

- El registro público de usuarios (`Sign Up`) debe permanecer **deshabilitado** en Supabase Auth si solo la administración accederá al sistema, o restringido mediante políticas de rol/correo autorizado para evitar que terceros creen cuentas y pasen `auth.role() = 'authenticated'`.
- Se recomienda validar un claim de rol administrador (por ejemplo `app_metadata.role = 'admin'`) dentro de las políticas RLS, además de deshabilitar el registro abierto en Supabase.
- Las sesiones administrativas expiran según la configuración de JWT de Supabase Auth y deben cerrarse limpiamente al pulsar *Cerrar sesión*.

---

## 3. Seguridad en Base de Datos (Row Level Security - RLS)

- **RLS habilitado por defecto:** Ninguna tabla en el esquema `public` puede quedar sin RLS.
- **Principio de mínimo privilegio:**
  - El rol `anon` (visitantes) solo tiene permiso `SELECT` sobre categorías activas e imágenes con `is_published = true`.
  - Ningún visitante puede ejecutar `INSERT`, `UPDATE` ni `DELETE`.
  - Las operaciones de escritura solo se permiten a administradores autenticados verificados por RLS.
- **Validación en backend:** Las restricciones de integridad (`NOT NULL`, `UNIQUE`, `REFERENCES`, tipos de datos) deben estar definidas en PostgreSQL y no solo en el frontend.

---

## 4. Seguridad en Subida de Archivos (Supabase Storage)

- **Validación en cliente y servidor/bucket:**
  - Tipos MIME permitidos: `image/jpeg`, `image/png`, `image/webp`.
  - Rechazar archivos ejecutables, SVG subidos por formulario (por riesgo de XSS si se sirven inline) o archivos que superen el límite (`5 MB`).
  - Sanitizar el nombre del archivo y anteponer un `uuid` para evitar colisiones o path traversal.
- **Permisos del bucket `gallery`:**
  - Lectura pública (`SELECT`) para mostrar el portafolio.
  - Escritura y borrado (`INSERT`, `UPDATE`, `DELETE`) exclusivamente para administradores autenticados.

---

## 5. Seguridad en el Frontend y Enlaces Externos

- **Prevención de XSS:** Nunca inyectar HTML sin sanitizar proveniente de base de datos o parámetros URL.
- **Enlaces externos seguros:** Todo enlace externo (WhatsApp `wa.me`, Instagram) que abra en nueva pestaña (`target="_blank"`) debe incluir `rel="noopener noreferrer"`.
- **Protección de `Assets/`:** Ningún script ni proceso automatizado debe alterar o exponer indebidamente la estructura original de `Assets/`.
