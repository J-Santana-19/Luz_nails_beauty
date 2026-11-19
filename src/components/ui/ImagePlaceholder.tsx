import type { AspectRatio, PlaceholderSlot } from '../../types/catalog';
import { PlaceholderFrameIcon } from './BrandIcons';

const RATIO_CLASS_MAP: Record<AspectRatio, string> = {
  '3:4': 'ratio-3-4',
  '4:5': 'ratio-4-5',
  '1:1': 'ratio-1-1',
  '16:10': 'ratio-16-10',
  '16:9': 'ratio-16-9',
  '4:3': 'ratio-4-3',
};

interface ImagePlaceholderProps {
  slot: PlaceholderSlot;
  theme?: 'light' | 'dark';
  className?: string;
  onSelect?: (slot: PlaceholderSlot) => void;
  showExpandHint?: boolean;
}

function resolveMediaUrl(imageUrl: string): string {
  if (/^https?:\/\//i.test(imageUrl)) {
    return imageUrl;
  }
  const base = import.meta.env.BASE_URL || '/';
  return `${base}${imageUrl.replace(/^\/+/, '')}`;
}

export function ImagePlaceholder({
  slot,
  theme = 'light',
  className = '',
  onSelect,
  showExpandHint = false,
}: ImagePlaceholderProps) {
  const ratioClass = RATIO_CLASS_MAP[slot.aspectRatio];
  const hasImage = Boolean(slot.imageUrl);
  const cardClasses = [
    'placeholder-card',
    theme === 'dark' ? 'placeholder-card--dark' : 'placeholder-card--light',
    hasImage ? 'placeholder-card--has-image' : '',
    ratioClass,
    onSelect ? 'placeholder-card--interactive' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {slot.imageUrl ? (
        <>
          <img
            src={resolveMediaUrl(slot.imageUrl)}
            alt={slot.title}
            loading="lazy"
            className="placeholder-card__img"
          />
          <span className="placeholder-card__scrim" aria-hidden="true" />
        </>
      ) : (
        <span className="placeholder-card__frame" aria-hidden="true" />
      )}

      <div className="placeholder-card__top">
        <span className="placeholder-card__badge">{slot.categoryName}</span>
        {!hasImage ? (
          <span className="placeholder-card__ratio">{slot.aspectRatio}</span>
        ) : null}
      </div>

      {!hasImage ? (
        <div className="placeholder-card__center">
          <span className="placeholder-card__silhouette">
            <PlaceholderFrameIcon size={22} />
          </span>
          <span className="placeholder-card__label">{slot.temporaryLabel}</span>
          <span className="placeholder-card__subtitle">{slot.subtitle}</span>
        </div>
      ) : null}

      <div className="placeholder-card__bottom">
        <span>{slot.title}</span>
        {showExpandHint ? <span>Ampliar ↗</span> : null}
      </div>
    </>
  );

  if (onSelect) {
    return (
      <button
        type="button"
        className={cardClasses}
        onClick={() => onSelect(slot)}
        aria-label={`Ampliar ${slot.title} (${slot.categoryName})`}
      >
        {content}
      </button>
    );
  }

  return (
    <article
      className={cardClasses}
      aria-label={
        hasImage ? slot.title : `Espacio reservado: ${slot.title}`
      }
    >
      {content}
    </article>
  );
}
