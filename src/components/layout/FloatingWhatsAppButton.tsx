import {
  buildWhatsAppUrl,
  DEFAULT_WHATSAPP_MESSAGE,
} from '../../services/whatsapp.service';
import { WhatsAppIcon } from '../ui/BrandIcons';

export function FloatingWhatsAppButton() {
  const url = buildWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGE);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-whatsapp"
      aria-label="Escribir por WhatsApp a Luz Beauty Studio"
      title="Consultar por WhatsApp"
    >
      <WhatsAppIcon size={28} />
    </a>
  );
}
