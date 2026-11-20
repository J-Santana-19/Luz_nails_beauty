import type {
  AspectRatio,
  CategorySlug,
  PlaceholderSlot,
  SpotlightSlotId,
} from '../types/catalog';

export const HERO_PLACEHOLDERS: PlaceholderSlot[] = [
  {
    id: 'PH-HERO-01',
    title: 'Manicure elegante tono vino — Luz Beauty Studio',
    temporaryLabel: 'Imagen principal',
    subtitle: 'Espacio reservado • Fotografía protagonista de portada',
    categorySlug: 'unas',
    categoryName: 'Portada',
    aspectRatio: '4:5',
    role: 'protagonist',
    isPublished: true,
    imageUrl: 'images/servicios/manicure/manicure-04.webp',
  },
  {
    id: 'PH-HERO-02',
    title: 'Detalle editorial destacado',
    temporaryLabel: 'Trabajo destacado',
    subtitle: 'Espacio reservado • Primer plano de acabado',
    categorySlug: 'maquillaje',
    categoryName: 'Detalle',
    aspectRatio: '1:1',
    role: 'detail',
    isPublished: true,
    imageUrl: null,
  },
];

export const MAGAZINE_PLACEHOLDERS: PlaceholderSlot[] = [
  {
    id: 'G-01',
    title: 'Manicure rojo brillante — Uñas',
    temporaryLabel: 'Trabajo destacado',
    subtitle: 'Espacio reservado • Pieza vertical principal',
    categorySlug: 'unas',
    categoryName: 'Uñas',
    aspectRatio: '3:4',
    role: 'protagonist',
    magazineSlot: 'G-01',
    isPublished: true,
    imageUrl: 'images/servicios/manicure/manicure-01.webp',
  },
  {
    id: 'G-02',
    title: 'Detalle de cuidado — Pedicure',
    temporaryLabel: 'Fotografía del servicio',
    subtitle: 'Espacio reservado • Encuadre cuadrado',
    categorySlug: 'pedicure',
    categoryName: 'Pedicure',
    aspectRatio: '1:1',
    role: 'detail',
    magazineSlot: 'G-02',
    isPublished: true,
    imageUrl: null,
  },
  {
    id: 'G-03',
    title: 'Propuesta editorial — Maquillaje',
    temporaryLabel: 'Retrato editorial',
    subtitle: 'Espacio reservado • Formato vertical medio',
    categorySlug: 'maquillaje',
    categoryName: 'Maquillaje',
    aspectRatio: '4:5',
    role: 'secondary',
    magazineSlot: 'G-03',
    isPublished: true,
    imageUrl: null,
  },
  {
    id: 'G-04',
    title: 'Mirada definida — Pestañas',
    temporaryLabel: 'Composición horizontal',
    subtitle: 'Espacio reservado • Encuadre horizontal amplio',
    categorySlug: 'pestanas',
    categoryName: 'Pestañas',
    aspectRatio: '16:10',
    role: 'panoramic',
    magazineSlot: 'G-04',
    isPublished: true,
    imageUrl: null,
  },
  {
    id: 'G-05',
    title: 'Diseño y armonía — Cejas',
    temporaryLabel: 'Formato panorámico',
    subtitle: 'Espacio reservado • Vista panorámica',
    categorySlug: 'cejas',
    categoryName: 'Cejas',
    aspectRatio: '16:9',
    role: 'panoramic',
    magazineSlot: 'G-05',
    isPublished: true,
    imageUrl: null,
  },
  {
    id: 'G-06',
    title: 'Uñas almendradas con detalle dorado — Uñas',
    temporaryLabel: 'Detalle cuadrado',
    subtitle: 'Espacio reservado • Primer plano de diseño',
    categorySlug: 'unas',
    categoryName: 'Uñas',
    aspectRatio: '1:1',
    role: 'detail',
    magazineSlot: 'G-06',
    isPublished: true,
    imageUrl: 'images/servicios/manicure/manicure-02.webp',
  },
  {
    id: 'G-07',
    title: 'Cuidado de piel — Depilación',
    temporaryLabel: 'Fotografía del servicio',
    subtitle: 'Espacio reservado • Encuadre vertical',
    categorySlug: 'depilacion',
    categoryName: 'Depilación',
    aspectRatio: '3:4',
    role: 'secondary',
    magazineSlot: 'G-07',
    isPublished: true,
    imageUrl: null,
  },
];

