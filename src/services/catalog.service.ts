import { SERVICE_CATEGORIES } from '../data/categories.data';
import { FAQ_ITEMS } from '../data/faq.data';
import {
  APPOINTMENT_PLACEHOLDERS,
  HERO_PLACEHOLDERS,
  MAGAZINE_PLACEHOLDERS,
  SPOTLIGHT_PLACEHOLDERS,
} from '../data/placeholders.data';
import type { AdminGalleryItem } from './supabase.service';
import type {
  CategorySlug,
  FaqItem,
  PlaceholderSlot,
  ServiceCategory,
} from '../types/catalog';

export function getActiveCategories(): ServiceCategory[] {
  return SERVICE_CATEGORIES.filter((category) => category.isActive);
}

export function getHeroPlaceholders(): PlaceholderSlot[] {
  return HERO_PLACEHOLDERS;
}

export function getAppointmentPlaceholders(): PlaceholderSlot[] {
  return APPOINTMENT_PLACEHOLDERS;
}

export function getGalleryPlaceholders(
  filter: CategorySlug | 'todos',
): PlaceholderSlot[] {
  if (filter === 'todos') {
    return MAGAZINE_PLACEHOLDERS.filter((item) => item.isPublished);
  }

  return SPOTLIGHT_PLACEHOLDERS.filter(
    (item) => item.isPublished && item.categorySlug === filter,
  );
}

export function resolvePublicGalleryItems(
  filter: CategorySlug | 'todos',
  adminItems: AdminGalleryItem[],
  categories: ServiceCategory[] = SERVICE_CATEGORIES,
): PlaceholderSlot[] {
  const activeSlugs = new Set(
    categories.filter((c) => c.isActive).map((c) => c.slug),
  );
  const publishedAdmin = adminItems.filter(
    (item) => item.isPublished && activeSlugs.has(item.categorySlug),
  );

  if (filter === 'todos') {
    return publishedAdmin;
  }

  if (!activeSlugs.has(filter)) {
    return [];
  }

  const publishedInCategory = publishedAdmin.filter(
    (item) => item.categorySlug === filter,
  );

  if (publishedInCategory.length === 0) {
    return [];
  }

  const categoryRecord = categories.find((c) => c.slug === filter);
  const categoryName = categoryRecord?.name;

  const baseSpotlight = SPOTLIGHT_PLACEHOLDERS.filter(
    (item) => item.isPublished && item.categorySlug === filter,
  ).map((slot) => {
    const base = categoryName ? { ...slot, categoryName } : { ...slot };
    if (filter === 'unas') {
      if (slot.spotlightSlot === 'C-03') {
        const g01 = publishedInCategory.find((item) => item.id === 'G-01');
        if (g01) return { ...base, title: g01.title, imageUrl: g01.imageUrl };
      }
      if (slot.spotlightSlot === 'C-01') {
        const g06 = publishedInCategory.find((item) => item.id === 'G-06');
        if (g06) return { ...base, title: g06.title, imageUrl: g06.imageUrl };
      }
    }
    return base;
  });

  const customAdditions = publishedInCategory.filter(
    (item) => !item.magazineSlot,
  );

  return [...customAdditions, ...baseSpotlight];
}

export function getConfirmedFaqs(): FaqItem[] {
  return FAQ_ITEMS.filter((item) => item.isConfirmed);
}
