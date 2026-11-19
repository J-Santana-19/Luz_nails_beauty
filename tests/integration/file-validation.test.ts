import { describe, expect, it } from 'vitest';
import {
  buildStoragePath,
  MAX_IMAGE_SIZE_BYTES,
  sanitizeFileName,
  validateImageFile,
} from '../../src/services/file-validation.service';

describe('file-validation.service', () => {
  it('acepta archivos JPG, PNG y WebP dentro del límite de 5 MB', () => {
    expect(
      validateImageFile({ name: 'diseno.jpg', type: 'image/jpeg', size: 1024 * 500 }),
    ).toEqual({ valid: true });

    expect(
      validateImageFile({ name: 'cejas.png', type: 'image/png', size: 1024 * 1024 }),
    ).toEqual({ valid: true });

    expect(
      validateImageFile({
        name: 'pestanas.webp',
        type: 'image/webp',
        size: MAX_IMAGE_SIZE_BYTES,
      }),
    ).toEqual({ valid: true });
  });

  it('rechaza formatos no permitidos con el mensaje exacto de especificación', () => {
    expect(
      validateImageFile({ name: 'icono.svg', type: 'image/svg+xml', size: 2048 }),
    ).toEqual({
      valid: false,
      error: 'El formato del archivo no es compatible',
    });

    expect(
      validateImageFile({ name: 'catalogo.pdf', type: 'application/pdf', size: 4096 }),
    ).toEqual({
      valid: false,
      error: 'El formato del archivo no es compatible',
    });

    expect(
      validateImageFile({ name: 'animacion.gif', type: 'image/gif', size: 4096 }),
    ).toEqual({
      valid: false,
      error: 'El formato del archivo no es compatible',
    });
  });

  it('rechaza archivos mayores a 5 MB o vacíos', () => {
    const oversized = validateImageFile({
      name: 'grande.jpg',
      type: 'image/jpeg',
      size: MAX_IMAGE_SIZE_BYTES + 1,
    });
    expect(oversized.valid).toBe(false);
    expect(oversized.error).toContain('5 MB');

    const empty = validateImageFile({
      name: 'vacio.png',
      type: 'image/png',
      size: 0,
    });
    expect(empty.valid).toBe(false);
  });

  it('sanitiza nombres de archivo y construye rutas seguras para Supabase Storage', () => {
    expect(sanitizeFileName('../../Diseño Uñas Árbol!.JPG')).toBe(
      'diseno-unas-arbol.jpg',
    );
    expect(buildStoragePath('unas', 'Foto Final 01.webp', 'uuid-1234')).toBe(
      'unas/uuid-1234-foto-final-01.webp',
    );
  });
});
