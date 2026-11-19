import { useState } from 'react';
import { SectionHeading } from '../components/ui/SectionHeading';
import {
  buildWhatsAppUrl,
  DEFAULT_WHATSAPP_MESSAGE,
} from '../services/whatsapp.service';
import type { FaqItem } from '../types/catalog';

interface FaqSectionProps {
  items: FaqItem[];
}

export function FaqSection({ items }: FaqSectionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
  const whatsappUrl = buildWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGE);

  const toggleItem = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section
      id="preguntas-frecuentes"
      className="section-band section-band--light"
      aria-labelledby="faq-heading"
    >
      <div className="container faq-layout">
        <div>
          <SectionHeading
            eyebrow="Información útil"
            title="Preguntas"
            highlightWord="Frecuentes"
            subtitle="Resolvemos tus dudas más comunes antes de agendar. Si necesitas una consulta personalizada, escríbenos por WhatsApp."
            headingId="faq-heading"
          />

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--secondary"
          >
            Hacer una consulta directa
          </a>
        </div>

        <div className="faq-list">
          {items.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}
              >
                <button
                  type="button"
                  className="faq-trigger"
                  aria-expanded={isOpen}
                  aria-controls={`answer-${item.id}`}
                  onClick={() => toggleItem(item.id)}
                >
                  <span>{item.question}</span>
                  <span className="faq-icon" aria-hidden="true">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen ? (
                  <div id={`answer-${item.id}`} className="faq-answer">
                    <p>{item.answer}</p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
