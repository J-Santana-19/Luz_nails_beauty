# Luz Beauty Studio

Catálogo digital, portafolio visual de trabajos realizados y canal de solicitud de citas vía WhatsApp para la marca personal **Luz Beauty Studio** (`@by.luzbeautystudio`).

---

## 1. Descripción General

**Luz Beauty Studio** es una aplicación web diseñada para presentar de forma elegante, moderna y femenina los servicios de belleza del estudio, exhibir fotografías reales de trabajos realizados organizadas por categoría y facilitar el contacto directo con potenciales clientas a través de WhatsApp.

Además, cuenta con un panel administrativo privado para que la propietaria del estudio pueda subir, organizar, publicar, ocultar o eliminar fotografías del portafolio de forma autónoma.

---

## 2. Objetivo

- Transmitir una identidad visual profesional, minimalista y elegante acorde a la marca.
- Mostrar trabajos reales por categoría de servicio para generar confianza en nuevas clientas.
- Canalizar solicitudes de cita de manera ordenada hacia WhatsApp sin la complejidad de un sistema de reservas o pagos en línea.

---

## 3. Características Principales

- **Web pública Mobile-First:** Secciones de Inicio, Servicios, Galería, Solicitud de cita, Preguntas frecuentes, Contacto y Footer.
- **Portafolio dinámico por categorías:** Uñas, Pedicure, Maquillaje, Pestañas, Cejas y Depilación, con filtros y vista ampliada.
- **Solicitud de cita conectada a WhatsApp:** Formulario estructurado que genera automáticamente un mensaje organizado mediante enlace `wa.me` (sin confirmación automática).
- **Botón flotante de WhatsApp:** Acceso rápido al chat directo desde cualquier punto de la web.
- **Panel administrativo privado:** Autenticación segura con Supabase Auth para gestionar categorías e imágenes almacenadas en Supabase Storage y PostgreSQL.

---

## 4. Stack Tecnológico

| Componente | Tecnología | Estado |
| :--- | :--- | :--- |
| Desarrollo | Google Antigravity | Confirmado |
| Repositorio y control de versiones | GitHub | Confirmado |
| Alojamiento y despliegue | Cloudflare Pages | Confirmado |
| Backend / BaaS | Supabase | Confirmado |
| Base de datos | PostgreSQL (Supabase) | Confirmado |
| Autenticación | Supabase Auth | Confirmado |
| Almacenamiento de imágenes | Supabase Storage | Confirmado |
| Framework Frontend | React + Vite + TypeScript | Confirmado |

---

## 5. Arquitectura Resumida

1. El sitio web estático/SPA se aloja en **Cloudflare Pages**, desplegándose automáticamente desde **GitHub**.
2. El frontend público consulta a **Supabase (PostgreSQL)** únicamente las categorías activas y las imágenes publicadas (`is_published = true`), cargando los archivos multimedia desde **Supabase Storage**.
3. El formulario de solicitud de cita no escribe en base de datos: formatea los datos en el cliente y redirige a **WhatsApp (`wa.me`)**.
4. El panel administrativo utiliza **Supabase Auth** para autenticar al administrador y ejecutar operaciones de escritura protegidas por **Row Level Security (RLS)**.

Para más detalle, consultar [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).

---

## 6. Estructura de Carpetas

```text
Luznailsbeauty/
├── AGENTS.md                   # Guía principal y reglas permanentes para agentes
├── SPEC.md                     # Especificaciones completas del producto
├── README.md                   # Documentación general del proyecto
├── .gitignore                  # Exclusiones de control de versiones
├── .env.example                # Plantilla de variables de entorno
├── Assets/                     # [INTOCAR / PROTEGIDA] Recursos originales de marca e iconos
│   ├── Fotos/                  # Subcarpetas por categoría (Cejas, Depilación, Manicure, Maquillaje, Pedicure, Pestañas)
│   ├── Icons/                  # Iconos SVG originales
│   └── Paleta de colores  y Fuentes/  # Referencias visuales y Brand Styleboard
├── Brand/                      # Carpeta existente (actualmente vacía)
├── docs/                       # Documentación técnica, visual y operativa
│   ├── BRAND_GUIDE.md
│   ├── DESIGN_SYSTEM.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── ADMIN_PANEL.md
│   ├── SECURITY.md
│   ├── WHATSAPP.md
│   ├── TESTING.md
│   ├── DEPLOYMENT.md
│   └── CHANGELOG.md
├── .agents/                    # Reglas y habilidades locales para Antigravity
│   ├── rules/
│   └── skills/
├── supabase/                   # Migraciones SQL y documentación de base de datos
│   ├── README.md
│   ├── seed.sql
│   └── migrations/
└── tests/                      # Estructura planificada de pruebas (components, integration, e2e)
    ├── README.md
    ├── components/
    ├── integration/
    └── e2e/
```

