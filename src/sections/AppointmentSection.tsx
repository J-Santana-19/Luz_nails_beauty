import { AppointmentForm } from '../components/forms/AppointmentForm';
import { ImagePlaceholder } from '../components/ui/ImagePlaceholder';
import { SectionHeading } from '../components/ui/SectionHeading';
import { getAppointmentPlaceholders } from '../services/catalog.service';
import type { ServiceCategory } from '../types/catalog';

interface AppointmentSectionProps {
  categories: ServiceCategory[];
}

export function AppointmentSection({ categories }: AppointmentSectionProps) {
  const [leftSlot, rightOffsetSlot, bottomWideSlot] = getAppointmentPlaceholders();

  return (
    <section
      id="solicitar-cita"
      className="section-band section-band--soft"
      aria-labelledby="appointment-heading"
    >
      <div className="container appointment-grid">
        <div className="appointment-intro">
          <SectionHeading
            eyebrow="Agenda vía WhatsApp"
            title="Solicita tu"
            highlightWord="Cita"
            subtitle="Organiza tus preferencias en menos de un minuto y envía tu solicitud directamente al WhatsApp del estudio."
            headingId="appointment-heading"
          />

          <div className="appointment-steps">
            <div className="appointment-step">
              <span className="appointment-step__num">1</span>
              <span>Elige el servicio, fecha deseada y tu horario preferido.</span>
            </div>
            <div className="appointment-step">
              <span className="appointment-step__num">2</span>
              <span>Revisa el mensaje preparado automáticamente en WhatsApp.</span>
            </div>
            <div className="appointment-step">
              <span className="appointment-step__num">3</span>
              <span>Confirmaremos disponibilidad directamente contigo por chat.</span>
            </div>
          </div>

          <div
            className="appointment-triptych"
            aria-label="Composición editorial del estudio"
          >
            <div>
              <ImagePlaceholder slot={leftSlot} theme="light" />
            </div>
            <div className="appointment-triptych__offset">
              <ImagePlaceholder slot={rightOffsetSlot} theme="light" />
            </div>
            <div className="appointment-triptych__wide">
              <ImagePlaceholder slot={bottomWideSlot} theme="light" />
            </div>
          </div>
        </div>

        <AppointmentForm categories={categories} />
      </div>
    </section>
  );
}
