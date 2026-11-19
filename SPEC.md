# SPEC.md — Especificaciones Completas del Producto

Este documento define **qué se construirá** en el proyecto **Luz Beauty Studio**, sus requisitos funcionales y no funcionales, exclusiones y criterios de aceptación, alineado con el documento maestro [`docs/PROJECT_MASTER.md`](./docs/PROJECT_MASTER.md).

> **Nota sobre información comercial:** Todo dato operativo o comercial no confirmado por el negocio se marca explícitamente como `PENDIENTE DE CONFIRMACIÓN` y no debe inventarse durante el desarrollo.

---

## 1. Información General

- **Nombre del proyecto:** Luz Beauty Studio
- **Objetivo:** Presentar la marca personal de servicios de belleza, exhibir un portafolio visual organizado por categorías y canalizar solicitudes de cita o información directamente hacia WhatsApp, contando con un panel administrativo privado para mantener actualizada la galería.
- **Descripción:** Sitio web de marca personal que combina una presentación elegante de servicios, galería dinámica conectada a Supabase y un formulario estructurado de solicitud de cita conectado a WhatsApp.
- **Público objetivo:** Clientes potenciales (principalmente usuarias móviles provenientes de Instagram `@by.luzbeautystudio` y recomendaciones) interesadas en servicios de uñas, pedicure, maquillaje, pestañas, cejas y depilación.
- **Alcance:**
  - Sitio web público responsive (Mobile-First).
  - Galería dinámica filtrable por categorías con vista ampliada.
  - Formulario de solicitud de cita que genera un mensaje estructurado para WhatsApp (`wa.me`).
  - Panel administrativo privado autenticado con Supabase Auth para gestionar categorías e imágenes en Supabase Storage y PostgreSQL.

---

## 2. Concepto de la Web

Luz Beauty Studio es una **web de marca personal que funciona como catálogo visual y portafolio de trabajos realizados**.

**La web NO será:**
- Una tienda online (e-commerce).
- Una plataforma de reservas automáticas con calendario de disponibilidad en tiempo real.
- Un sistema CRM o de gestión de clientes.
- Una pasarela o plataforma de pagos.

---

## 3. Secciones Públicas

El sitio público estará organizado en las siguientes secciones:

1. **Inicio (Hero):**
   - Logotipo oficial de Luz Beauty Studio.
   - Eslogan propuesto: *"Detalles que realzan tu belleza."* (`PENDIENTE DE CONFIRMACIÓN` final del texto).
   - Breve descripción introductoria.
   - Botón principal de acción (*Explorar Servicios*) y botón secundario (*Consultar por WhatsApp*).
2. **Servicios:**
   - Presentación visual de las 6 categorías oficiales con sus iconos, descripción general y acceso directo a los trabajos de esa categoría o a consulta.
   - Precios y técnicas específicas: `PENDIENTE DE CONFIRMACIÓN`.
3. **Galería:**
   - Muestra dinámica de trabajos realizados obtenidos desde Supabase.
   - Filtros por categoría y vista ampliada (lightbox).
4. **Solicitud de cita:**
   - Formulario estructurado para preparar la solicitud de cita y enviarla por WhatsApp.
5. **Preguntas frecuentes (FAQ):**
   - Acordeón o listado claro de dudas comunes sobre citas, horarios, ubicación y cuidados.
6. **Contacto:**
   - Canales de contacto directo: WhatsApp, Instagram (`@by.luzbeautystudio`), teléfono empresarial (`PENDIENTE DE CONFIRMACIÓN`), dirección (`PENDIENTE DE CONFIRMACIÓN`) y horarios de atención (`PENDIENTE DE CONFIRMACIÓN`).
7. **Footer:**
   - Logotipo y eslogan, enlaces rápidos de navegación, datos de contacto, enlace a Instagram y aviso de derechos reservados de Luz Beauty Studio.

---

## 4. Categorías de Servicios

Las categorías oficiales del estudio son exactamente las siguientes 6:

1. **Manicure** *(nota: la subcarpeta de referencia en `Assets/Fotos/servicios/` se llama `Manicure`)*
2. **Pedicure**
3. **Maquillaje**
4. **Pestañas**
5. **Cejas**
6. **Depilación**

### Reglas por categoría
- Cada categoría debe permitir mostrar **fotografías** (desde la galería), **descripciones** y, cuando el negocio lo confirme, **precios** (`PENDIENTE DE CONFIRMACIÓN`).
- **No inventar** técnicas, duraciones ni servicios específicos dentro de cada categoría hasta contar con confirmación del negocio.

---

## 5. Galería

La galería es el núcleo visual del portafolio:

