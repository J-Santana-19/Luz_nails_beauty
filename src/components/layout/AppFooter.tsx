import {
  buildWhatsAppUrl,
  DEFAULT_WHATSAPP_MESSAGE,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
} from '../../services/whatsapp.service';
import { BrandMonogram, InstagramIcon, WhatsAppIcon } from '../ui/BrandIcons';

interface AppFooterProps {
  onOpenAdmin?: () => void;
}

export function AppFooter({ onOpenAdmin }: AppFooterProps) {
  const whatsappUrl = buildWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGE);

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="brand-lockup">
              <BrandMonogram size={44} />
              <span className="brand-lockup__text">
                <span className="brand-lockup__name">
                  Luz Beauty <em>Studio</em>
                </span>
                <span className="brand-lockup__tag">Detalles que realzan tu belleza.</span>
              </span>
            </div>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.72)', maxWidth: '340px' }}>
              Catálogo digital y portafolio de trabajos realizados en uñas, pedicure,
              maquillaje, pestañas, cejas y depilación.
            </p>
          </div>

          <div>
            <h3 className="footer-heading">Explorar</h3>
            <ul className="footer-links">
              <li><a href="#inicio">Inicio</a></li>
              <li><a href="#servicios">Servicios</a></li>
              <li><a href="#galeria">Galería</a></li>
              <li><a href="#solicitar-cita">Solicitar cita</a></li>
              <li><a href="#preguntas-frecuentes">Preguntas frecuentes</a></li>
            </ul>
          </div>

          <div>
            <h3 className="footer-heading">Contacto oficial</h3>
            <ul className="footer-links">
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <InstagramIcon size={16} />
                  Instagram: {INSTAGRAM_HANDLE}
                </a>
              </li>
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <WhatsAppIcon size={16} />
                  WhatsApp: Chat directo
                </a>
              </li>
              <li style={{ color: '#8C7C84' }}>
                Teléfono y ubicación: Por confirmar vía WhatsApp
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© Luz Beauty Studio. Todos los derechos reservados.</span>
          {onOpenAdmin ? (
            <button
              type="button"
              className="btn-link"
              style={{ color: '#8C7C84', fontSize: '13px' }}
              onClick={onOpenAdmin}
            >
              Panel administrativo (/admin)
            </button>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
