# BRAND_GUIDE.md — Manual de Identidad de Marca

Este documento define la identidad visual oficial de **Luz Beauty Studio**, basada en los lineamientos del proyecto y el material gráfico de referencia ubicado en `Assets/Paleta de colores  y Fuentes/Luz Beauty Studio Brand Styleboard.png`.

---

## 1. Datos de Marca

- **Nombre:** Luz Beauty Studio
- **Instagram oficial:** `@by.luzbeautystudio`
- **Eslogan propuesto:** *"Detalles que realzan tu belleza."* (`PENDIENTE DE CONFIRMACIÓN` final)
- **Subtítulo de apoyo en portada:** *"Uñas, belleza y cuidado en un solo lugar, con un toque de elegancia."*

---

## 2. Concepto Visual y Personalidad

### Concepto visual
Estética editorial de lujo accesible: combina fondos oscuros sofisticados (`#171317`) con acentos en rosa vibrante (`#E83E78`), superficies suaves en marfil (`#FFF9F7`) y rosa pastel (`#F5C8D9`), logrando equilibrio entre calidez, delicadeza y profesionalismo.

### Personalidad de marca
- **Elegante**
- **Femenina**
- **Moderna**
- **Profesional**
- **Delicada**
- **Cercana**
- **Creativa**
- **Minimalista** (espacios limpios y organizados)

---

## 3. Paleta de Colores Oficial

| Nombre | Código HEX | Uso principal recomendado |
| :--- | :--- | :--- |
| **Negro elegante** | `#171317` | Fondos principales oscuros (header, hero, galería destacada, footer), textos sobre fondos claros. |
| **Rosa principal** | `#E83E78` | Botones primarios (CTA), énfasis tipográfico en cursiva, bordes destacados, iconos activos y enlaces. |
| **Rosa suave** | `#F5C8D9` | Fondos circulares de iconos de categorías, acentos delicados, etiquetas suaves y estados sutiles. |
| **Marfil** | `#FFF9F7` | Fondos claros de secciones (ej. banda de servicios/categorías, tarjetas claras, formularios). |
| **Malva grisáceo** | `#8C7C84` | Textos secundarios, subtítulos, metadatos, bordes discretos y placeholders. |
| **Blanco** | `#FFFFFF` | Textos sobre fondo `#171317` o `#E83E78`, superficies limpias y alto contraste. |

> **Regla:** No introducir colores fuera de esta paleta salvo variantes de opacidad derivadas de estos mismos HEX (por ejemplo, overlays oscuros o halos suaves). Distribución orientativa según [`PROJECT_MASTER.md`](./PROJECT_MASTER.md): 45% marfil y blanco, 25% negro elegante, 15% rosa suave, 10% rosa principal y 5% malva grisáceo.

---

## 4. Tipografías Oficiales

### 1. Cormorant Garamond (Serif editorial)
- **Uso:** Títulos principales (`h1`), encabezados de sección (`h2`, `h3`), frases destacadas y nombre de marca.
- **Estilo característico:** Combinar peso regular/medio en blanco (`#FFFFFF`) o negro elegante (`#171317`) con palabras clave en **cursiva (italic) y color rosa principal (`#E83E78`)**, por ejemplo: *"Detalles que realzan tu **belleza.**"* o *"Nuestros **Trabajos**"*.

### 2. DM Sans (Sans-serif geométrica y legible)
- **Uso:** Párrafos, navegación, botones, etiquetas de formulario, textos secundarios y detalles técnicos.
- **Ventaja:** Máxima legibilidad en pantallas móviles pequeñas y formularios.

### Escala tipográfica orientativa (Responsive)

| Nivel | Fuente | Tamaño móvil | Tamaño escritorio | Peso |
| :--- | :--- | :--- | :--- | :--- |
| Hero (`h1`) | Cormorant Garamond | `36px` – `42px` | `56px` – `64px` | 500–600 |
| Título de sección (`h2`) | Cormorant Garamond | `28px` – `32px` | `40px` – `48px` | 500–600 |
| Subtítulo (`h3`) | Cormorant Garamond / DM Sans | `20px` – `22px` | `24px` – `28px` | 500 |
| Cuerpo (`body`) | DM Sans | `15px` – `16px` | `16px` – `18px` | 400 |
| Botones / Nav | DM Sans | `14px` – `15px` | `15px` – `16px` | 500 |
| Textos pequeños / Detalles | DM Sans | `12px` – `13px` | `13px` – `14px` | 400 |

---

## 5. Logotipo

- **Referencia visual actual:** Monograma circular con las iniciales **LS** estilizadas integrando una silueta femenina y destellos en `#E83E78` y `#F5C8D9`, acompañado del texto *"Luz Beauty"* (blanco) y *"Studio"* (cursiva en `#E83E78`).
- **Estado:** `PENDIENTE DE CONFIRMACIÓN` (versión final del logotipo en formatos vectoriales/PNG de alta resolución).
- **Reglas de uso:**
  - Mantener siempre área de respeto alrededor del monograma y texto.
  - No deformar, estirar ni alterar los colores del logotipo.
  - Usar preferentemente sobre fondo `#171317` o con el contraste adecuado si se adapta a fondo claro.

---

## 6. Uso de Fotografías

- Las fotografías son el elemento protagonista del portafolio.
- Deben ser nítidas, bien iluminadas, con encuadre limpio y coherentes con la estética elegante del estudio.
- En el sitio público deben mostrarse con bordes redondeados suaves (acorde al estilo del styleboard) y relación de aspecto consistente para mantener armonía visual en la grilla.
- **Estado de fotografías definitivas:** `PENDIENTE DE CONFIRMACIÓN` (las subcarpetas dentro de `Assets/Fotos/` se encuentran actualmente vacías a la espera del material fotográfico final).

---

## 7. Iconografía

- En `Assets/Icons/` existen iconos SVG de referencia para redes sociales (Instagram, WhatsApp), teléfono, citas y servicios de belleza.
- **Estilo:** Iconos lineales (outline) limpios y minimalistas, de trazo fino y uniforme.
- **Aplicación:**
  - En categorías sobre fondo `#FFF9F7`: trazo oscuro (`#171317`) dentro de círculo `#F5C8D9`.
  - En secciones oscuras (`#171317`): trazo en `#E83E78` o `#FFFFFF`.
- **Protección:** Los archivos en `Assets/Icons/` no deben modificarse directamente; si se utilizan en código, deben copiarse o referenciarse respetando intacta la carpeta `Assets/`.
