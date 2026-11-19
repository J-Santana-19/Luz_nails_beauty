# DESIGN_SYSTEM.md — Sistema de Diseño

Este documento traduce la identidad de [`BRAND_GUIDE.md`](./BRAND_GUIDE.md) a tokens, componentes, estados y reglas de interfaz para el frontend público y el panel administrativo.

---

## 1. Tokens de Color

| Token lógico | Valor HEX | Aplicación |
| :--- | :--- | :--- |
| `--color-bg-dark` | `#171317` | Fondo principal oscuro, header, hero, footer |
| `--color-bg-light` | `#FFF9F7` | Bandas claras, tarjetas claras, inputs sobre fondo claro |
| `--color-primary` | `#E83E78` | Botones primarios, énfasis, bordes activos, focus |
| `--color-primary-soft` | `#F5C8D9` | Contenedores de iconos, badges suaves, hover sutil |
| `--color-muted` | `#8C7C84` | Textos secundarios, placeholders, divisores discretos |
| `--color-white` | `#FFFFFF` | Texto sobre oscuro/primario, tarjetas limpias |

---

## 2. Tipografías y Jerarquía

- **Display / Títulos:** `Cormorant Garamond`, serif.
- **UI / Cuerpo:** `DM Sans`, sans-serif.
- **Regla de énfasis:** Los títulos principales pueden resaltar 1 o 2 palabras finales en cursiva y color `#E83E78`.
- **Contraste:** Garantizar relación de contraste legible (mínimo WCAG AA) entre texto y fondo en todas las combinaciones.

---

## 3. Espaciados y Contenedores

- **Sistema base:** Múltiplos de `4px` / `8px` (`4, 8, 12, 16, 24, 32, 48, 64, 80`).
- **Ancho máximo de contenido:** `1200px` – `1280px` centrado con padding lateral mínimo de `16px`–`20px` en móvil y `32px` en escritorio.
- **Separación entre secciones:** `48px`–`64px` en móvil; `72px`–`96px` en escritorio.
- **Radios de borde:**
  - Botones estilo píldora: `9999px` (`rounded-full`).
  - Tarjetas y fotografías de galería: `12px`–`16px`.
  - Inputs y modales: `10px`–`16px`.

---

## 4. Botones

1. **Botón Primario:**
   - Fondo `#E83E78`, texto `#FFFFFF`, forma píldora (`9999px`), fuente `DM Sans` peso `500`.
   - Hover: ligero oscurecimiento o brillo sutil + transición suave (`150ms`–`200ms`).
2. **Botón Secundario:**
   - Fondo transparente o `#171317`, borde `1px solid #E83E78` (o `#F5C8D9` con baja opacidad sobre oscuro), texto `#FFFFFF` (en oscuro) o `#171317` (en claro), forma píldora.
3. **Botón / Enlace de Texto:**
   - Texto `#E83E78` (o `#FFFFFF` con acento rosa en hover), acompañado opcionalmente de flecha `→`.
4. **Botón Flotante de WhatsApp:**
   - Posición fija inferior derecha (`bottom: 20px; right: 20px`), accesible con un toque en móvil, área táctil mínima `48px × 48px`, alto contraste y etiqueta `aria-label` descriptiva.

---

## 5. Tarjetas (Cards)

- **Tarjetas de Categoría:**
  - Fondo `#FFF9F7` o transparente sobre banda marfil; icono dentro de círculo `#F5C8D9` (`56px`–`64px`), título corto en `DM Sans` (`14px`–`16px`).
- **Tarjetas de Galería:**
  - Imagen con relación de aspecto uniforme (ej. `4:5` o `1:1`), bordes redondeados (`12px`–`16px`), `object-fit: cover`, efecto zoom muy sutil en hover (`scale(1.02)`).
- **Tarjetas del Panel Administrativo:**
  - Mantienen la misma paleta (preferiblemente superficie clara `#FFF9F7` / `#FFFFFF` con acentos `#E83E78` y textos `#171317` / `#8C7C84`) para comodidad de lectura y edición prolongada.

---

## 6. Formularios

- **Etiquetas (`label`):** Siempre visibles sobre el campo en `DM Sans`, tamaño `14px`, peso `500`.
- **Campos (`input`, `select`, `textarea`):** Altura mínima táctil `44px`, padding horizontal `14px`, borde `1px solid #8C7C84` (opacidad controlada), borde en foco `#E83E78` con anillo visible de accesibilidad.
- **Mensajes de error:** Texto claro debajo del campo en tono de error legible, indicando exactamente cómo corregir el dato.

---

## 7. Menús y Navegación

- **Desktop:** Barra superior fija o estática en `#171317` con logotipo a la izquierda, enlaces centrados/alineados (*Inicio, Servicios, Galería, Solicitar cita, FAQ, Contacto*) y CTA de WhatsApp a la derecha.
- **Móvil:** Logo a la izquierda y botón hamburguesa a la derecha (`44px × 44px`), desplegando menú vertical limpio con cierre automático al seleccionar una sección.

---

## 8. Componentes Clave

- **Navbar pública** y **Footer**
- **Hero banner**
- **Grid / banda de categorías**
- **Filtros de galería (pills)** y **Grid de fotografías**
- **Lightbox / Modal de imagen ampliada**
- **Formulario de solicitud de cita hacia WhatsApp**
- **Acordeón de Preguntas Frecuentes (FAQ)**
- **Botón flotante de WhatsApp**
- **Componentes administrativos:** Login, barra lateral/superior admin, estadísticas resumen, cargador de imágenes (dropzone), tabla/grilla de gestión y modal de confirmación de borrado.

---

## 9. Responsive (Breakpoints orientativos)

- **Móvil pequeño:** `< 640px` (1–2 columnas en galería, diseño apilado, prioridad absoluta).
- **Tableta:** `640px` – `1023px` (2–3 columnas en galería, navegación adaptada).
- **Escritorio:** `>= 1024px` (3–4 columnas en galería, menú horizontal completo).

---

## 10. Animaciones y Estados Visuales

- **Animaciones:** Sutiles, elegantes y breves (`150ms`–`300ms`, `ease-out`). Respetar `prefers-reduced-motion`.
- **Estados visuales obligatorios en todo componente interactivo:**
  - **Default**
  - **Hover / Focus-visible** (anillo de foco accesible)
  - **Active / Selected** (ej. filtro de categoría seleccionado en `#E83E78`)
  - **Loading** (esqueletos o spinners discretos al cargar galería o subir imágenes)
  - **Empty state** (mensaje amigable si una categoría aún no tiene fotos publicadas)
  - **Error state** (mensaje claro con opción de reintentar si falla la conexión con Supabase)