- **Organización por categorías:** Cada fotografía publicada pertenece a una de las categorías activas.
- **Filtros:** El visitante puede ver todas las fotografías publicadas o filtrar por categoría (ej. *Todas*, *Uñas*, *Pedicure*, *Maquillaje*, *Pestañas*, *Cejas*, *Depilación*).
- **Visualización ampliada:** Al hacer clic/tocar una fotografía se abre un modal o lightbox para verla en mayor tamaño, con su título/descripción opcional y navegación entre imágenes.
- **Carga dinámica:** Las imágenes visibles se consultan dinámicamente desde PostgreSQL (`gallery_images` donde `is_published = true`) y se sirven mediante URLs públicas de Supabase Storage, aplicando carga diferida (`lazy loading`) para optimizar el rendimiento.
- **Actualización administrativa:** Todo cambio realizado desde el panel administrativo (subir, editar, publicar, ocultar o eliminar) se refleja automáticamente en la web pública sin necesidad de redesplegar el sitio.
- **Autenticidad visual:** No utilizar imágenes generadas por IA como si fueran trabajos reales de Luz Beauty Studio.

---

## 6. Formulario de Solicitud de Cita

El formulario permite al visitante organizar su consulta antes de enviarla por WhatsApp.

### Campos requeridos y comportamiento

| Campo | Tipo | Obligatorio | Comportamiento |
| :--- | :--- | :--- | :--- |
| **Nombre** | Texto | Sí | Nombre de la persona que solicita la cita (`"Escribe tu nombre"`). Se valida que no esté vacío. |
| **Servicio** | Selector (`select`) | Sí | Lista con las 6 categorías oficiales más la opción `"Otro / No estoy seguro"`. |
| **Fecha deseada** | Fecha (`date`) | Sí | Permite seleccionar la fecha preferida (restringiendo fechas pasadas). Es una preferencia, no una reserva confirmada. |
| **Horario preferido** | Selector (`select` / Radio) | Sí | Opciones: `Mañana`, `Tarde`, `Cualquier horario`, `Elegir una hora específica`. |
| **Selección de hora específica** | Selector de hora (`time`) | Condicional | Aparece únicamente cuando el cliente elige `"Elegir una hora específica"`; permite introducir cualquier hora deseada sin limitarse a horarios predefinidos. |
| **Comentarios adicionales** | Área de texto (`textarea`) | Opcional | Espacio para detalles sobre diseño, referencias o consultas adicionales. |

Botón de envío: **"Enviar solicitud por WhatsApp"**.

### Comportamiento al enviar
- Al validar el formulario, el sistema **no guarda una reserva en base de datos** ni confirma la cita automáticamente.
- Se construye un mensaje claro y organizado con todos los datos ingresados, debidamente codificado para URL (`encodeURIComponent`), y se abre WhatsApp mediante un enlace `https://wa.me/<NUMERO>?text=<MENSAJE>`.
- Se debe informar claramente al usuario en la interfaz que **la cita queda sujeta a confirmación por parte del estudio vía WhatsApp**.

---

## 7. Integración con WhatsApp

- **Botón flotante:** Acceso rápido permanente desde cualquier sección pública para iniciar conversación directa por WhatsApp.
- **Contacto directo:** Botones de contacto directo en el Hero, banner de cita y sección/footer de contacto con mensaje predeterminado cordial.
- **Formulario conectado:** Generación dinámica del enlace `wa.me` con los datos del formulario de solicitud de cita (ver detalle técnico en [`docs/WHATSAPP.md`](./docs/WHATSAPP.md)).
- **Número empresarial configurable:** El número de teléfono de WhatsApp debe gestionarse mediante configuración/variable de entorno (`PENDIENTE DE CONFIRMACIÓN` el número definitivo).

---

## 8. Preguntas Frecuentes (FAQ)

Propuestas iniciales de preguntas frecuentes en diseño tipo acordeón (detalle completo en [`docs/PROJECT_MASTER.md`](./docs/PROJECT_MASTER.md), Sección 11). Las respuestas marcadas como pendientes no deben publicarse hasta ser confirmadas por el negocio:

1. **¿Cómo puedo solicitar una cita?** — Vía formulario o contacto directo por WhatsApp.
2. **¿La cita queda confirmada al enviar el formulario?** — No; el estudio responde por WhatsApp para confirmar disponibilidad.
3. **¿Dónde se encuentra Luz Beauty Studio?** — `PENDIENTE DE CONFIRMACIÓN`
4. **¿Cuáles son los precios de los servicios?** — Consultar por WhatsApp o revisar precios publicados cuando estén disponibles (`PENDIENTE DE CONFIRMACIÓN`).
5. **¿Puedo consultar por un diseño específico?** — Sí, compartiendo referencias por WhatsApp.
6. **¿Cómo puedo conocer los trabajos realizados?** — Explorando la galería filtrable por servicio.
7. **¿Puedo elegir una hora específica?** — Sí, mediante el formulario (sujeta a disponibilidad).
8. **¿Qué servicios ofrece Luz Beauty Studio?** — Las 6 categorías oficiales (*Uñas, Pedicure, Maquillaje, Pestañas, Cejas, Depilación*).
9. **¿Qué métodos de pago aceptan?** — `PENDIENTE DE CONFIRMACIÓN`
10. **¿Puedo modificar o cancelar una cita?** — `PENDIENTE DE CONFIRMACIÓN`

