export type CategorySlug =
  | 'unas'
  | 'pedicure'
  | 'maquillaje'
  | 'pestanas'
  | 'cejas'
  | 'depilacion';

export type AspectRatio = '3:4' | '4:5' | '1:1' | '16:10' | '16:9' | '4:3';

export type MagazineSlotId = 'G-01' | 'G-02' | 'G-03' | 'G-04' | 'G-05' | 'G-06' | 'G-07';

export type SpotlightSlotId = 'C-01' | 'C-02' | 'C-03' | 'C-04' | 'C-05';

export interface ServiceCategory {
  id: string;
  number: string;
  name: string;
  slug: CategorySlug;
  description: string;
  placeholderId: string;
  imageUrl?: string | null;
  aspectRatio: AspectRatio;
  desktopSpan: 3 | 4 | 5;
  isActive: boolean;
  priceStatus: string;
}

export interface PlaceholderSlot {
  id: string;
  title: string;
  temporaryLabel: string;
  subtitle: string;
  categorySlug: CategorySlug;
  categoryName: string;
  aspectRatio: AspectRatio;
  role: 'protagonist' | 'secondary' | 'panoramic' | 'detail';
  magazineSlot?: MagazineSlotId;
  spotlightSlot?: SpotlightSlotId;
  isPublished: boolean;
  imageUrl: string | null;
}

export type PreferredSchedule =
  | 'Mañana'
  | 'Tarde'
  | 'Cualquier horario'
  | 'Elegir una hora específica';

export interface AppointmentFormData {
  clientName: string;
  service: string;
  desiredDate: string;
  preferredSchedule: PreferredSchedule;
  specificTime?: string;
  comments?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  isConfirmed: boolean;
}