const SPOTLIGHT_BLUEPRINT: ReadonlyArray<{
  slot: SpotlightSlotId;
  ratio: AspectRatio;
  role: PlaceholderSlot['role'];
  label: string;
  subtitle: string;
}> = [
  {
    slot: 'C-01',
    ratio: '1:1',
    role: 'detail',
    label: 'Detalle en primer plano',
    subtitle: 'Espacio reservado • Cuadrado 1:1',
  },
  {
    slot: 'C-02',
    ratio: '4:3',
    role: 'secondary',
    label: 'Vista horizontal',
    subtitle: 'Espacio reservado • Formato 4:3',
  },
  {
    slot: 'C-03',
    ratio: '4:5',
    role: 'protagonist',
    label: 'Trabajo protagonista',
    subtitle: 'Espacio reservado • Pieza central destacada',
  },
  {
    slot: 'C-04',
    ratio: '4:5',
    role: 'secondary',
    label: 'Propuesta vertical',
    subtitle: 'Espacio reservado • Formato 4:5',
  },
  {
    slot: 'C-05',
    ratio: '1:1',
    role: 'detail',
    label: 'Acabado final',
    subtitle: 'Espacio reservado • Cuadrado 1:1',
  },
];

const CATEGORY_LABELS: Record<CategorySlug, string> = {
  unas: 'Uñas',
  pedicure: 'Pedicure',
  maquillaje: 'Maquillaje',
  pestanas: 'Pestañas',
  cejas: 'Cejas',
  depilacion: 'Depilación',
};

const UNAS_SPOTLIGHT_OVERRIDES: Partial<
  Record<SpotlightSlotId, { title: string; imageUrl: string }>
> = {
  'C-02': {
    title: 'Uñas azul glitter — Uñas',
    imageUrl: 'images/servicios/manicure/manicure-06.webp',
  },
  'C-04': {
    title: 'Diseño francés almendrado — Uñas',
    imageUrl: 'images/servicios/manicure/manicure-07.webp',
  },
  'C-05': {
    title: 'Acabado vino brillante — Uñas',
    imageUrl: 'images/servicios/manicure/manicure-08.webp',
  },
};

export const SPOTLIGHT_PLACEHOLDERS: PlaceholderSlot[] = (
  Object.keys(CATEGORY_LABELS) as CategorySlug[]
).flatMap((slug) =>
  SPOTLIGHT_BLUEPRINT.map((blueprint) => {
    const unasOverride =
      slug === 'unas' ? UNAS_SPOTLIGHT_OVERRIDES[blueprint.slot] : undefined;

    return {
      id: `${slug.toUpperCase()}-${blueprint.slot}`,
      title: unasOverride?.title ?? `${CATEGORY_LABELS[slug]} — ${blueprint.label}`,
      temporaryLabel: blueprint.label,
      subtitle: blueprint.subtitle,
      categorySlug: slug,
      categoryName: CATEGORY_LABELS[slug],
      aspectRatio: blueprint.ratio,
      role: blueprint.role,
      spotlightSlot: blueprint.slot,
      isPublished: true,
      imageUrl: unasOverride?.imageUrl ?? null,
    };
  }),
);

export const APPOINTMENT_PLACEHOLDERS: PlaceholderSlot[] = [
  {
    id: 'PH-CTA-01',
    title: 'Ambiente del estudio',
    temporaryLabel: 'Espacio del estudio',
    subtitle: 'Espacio reservado • Vertical 3:4',
    categorySlug: 'unas',
    categoryName: 'Estudio',
    aspectRatio: '3:4',
    role: 'secondary',
    isPublished: true,
    imageUrl: null,
  },
  {
    id: 'PH-CTA-02',
    title: 'Detalle de atención',
    temporaryLabel: 'Detalle de servicio',
    subtitle: 'Espacio reservado • Cuadrado 1:1',
    categorySlug: 'cejas',
    categoryName: 'Atención',
    aspectRatio: '1:1',
    role: 'detail',
    isPublished: true,
    imageUrl: null,
  },
  {
    id: 'PH-CTA-03',
    title: 'Tu momento en Luz Beauty Studio',
    temporaryLabel: 'Experiencia del estudio',
    subtitle: 'Espacio reservado • Panorámica 16:9',
    categorySlug: 'pedicure',
    categoryName: 'Experiencia',
    aspectRatio: '16:9',
    role: 'panoramic',
    isPublished: true,
    imageUrl: null,
  },
];
