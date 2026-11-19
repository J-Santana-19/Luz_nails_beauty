# AGENTS.md — Instrucciones Principales para Agentes y Desarrolladores

Este documento es la guía permanente y de consulta obligatoria para **Antigravity** y cualquier desarrollador que trabaje en el proyecto **Luz Beauty Studio**.

---

## 1. Identidad del Proyecto

- **Nombre:** Luz Beauty Studio
- **Tipo:** Marca personal y catálogo digital de servicios de belleza
- **Instagram oficial:** `@by.luzbeautystudio`
- **Eslogan propuesto:** *"Detalles que realzan tu belleza."*
- **Objetivo:** Presentar los servicios del estudio, mostrar trabajos realizados mediante una galería visual cuidada y facilitar solicitudes de información o cita mediante WhatsApp, además de ofrecer un panel administrativo privado para gestionar la galería y categorías.

---

## 2. Regla Absoluta: Protección de `Assets/`

En la raíz del proyecto existe la carpeta `Assets/` (con `A` mayúscula en el sistema de archivos) que contiene los recursos visuales base del proyecto (paleta de colores y fuentes, styleboard, iconos SVG y subcarpetas de fotos).

**ESTÁ TERMINANTEMENTE PROHIBIDO:**
- Eliminar la carpeta `Assets/`.
- Cambiarle el nombre o moverla de ubicación.
- Modificar, sobrescribir, comprimir, optimizar o eliminar archivos dentro de `Assets/`.
- Reorganizar sus subcarpetas (`Fotos/`, `Icons/`, `Paleta de colores  y Fuentes/`).

Toda documentación o código futuro debe respetar la ubicación exacta `Assets/` y nunca proponer otra carpeta que la sustituya ni alterar su contenido.

---

## 3. Tecnologías Seleccionadas

| Capa | Tecnología | Estado |
| :--- | :--- | :--- |
| Desarrollo asistido | Google Antigravity | Confirmado |
| Control de versiones | GitHub | Confirmado |
| Alojamiento y despliegue | Cloudflare Pages | Confirmado |
| Backend y BaaS | Supabase | Confirmado |
| Base de datos | PostgreSQL (Supabase) | Confirmado |
| Autenticación admin | Supabase Auth | Confirmado |
| Almacenamiento de imágenes | Supabase Storage | Confirmado |
| Framework de frontend | React + Vite + TypeScript | Confirmado (Primera etapa visual aprobada) |

> **Regla:** No incorporar Firebase ni tecnologías adicionales sin evaluar previamente su necesidad y compatibilidad con el stack actual.

---

## 4. Documentación Obligatoria

Antes de diseñar, planificar o desarrollar nuevas funcionalidades, el agente debe consultar los documentos pertinentes, tomando como fuente principal de definición del proyecto a [`docs/PROJECT_MASTER.md`](./docs/PROJECT_MASTER.md):

- [`docs/PROJECT_MASTER.md`](./docs/PROJECT_MASTER.md) — **Documento maestro** del proyecto (20 secciones; fuente principal de información y referencia permanente).
- [`SPEC.md`](./SPEC.md) — Especificaciones completas del producto (requisitos funcionales, no funcionales, exclusiones y criterios de aceptación).
- [`README.md`](./README.md) — Visión general, estructura, configuración y estado del proyecto.
- [`docs/BRAND_GUIDE.md`](./docs/BRAND_GUIDE.md) — Identidad visual, paleta de colores, tipografías, logotipo y uso fotográfico.
- [`docs/DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md) — Sistema de diseño, componentes, espaciados, estados y responsive.
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — Arquitectura técnica y flujo de datos entre frontend, Cloudflare Pages y Supabase.
- [`docs/DATABASE.md`](./docs/DATABASE.md) — Esquema de PostgreSQL, índices, políticas RLS y buckets de Storage.
- [`docs/ADMIN_PANEL.md`](./docs/ADMIN_PANEL.md) — Especificación del panel administrativo privado.
- [`docs/SECURITY.md`](./docs/SECURITY.md) — Políticas de seguridad, autenticación, RLS y validación de archivos.
- [`docs/WHATSAPP.md`](./docs/WHATSAPP.md) — Flujo del formulario de solicitud de cita y enlaces `wa.me`.
- [`docs/TESTING.md`](./docs/TESTING.md) — Estrategia de pruebas y criterios de verificación.
- [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) — Procedimiento de despliegue en Cloudflare Pages mediante GitHub.

---

## 5. Reglas de Programación

- **Código limpio y modular:** Funciones pequeñas, con responsabilidad única y baja complejidad.
- **Componentes reutilizables:** Evitar duplicar interfaz o lógica compartida; extraer utilidades y componentes comunes.
- **Nombres descriptivos:** Identificadores claros y consistentes en todo el proyecto.
- **Separación de responsabilidades:** Mantener desacopladas la capa visual (UI), la lógica de negocio/formateo (ej. construcción de enlaces WhatsApp) y el acceso a datos (Supabase).
- **Evitar código duplicado:** Reutilizar helpers y patrones existentes.
- **Evitar dependencias innecesarias:** Evaluar cualquier librería externa antes de instalarla.
- **Manejo de errores:** Capturar y mostrar errores de forma amigable para el usuario sin exponer detalles internos ni trazas técnicas.
- **Estabilidad:** No introducir cambios que rompan funcionalidades existentes ni realizar modificaciones innecesarias fuera del alcance solicitado.

---

## 6. Reglas Visuales

- Respetar estrictamente la identidad visual definida en [`docs/BRAND_GUIDE.md`](./docs/BRAND_GUIDE.md) y [`docs/DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md).
- Utilizar exclusivamente los colores oficiales:
  - Negro elegante: `#171317`
  - Rosa principal: `#E83E78`
  - Rosa suave: `#F5C8D9`
  - Marfil: `#FFF9F7`
  - Malva grisáceo: `#8C7C84`
  - Blanco: `#FFFFFF`
