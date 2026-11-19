import type { AppointmentFormData } from '../types/catalog';

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
  return sanitizePhoneNumber(envPhone);
}

export function buildAppointmentMessage(data: AppointmentFormData): string {
  const scheduleLabel =
    data.preferredSchedule === 'Elegir una hora específica' && data.specificTime?.trim()
      ? `Hora específica (${data.specificTime.trim()})`
      : data.preferredSchedule;

  const commentsText = data.comments?.trim() || 'Ninguno';

  return [
    `Hola, Luz Beauty Studio. Mi nombre es ${data.clientName.trim()}.`,
    '',
    'Me gustaría solicitar información sobre una cita.',
    '',
    `Servicio de interés: ${data.service}`,
    `Fecha deseada: ${data.desiredDate}`,
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
