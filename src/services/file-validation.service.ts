export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'] as const;

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export interface FileValidationInput {
  name: string;
  type: string;
  size: number;
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

function getFileExtension(fileName: string): string {
  const cleanName = fileName.trim().split(/[/\\]/).pop() ?? '';
  const lastDot = cleanName.lastIndexOf('.');
  if (lastDot <= 0 || lastDot === cleanName.length - 1) {
    return '';
  }
  return cleanName.slice(lastDot + 1).toLowerCase();
}

export function validateImageFile(file: FileValidationInput): FileValidationResult {
  const mime = file.type.trim().toLowerCase();
  const ext = getFileExtension(file.name);

  const isAllowedMime = (ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(mime);
  const isAllowedExt = (ALLOWED_IMAGE_EXTENSIONS as readonly string[]).includes(ext);

  if (!isAllowedMime || !isAllowedExt) {
    return {
      valid: false,
      error: 'El formato del archivo no es compatible',
    };
  }

  if (file.size <= 0) {
    return {
      valid: false,
      error: 'El archivo seleccionado está vacío.',
    };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: 'La imagen supera el peso máximo permitido de 5 MB.',
    };
  }

  return { valid: true };
}

export function sanitizeFileName(fileName: string): string {
  const baseWithExt = fileName.trim().split(/[/\\]/).pop() ?? 'imagen.jpg';
  const lastDot = baseWithExt.lastIndexOf('.');
  const rawBase = lastDot > 0 ? baseWithExt.slice(0, lastDot) : baseWithExt;
  const rawExt = lastDot > 0 ? baseWithExt.slice(lastDot + 1).toLowerCase() : 'jpg';

  const normalizedBase = rawBase
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

  const safeBase = normalizedBase || 'imagen';
  const safeExt = (ALLOWED_IMAGE_EXTENSIONS as readonly string[]).includes(rawExt)
    ? rawExt
    : 'jpg';

  return `${safeBase}.${safeExt}`;
}

export function buildStoragePath(
  categorySlug: string,
  fileName: string,
  uniqueId?: string,
): string {
  const safeSlug =
    categorySlug
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'general';

  const uuid =
    uniqueId ??
    (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}`);

  const cleanFileName = sanitizeFileName(fileName);
  return `${safeSlug}/${uuid}-${cleanFileName}`;
}
