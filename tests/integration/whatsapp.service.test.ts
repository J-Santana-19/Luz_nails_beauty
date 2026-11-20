import { describe, expect, it } from 'vitest';
import {
  getActiveCategories,
  getConfirmedFaqs,
  getGalleryPlaceholders,
} from '../../src/services/catalog.service';
import {
  buildAppointmentMessage,
  buildWhatsAppUrl,
  sanitizePhoneNumber,
} from '../../src/services/whatsapp.service';

describe('whatsapp.service', () => {
  it('genera el mensaje exacto del formulario con horario general', () => {
    const message = buildAppointmentMessage({
      clientName: 'Ana Sofía',
      service: 'Uñas',
      desiredDate: '2026-12-10',
      preferredSchedule: 'Mañana',
      comments: 'Diseño francés elegante',
    });

    expect(message).toBe(
      [
        'Hola, Luz Beauty Studio. Mi nombre es Ana Sofía.',
        '',
        'Me gustaría solicitar información sobre una cita.',
        '',
        'Servicio de interés: Uñas',
        'Fecha deseada: 2026-12-10',
        'Horario preferido: Mañana',
        'Comentarios adicionales:',
        'Diseño francés elegante',
        '',
        'Quedo pendiente de su respuesta y confirmación de disponibilidad.',
        '¡Muchas gracias!',
      ].join('\n'),
    );
  });

  it('incluye la hora específica cuando el usuario la selecciona', () => {
    const message = buildAppointmentMessage({
      clientName: 'María',
      service: 'Pestañas',
      desiredDate: '2026-12-15',
      preferredSchedule: 'Elegir una hora específica',
      specificTime: '14:30',
    });

    expect(message).toContain('Horario preferido: Hora específica (14:30)');
    expect(message).toContain('Comentarios adicionales:\nNinguno');
  });

  it('limpia el número telefónico y codifica el mensaje con encodeURIComponent', () => {
    expect(sanitizePhoneNumber('+507 6460-1234')).toBe('50764601234');

    const url = buildWhatsAppUrl('Hola Luz Beauty!', '+507 6460-1234');
    expect(url).toBe('https://wa.me/50764601234?text=Hola%20Luz%20Beauty!');
  });

  it('usa el número oficial configurado por defecto cuando no se pasa teléfono explícito', () => {
    const url = buildWhatsAppUrl('Hola Luz Beauty!');
    expect(url).toBe('https://wa.me/50764396576?text=Hola%20Luz%20Beauty!');
  });
});

describe('catalog.service (etapa placeholders)', () => {
  it('devuelve las 6 categorías oficiales activas', () => {
    const categories = getActiveCategories();
    expect(categories.map((c) => c.name)).toEqual([
      'Uñas',
      'Pedicure',
      'Maquillaje',
      'Pestañas',
      'Cejas',
      'Depilación',
    ]);
  });

  it('devuelve los 7 slots del collage Magazine Spread con proporciones variadas y sin repetir imágenes', () => {
    const items = getGalleryPlaceholders('todos');
    expect(items).toHaveLength(7);

    const realUrls = items.map((item) => item.imageUrl).filter(Boolean);
    expect(new Set(realUrls).size).toBe(realUrls.length);

    const uniqueRatios = new Set(items.map((item) => item.aspectRatio));
    expect(uniqueRatios.size).toBeGreaterThanOrEqual(4);
  });

  it('devuelve 5 slots del collage Category Spotlight para cada categoría filtrada', () => {
    const categories = getActiveCategories();
    for (const category of categories) {
      const items = getGalleryPlaceholders(category.slug);
      expect(items).toHaveLength(5);
      expect(items.every((item) => item.categorySlug === category.slug)).toBe(true);
      expect(items.some((item) => item.spotlightSlot === 'C-03')).toBe(true);
    }
  });

  it('excluye las preguntas frecuentes marcadas como pendientes de confirmación', () => {
    const faqs = getConfirmedFaqs();
    expect(faqs).toHaveLength(7);
    expect(faqs.every((faq) => faq.isConfirmed)).toBe(true);
    expect(faqs.some((faq) => faq.answer.includes('PENDIENTE'))).toBe(false);
  });
});
