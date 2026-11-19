---
trigger: always_on
description: Reglas obligatorias de seguridad, manejo de credenciales, RLS y validación de archivos.
---

# Reglas de Seguridad

- **Cero secretos en el repositorio:** Nunca escribir credenciales reales ni claves `service_role` en código, documentación o archivos rastreados por Git. Nunca crear ni commitear `.env`.
- **Solo `anon key` en cliente:** El frontend solo puede usar la URL de Supabase y la `anon key` pública.
- **Protección de rutas admin:** Toda vista y acción bajo `/admin` debe verificar sesión válida en Supabase Auth.
- **Validación de archivos:** Antes de subir a Supabase Storage, validar tipo MIME (`image/jpeg`, `image/png`, `image/webp`) y tamaño máximo (`5 MB`), y sanitizar el nombre del archivo.
- **Enlaces externos:** Usar `rel="noopener noreferrer"` en enlaces que abran nuevas pestañas (WhatsApp, Instagram).
- **Sin XSS:** No renderizar HTML sin sanitizar proveniente de base de datos o parámetros URL.