- Utilizar las tipografías oficiales: **Cormorant Garamond** (títulos, encabezados y frases destacadas) y **DM Sans** (párrafos, navegación, botones, formularios y textos secundarios).
- Mantener coherencia visual entre la web pública y el panel administrativo.
- **Priorizar dispositivos móviles (Mobile-First):** La mayoría de las visitas provendrán de redes sociales (Instagram) desde teléfonos móviles.
- Diseñar interfaces modernas, elegantes, delicadas, minimalistas y fáciles de usar.

---

## 7. Reglas de Seguridad

- **Cero secretos en código o repositorio:** Nunca exponer credenciales privadas, `service_role` keys ni subir archivos `.env` a GitHub.
- **Frontend seguro:** Utilizar únicamente claves públicas (`anon key` de Supabase) en el cliente, confiando la seguridad real a PostgreSQL RLS.
- **Rutas administrativas protegidas:** Toda ruta y acción del panel administrativo requiere sesión válida en Supabase Auth.
- **Políticas RLS obligatorias:** Todas las tablas de PostgreSQL deben tener Row Level Security (RLS) habilitado con políticas explícitas de lectura pública controlada y escritura restringida a administradores autenticados.
- **Validación en backend:** Validar permisos, tipos de datos y reglas de negocio en PostgreSQL / Supabase (RLS, constraints, políticas de Storage).
- **Validación de archivos subidos:** Verificar formato MIME, extensión y tamaño máximo de las imágenes antes y durante la subida a Supabase Storage.

---

## 8. Reglas para Realizar Modificaciones

Antes de modificar cualquier archivo de código o configuración:

1. **Comprender** la funcionalidad existente y su contexto.
2. **Consultar** la documentación relacionada (`SPEC.md` y `docs/*.md`).
3. **Identificar** exactamente los archivos involucrados.
4. **Revisar** dependencias e impactos laterales.
5. **Realizar** el cambio mínimo necesario y bien estructurado.
6. **Verificar** que el resultado funciona correctamente.
7. **Actualizar** la documentación (`docs/CHANGELOG.md`, `SPEC.md`, etc.) si el cambio afecta arquitectura, esquema o comportamiento.

> **Recordatorio:** Nunca modificar, mover ni eliminar la carpeta `Assets/` ni ninguno de sus archivos.

---

## 9. Verificación Obligatoria

Antes de considerar terminada cualquier tarea de desarrollo:

- Revisar que no existan errores de compilación, sintaxis o consola.
- Ejecutar las pruebas pertinentes según [`docs/TESTING.md`](./docs/TESTING.md).
- Comprobar compatibilidad y diseño en dispositivos móviles y escritorio.
- Revisar aspectos de seguridad (sin secretos expuestos, rutas protegidas, RLS intacto).
- Verificar que se mantienen intactas las funcionalidades previas.
- Confirmar que la carpeta `Assets/` permanece sin alteraciones.
- Documentar los cambios importantes realizados.

---

## 10. Sincronización Obligatoria con GitHub

- **Repositorio oficial:** `https://github.com/J-Santana-19/Luz_nails_beauty` (rama principal `main`).
- **Actualización tras cada cambio:** Al terminar y verificar cualquier modificación en el proyecto, el agente debe hacer `git add`, `git commit` (con un mensaje descriptivo claro) y `git push origin main` para mantener el repositorio de GitHub siempre actualizado, verificando previamente que no se incluyan archivos `.env`, secretos ni alteraciones en `Assets/`.
