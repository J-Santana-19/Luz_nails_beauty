# DEPLOYMENT.md — Despliegue en Cloudflare Pages mediante GitHub

Este documento describe el procedimiento planificado para desplegar **Luz Beauty Studio** en **Cloudflare Pages** conectado a **GitHub**.

> **Estado:** Procedimiento listo para configuración con **React + Vite + TypeScript** (`npm run build` -> `dist/`). Pendiente de crear repositorio remoto y dominio definitivo.

---

## 1. Requisitos Previos

1. Repositorio creado en **GitHub** con el código fuente del proyecto.
2. Proyecto creado y configurado en **Supabase** (tablas, RLS, Storage bucket y usuario administrador).
3. Cuenta en **Cloudflare** con acceso a **Cloudflare Pages**.
4. Variables de entorno listas (sin secretos privados de servidor en variables públicas).

---

## 2. Configuración en Cloudflare Pages

1. Ingresar al panel de Cloudflare -> **Workers & Pages** -> **Create** -> **Pages** -> **Connect to Git**.
2. Seleccionar el repositorio de **GitHub** del proyecto.
3. Configurar los ajustes de compilación:
   - **Production branch:** `main`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Configurar **Environment variables** (para Production y Preview):
   - URL pública de Supabase
   - `anon key` pública de Supabase
   - Número oficial de WhatsApp empresarial

---

## 3. Enrutamiento SPA (si aplica)

Si el framework seleccionado funciona como Single Page Application (SPA) con rutas como `/admin`:
- Asegurar un archivo `_redirects` en la carpeta de salida pública (o regla equivalente del framework) para evitar errores `404` al recargar directamente `/admin`.

---

## 4. Dominio Personalizado y HTTPS

- **Dominio web:** `PENDIENTE DE CONFIRMACIÓN`.
- Una vez adquirido el dominio, vincularlo en Cloudflare Pages -> **Custom domains** para obtener certificados SSL/TLS automáticos.

---

## 5. Flujo Continuo (CI/CD)

- Cada `git push` a una rama o Pull Request genera una **Preview URL** en Cloudflare Pages para validar cambios antes de fusionar.
- Cada fusión a la rama `main` dispara automáticamente el despliegue a producción.
- Nunca desplegar cambios sin ejecutar previamente las verificaciones de [`TESTING.md`](./TESTING.md).
