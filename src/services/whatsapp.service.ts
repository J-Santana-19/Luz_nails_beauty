import type { AppointmentFormData } from '../types/catalog';

export const OFFICIAL_WHATSAPP_NUMBER = '50764396576';

const SPANISH_MONTHS = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
] as const;

export const DEFAULT_WHATSAPP_MESSAGE =
  'Hola, Luz Beauty Studio. Me gustaría obtener información sobre sus servicios.';

export const INSTAGRAM_HANDLE = '@by.luzbeautystudio';
export const INSTAGRAM_URL = 'https://www.instagram.com/by.luzbeautystudio/';

export function sanitizePhoneNumber(rawPhone?: string): string {
  if (!rawPhone) return '';
  return rawPhone.replace(/\D/g, '');
}

export function getConfiguredWhatsAppNumber(): string {
  const envPhone = import.meta.env.PUBLIC_WHATSAPP_NUMBER as string | undefined;
  return sanitizePhoneNumber(envPhone) || OFFICIAL_WHATSAPP_NUMBER;
}

/** Formatea una fecha ISO (YYYY-MM-DD) a español legible (ej. "21 de noviembre de 2026"). */
export function formatDateInSpanish(isoDate: string): string {
  const trimmed = isoDate.trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (!match) return trimmed;

  const [, year, monthStr, dayStr] = match;
  const monthIndex = Number(monthStr) - 1;
  const day = Number(dayStr);

  if (monthIndex < 0 || monthIndex >= SPANISH_MONTHS.length || day < 1 || day > 31) {
    return trimmed;
  }

  return `${day} de ${SPANISH_MONTHS[monthIndex]} de ${year}`;
}

/** Convierte una hora en formato 24h (HH:MM) a formato 12h con AM/PM (ej. "17:30" -> "5:30 PM"). */
export function formatTime12Hour(time24: string): string {
  const trimmed = time24.trim();
  const match = /^(\d{1,2}):(\d{2})$/.exec(trimmed);
  if (!match) return trimmed;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return trimmed;
  }

  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;

  return `${hour12}:${String(minutes).padStart(2, '0')} ${period}`;
}

export function buildAppointmentMessage(data: AppointmentFormData): string {
  const scheduleLabel =
    data.preferredSchedule === 'Elegir una hora específica' && data.specificTime?.trim()
      ? `Hora específica (${formatTime12Hour(data.specificTime)})`
      : data.preferredSchedule;

  const formattedDate = formatDateInSpanish(data.desiredDate);
  const commentsText = data.comments?.trim() || 'Ninguno';

  return [
    `Hola, Luz Beauty Studio. Mi nombre es ${data.clientName.trim()}.`,
    '',
    'Me gustaría solicitar información sobre una cita.',
    '',
    `Servicio de interés: ${data.service}`,
    `Fecha deseada: ${formattedDate}`,
    `Horario preferido: ${scheduleLabel}`,
    'Comentarios adicionales:',
    commentsText,
    '',
    'Quedo pendiente de su respuesta y confirmación de disponibilidad.',
    '¡Muchas gracias!',
  ].join('\n');
}

export function buildWhatsAppUrl(message: string, rawPhone?: string): string {
  const cleanPhone = sanitizePhoneNumber(rawPhone ?? getConfiguredWhatsAppNumber());
  const encodedMessage = encodeURIComponent(message);

  if (!cleanPhone) {
    return `https://wa.me/?text=${encodedMessage}`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}
