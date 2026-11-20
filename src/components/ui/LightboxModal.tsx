import { useCallback, useEffect, useState } from 'react';
import { buildWhatsAppUrl } from '../../services/whatsapp.service';
import type { PlaceholderSlot } from '../../types/catalog';
import { CloseIcon, WhatsAppIcon } from './BrandIcons';
import { ImagePlaceholder } from './ImagePlaceholder';

type TransitionDirection = 'initial' | 'next' | 'prev';

interface LightboxModalProps {
  item: PlaceholderSlot | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function LightboxModal({
  item,
  onClose,
  onPrev,
  onNext,
}: LightboxModalProps) {
  const [direction, setDirection] = useState<TransitionDirection>('initial');

  const handlePrev = useCallback(() => {
    setDirection('prev');
    onPrev();
  }, [onPrev]);

  const handleNext = useCallback(() => {
    setDirection('next');
    onNext();
  }, [onNext]);

  useEffect(() => {
    if (!item) {
      setDirection('initial');
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') handlePrev();
      if (event.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose, handlePrev, handleNext]);

  if (!item) return null;

  const inquiryUrl = buildWhatsAppUrl(
    `Hola, Luz Beauty Studio. Vi la referencia "${item.title}" en la galería y me gustaría consultar por un trabajo de ${item.categoryName}.`,
  );

  return (
    <div
      className="lightbox-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      onClick={onClose}
    >
      <div className="lightbox-dialog" onClick={(event) => event.stopPropagation()}>
        <div className="lightbox-header">
          <div key={`header-${item.id}`} className="lightbox-header__info">
            <span className="section-heading__eyebrow">{item.categoryName}</span>
            <h3 id="lightbox-title" className="service-card__title" style={{ color: '#FFFFFF' }}>
              {item.title}
            </h3>
          </div>
          <button
            type="button"
            className="lightbox-close"
            onClick={onClose}
            aria-label="Cerrar vista ampliada"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <div className="lightbox-stage">
          <div key={item.id} className={`lightbox-slide lightbox-slide--${direction}`}>
            <ImagePlaceholder slot={item} theme="dark" className="lightbox-media" />
          </div>
        </div>

        <div className="lightbox-footer">
          <div className="lightbox-nav">
            <button type="button" className="btn btn--outline-light" onClick={handlePrev}>
              ← Anterior
            </button>
            <button type="button" className="btn btn--outline-light" onClick={handleNext}>
              Siguiente →
            </button>
          </div>

          <a
            href={inquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--primary"
          >
            <WhatsAppIcon size={18} />
            Consultar este estilo
          </a>
        </div>
      </div>
    </div>
  );
}
