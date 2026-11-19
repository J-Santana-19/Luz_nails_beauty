import type {
  MagazineSlotId,
  PlaceholderSlot,
  SpotlightSlotId,
} from '../../types/catalog';
import { ImagePlaceholder } from '../ui/ImagePlaceholder';

const MAGAZINE_SLOT_CLASS: Record<MagazineSlotId, string> = {
  'G-01': 'collage-magazine__slot--g1',
  'G-02': 'collage-magazine__slot--g2',
  'G-03': 'collage-magazine__slot--g3',
  'G-04': 'collage-magazine__slot--g4',
  'G-05': 'collage-magazine__slot--g5',
  'G-06': 'collage-magazine__slot--g6',
  'G-07': 'collage-magazine__slot--g7',
};

const SPOTLIGHT_SLOT_CLASS: Record<SpotlightSlotId, string> = {
  'C-01': 'collage-spotlight__slot--c1',
  'C-02': 'collage-spotlight__slot--c2',
  'C-03': 'collage-spotlight__slot--c3',
  'C-04': 'collage-spotlight__slot--c4',
  'C-05': 'collage-spotlight__slot--c5',
};

interface EditorialCollageGridProps {
  items: PlaceholderSlot[];
  layoutVariant: 'magazine-spread' | 'category-spotlight';
  onSelectItem: (item: PlaceholderSlot) => void;
}

export function EditorialCollageGrid({
  items,
  layoutVariant,
  onSelectItem,
}: EditorialCollageGridProps) {
  const containerClass =
    layoutVariant === 'magazine-spread' ? 'collage-magazine' : 'collage-spotlight';

  return (
    <div className={containerClass} data-testid={`collage-${layoutVariant}`}>
      {items.map((item) => {
        const slotClass =
          layoutVariant === 'magazine-spread' && item.magazineSlot
            ? MAGAZINE_SLOT_CLASS[item.magazineSlot]
            : layoutVariant === 'category-spotlight' && item.spotlightSlot
              ? SPOTLIGHT_SLOT_CLASS[item.spotlightSlot]
              : '';

        return (
          <div key={item.id} className={slotClass}>
            <ImagePlaceholder
              slot={item}
              theme="light"
              onSelect={onSelectItem}
              showExpandHint
            />
          </div>
        );
      })}
    </div>
  );
}
