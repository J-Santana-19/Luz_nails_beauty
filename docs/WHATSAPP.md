# WHATSAPP.md — Integración del Formulario y Enlaces de WhatsApp

Este documento especifica el funcionamiento de los puntos de contacto hacia WhatsApp en **Luz Beauty Studio**.

---

## 1. Configuración del Número Empresarial

- El número de WhatsApp del estudio se almacenará en una variable de entorno configurable (ver [`.env.example`](../.env.example)), en formato internacional **sin el símbolo `+` ni espacios** (ejemplo: `50764600000`).
- **Estado actual del número oficial:** `PENDIENTE DE CONFIRMACIÓN`.

---

## 2. Puntos de Contacto con WhatsApp

1. **Botón flotante global:**
   - Visible en todas las secciones públicas (esquina inferior derecha, color verde característico de WhatsApp).
   - Abre `https://wa.me/<NUMERO>?text=<MENSAJE_GENERAL>`.
   - Mensaje general sugerido: *"Hola, Luz Beauty Studio. Me gustaría obtener información sobre sus servicios."*
2. **Botones de contacto directo (Hero, Banner de cita, Contacto/Footer):**
   - Mismo formato `wa.me` con mensaje cordial predeterminado.
3. **Formulario de solicitud de cita:**
   - Toma los valores ingresados por el usuario, los valida y genera un mensaje estructurado.

---

## 3. Estructura del Mensaje del Formulario

### Campos del formulario
- **Nombre** *(obligatorio)*
- **Servicio de interés** *(obligatorio — las 6 categorías oficiales + `"Otro / No estoy seguro"`)*
- **Fecha deseada** *(obligatorio — no puede ser anterior a hoy)*
- **Horario preferido** *(obligatorio — `Mañana`, `Tarde`, `Cualquier horario`, `Elegir una hora específica`)*
- **Hora específica** *(condicional: se muestra al elegir `"Elegir una hora específica"`)*
- **Comentarios adicionales** *(opcional)*

### Plantilla de mensaje generada

```text
Hola, Luz Beauty Studio. Mi nombre es [NOMBRE].

Me gustaría solicitar información sobre una cita.

Servicio de interés: [SERVICIO]
Fecha deseada: [FECHA]
Horario preferido: [HORARIO O HORA ESPECÍFICA]
Comentarios adicionales:
[COMENTARIOS]

Quedo pendiente de su respuesta y confirmación de disponibilidad.
¡Muchas gracias!
```

### Construcción técnica de la URL
- El texto completo se codifica con `encodeURIComponent(mensaje)`.
- URL final: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensaje)}`.
- Se abre en una nueva pestaña (`window.open(..., '_blank', 'noopener,noreferrer')` o enlace `<a>` equivalente).

---

## 4. Reglas Importantes de Negocio

- **No hay confirmación automática:** Enviar el formulario abre WhatsApp para iniciar la conversación; la cita solo queda confirmada cuando el estudio responde y confirma disponibilidad.
- **Aviso al usuario:** Debajo del botón de envío debe mostrarse un texto aclaratorio indicando que la solicitud se enviará por WhatsApp y está sujeta a confirmación.
- **Sin persistencia en BD:** Los datos del formulario de cita no se guardan en PostgreSQL.
