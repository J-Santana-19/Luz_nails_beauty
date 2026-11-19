import { useEffect } from 'react';
import { buildWhatsAppUrl } from '../../services/whatsapp.service';
import type { PlaceholderSlot } from '../../types/catalog';
import { CloseIcon, WhatsAppIcon } from './BrandIcons';
import { ImagePlaceholder } from './ImagePlaceholder';

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
  useEffect(() => {
    if (!item) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') onPrev();
      if (event.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose, onPrev, onNext]);

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
          <div>
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

        <ImagePlaceholder slot={item} theme="dark" />

        <div className="lightbox-footer">
          <div className="lightbox-nav">
            <button type="button" className="btn btn--outline-light" onClick={onPrev}>
              ← Anterior
            </button>
            <button type="button" className="btn btn--outline-light" onClick={onNext}>
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