> **Advertencia:** La carpeta `Assets/` contiene recursos originales protegidos y **no debe modificarse, renombrarse ni moverse**.

---

## 7. Documentación Disponible

- [`docs/PROJECT_MASTER.md`](./docs/PROJECT_MASTER.md) — **Documento maestro** del proyecto (fuente principal de definición en 20 secciones).
- [`AGENTS.md`](./AGENTS.md) — Reglas de desarrollo, seguridad, diseño y flujo de trabajo.
- [`SPEC.md`](./SPEC.md) — Requisitos funcionales, no funcionales y criterios de aceptación.
- [`docs/BRAND_GUIDE.md`](./docs/BRAND_GUIDE.md) — Identidad de marca, colores, tipografías y estilo visual.
- [`docs/DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md) — Sistema de diseño y componentes de UI.
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — Arquitectura técnica y flujo de datos.
- [`docs/DATABASE.md`](./docs/DATABASE.md) — Diseño de PostgreSQL, RLS y Storage.
- [`docs/ADMIN_PANEL.md`](./docs/ADMIN_PANEL.md) — Especificación del panel administrativo.
- [`docs/SECURITY.md`](./docs/SECURITY.md) — Políticas de seguridad y protección de datos.
- [`docs/WHATSAPP.md`](./docs/WHATSAPP.md) — Integración de WhatsApp y formato de mensajes.
- [`docs/TESTING.md`](./docs/TESTING.md) — Plan de pruebas y verificación.
- [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) — Despliegue en Cloudflare Pages desde GitHub.
- [`docs/CHANGELOG.md`](./docs/CHANGELOG.md) — Registro de cambios del proyecto.

---

## 8. Requisitos de Instalación

- **Node.js** `v20+` o `v22+` (probado en `v22.22.1`)
- **npm** `v9+`

---

## 9. Variables de Entorno Necesarias

Las variables previstas se encuentran documentadas en [`.env.example`](./.env.example). Ninguna credencial real debe almacenarse en el repositorio.

Variables previstas (prefijo `PUBLIC_` configurado en `vite.config.ts`):
- `PUBLIC_SUPABASE_URL`: URL del proyecto Supabase (para integración en etapas siguientes).
- `PUBLIC_SUPABASE_ANON_KEY`: Clave pública (`anon key`) de Supabase.
- `PUBLIC_WHATSAPP_NUMBER`: Número de WhatsApp empresarial (formato internacional sin `+`, `PENDIENTE DE CONFIRMACIÓN`).

---

## 10. Instrucciones para Ejecutar Localmente

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Ejecutar pruebas automatizadas
npm test

# 4. Generar compilación de producción (dist/)
npm run build
```

---

## 11. Procedimiento de Despliegue

El despliegue se realizará conectando el repositorio de **GitHub** con **Cloudflare Pages**, configurando las variables de entorno en el panel de Cloudflare (`Build command: npm run build`, `Build output directory: dist`). El procedimiento detallado se encuentra en [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md).

---

## 12. Estado Actual del Proyecto

- **Fase actual:** Web pública con **Image Placeholders** y collages editoriales asimétricos, migración SQL inicial de Supabase (`supabase/migrations/0001_initial_schema.sql`), validador de archivos y **Panel Privado de Administración (`/admin`)** implementados.
- **Conexión remota con Supabase:** Lista a nivel de código y migraciones; pendiente de configurar proyecto real y variables en `.env` / Cloudflare Pages.
- **Repositorio Git:** No inicializado localmente en este workspace al momento de actualizar esta documentación.

---

## 13. Información Pendiente

Los siguientes elementos están marcados como `PENDIENTE DE CONFIRMACIÓN` y deben ser definidos antes o durante las siguientes etapas:

- **Técnico:** Dominio web propio, configuración de proyecto en Supabase y repositorio remoto en GitHub.
- **Comercial / Negocio:** Número oficial de WhatsApp, teléfono empresarial, dirección del estudio, horarios de atención, lista de precios, técnicas específicas por categoría, políticas de cancelación, métodos de pago, fotografías definitivas de trabajos y versión final del logotipo.
