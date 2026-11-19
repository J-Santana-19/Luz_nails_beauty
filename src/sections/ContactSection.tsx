import { InstagramIcon, WhatsAppIcon } from '../components/ui/BrandIcons';
import { SectionHeading } from '../components/ui/SectionHeading';
import {
  buildWhatsAppUrl,
  DEFAULT_WHATSAPP_MESSAGE,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
} from '../services/whatsapp.service';

export function ContactSection() {
  const whatsappUrl = buildWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGE);

  return (
    <section
      id="contacto"
      className="section-band section-band--light"
      aria-labelledby="contact-heading"
    >
      <div className="container">
        <div className="contact-banner">
          <div>
            <SectionHeading
              eyebrow="Contacto directo"
              title="¿Lista para tu próxima"
              highlightWord="cita?"
              subtitle="Escríbenos directamente por WhatsApp o síguenos en Instagram para conocer las novedades de Luz Beauty Studio."
              theme="dark"
              headingId="contact-heading"
            />
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary"
            >
              <WhatsAppIcon size={18} />
              Agendar por WhatsApp
            </a>
          </div>

          <div className="contact-cards">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card"
            >
              <span className="contact-card__label">
                <WhatsAppIcon size={15} />
                WhatsApp
              </span>
              <span className="contact-card__value">Chat directo</span>
            </a>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card"
            >
              <span className="contact-card__label">
                <InstagramIcon size={15} />
                Instagram
              </span>
              <span className="contact-card__value">{INSTAGRAM_HANDLE}</span>
            </a>

            <div className="contact-card">
              <span className="contact-card__label">Horarios y ubicación</span>
              <span className="contact-card__value" style={{ color: '#F5C8D9' }}>
                Consultar disponibilidad vía WhatsApp
              </span>
            </div>

            <div className="contact-card">
              <span className="contact-card__label">Atención personalizada</span>
              <span className="contact-card__value">
                Confirmación directa por mensaje
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