---

## 9. Panel Administrativo

Área privada accesible únicamente para administradores autenticados (detalle completo en [`docs/ADMIN_PANEL.md`](./docs/ADMIN_PANEL.md)):

- **Inicio de sesión:** Pantalla de login con correo y contraseña mediante Supabase Auth.
- **Dashboard:** Resumen rápido del estado del catálogo (total de imágenes, imágenes publicadas vs ocultas, categorías activas).
- **Galería administrativa:** Listado/grilla de todas las fotografías (publicadas y ocultas) con filtro por categoría.
- **Subida de fotografías:** Carga de una o varias imágenes a Supabase Storage con validación de formato/tamaño, asignación de categoría, título/descripción opcional y estado inicial.
- **Edición:** Modificar categoría, título, descripción u orden de visualización de una fotografía existente.
- **Categorías:** Visualizar y administrar las categorías (nombre, descripción, orden, estado activo/inactivo).
- **Publicación y ocultamiento:** Alternar el estado `is_published` de cada imagen sin eliminarla.
- **Eliminación:** Eliminar una fotografía (borrando tanto el registro en PostgreSQL como el archivo en Supabase Storage, previa confirmación).

---

## 10. Usuarios y Permisos

| Rol | Autenticación | Permisos |
| :--- | :--- | :--- |
| **Visitante (Público)** | No requiere | Ver secciones públicas, consultar categorías activas, ver imágenes con `is_published = true`, usar formulario hacia WhatsApp. No puede ver imágenes ocultas ni acceder al panel administrativo. |
| **Administrador** | Requerida (Supabase Auth) | Acceso completo al panel administrativo: crear, editar, publicar, ocultar y eliminar imágenes de la galería y gestionar categorías. |

---

## 11. Requisitos No Funcionales

- **Responsive (Mobile-First):** Adaptación fluida desde pantallas móviles pequeñas (`320px`-`375px`) hasta tabletas y escritorio (`1280px+`).
- **Rendimiento:** Imágenes optimizadas al subirlas o mediante carga diferida (`lazy loading`), tiempos de carga rápidos en redes móviles y bundle ligero en Cloudflare Pages.
- **Accesibilidad:** Contraste adecuado según paleta oficial, textos alternativos (`alt`) en imágenes, etiquetas asociadas en formularios y navegación por teclado.
- **Seguridad:** Sin secretos en frontend, RLS estricto en PostgreSQL, Storage protegido para escritura solo por administradores y protección de rutas privadas.
- **SEO:** Metadatos básicos (`title`: *"Luz Beauty Studio | Servicios de Belleza"*, `description`, Open Graph), favicon, HTML semántico y URLs limpias.
- **Mantenimiento:** Código modular y documentado para facilitar futuras actualizaciones (como añadir precios o nuevas categorías).
- **Escalabilidad razonable:** Estructura preparada para crecer en número de fotografías sin degradar la carga (paginación o carga progresiva en galería cuando sea necesario).

---

## 12. Exclusiones (Fuera de Alcance)

No se desarrollará en este proyecto:
- Carrito de compras.
- Procesamiento de pagos en línea.
- Registro o cuentas de clientes finales.
- Sistema de reservas automáticas.
- Calendario interno de disponibilidad o gestión de agenda.
- Gestión de ventas, facturación o inventario.

---

## 13. Criterios de Aceptación

Una funcionalidad se considerará terminada únicamente cuando cumpla lo siguiente:

1. **Secciones públicas:** Todas las secciones definidas cargan correctamente en móvil y escritorio respetando `BRAND_GUIDE.md` y `DESIGN_SYSTEM.md`.
2. **Categorías:** Se muestran las 6 categorías oficiales sin servicios ni precios inventados.
3. **Galería:** Los filtros muestran solo imágenes publicadas de la categoría seleccionada; la vista ampliada abre y cierra correctamente; solo los registros con `is_published = true` son visibles al público.
4. **Formulario y WhatsApp:** No permite envío si faltan campos obligatorios; genera un mensaje legible y codificado; abre `wa.me` con el número configurado; muestra aviso de que la cita no queda confirmada automáticamente.
5. **Panel administrativo:** Usuarios no autenticados son redirigidos al login; un administrador autenticado puede subir, editar, publicar, ocultar y eliminar fotografías reflejándose en la galería pública.
6. **Seguridad:** Las operaciones de escritura en Supabase fallan si no hay sesión administrativa válida (verificado por RLS); no hay credenciales privadas en el código fuente.
7. **Integridad de `Assets/`:** La carpeta `Assets/` permanece intacta.
