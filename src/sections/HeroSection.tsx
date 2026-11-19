import { ImagePlaceholder } from '../components/ui/ImagePlaceholder';
import { ArrowRightIcon, WhatsAppIcon } from '../components/ui/BrandIcons';
import { getHeroPlaceholders } from '../services/catalog.service';
import {
  buildWhatsAppUrl,
  DEFAULT_WHATSAPP_MESSAGE,
} from '../services/whatsapp.service';

export function HeroSection() {
  const [primarySlot] = getHeroPlaceholders();
  const whatsappUrl = buildWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGE);

  return (
    <section id="inicio" className="hero-section" aria-labelledby="hero-heading">
      <div className="container hero-grid">
        <div className="hero-content">
          <span className="hero-eyebrow">Estudio de belleza • Portafolio oficial</span>
          <h1 id="hero-heading" className="hero-title">
            Detalles que realzan tu <em>belleza.</em>
          </h1>
          <p className="hero-description">
            En Luz Beauty Studio cuidamos cada detalle para ofrecerte servicios de
            belleza con dedicación, creatividad y profesionalismo.
          </p>

          <div className="hero-actions">
            <a href="#servicios" className="btn btn--primary">
              Explorar servicios
              <ArrowRightIcon size={17} />
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--outline-light"
            >
              <WhatsAppIcon size={18} />
              Consultar por WhatsApp
            </a>
          </div>

          <div className="hero-meta">
            <span>Uñas • Pedicure • Maquillaje • Pestañas • Cejas • Depilación</span>
          </div>
        </div>

        <div className="hero-media" aria-label="Espacio reservado para imagen principal">
          <ImagePlaceholder slot={primarySlot} theme="dark" />
          <span className="hero-media__fade" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
