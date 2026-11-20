import { useState, type FormEvent } from 'react';
import {
  buildAppointmentMessage,
  buildWhatsAppUrl,
} from '../../services/whatsapp.service';
import type { PreferredSchedule, ServiceCategory } from '../../types/catalog';
import { WhatsAppIcon } from '../ui/BrandIcons';

interface AppointmentFormProps {
  categories: ServiceCategory[];
  preselectedService?: string;
}

interface FormErrors {
  clientName?: string;
  service?: string;
  desiredDate?: string;
  specificTime?: string;
}

function getTodayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function AppointmentForm({
  categories,
  preselectedService = '',
}: AppointmentFormProps) {
  const [clientName, setClientName] = useState('');
  const [service, setService] = useState(preselectedService);
  const [desiredDate, setDesiredDate] = useState('');
  const [preferredSchedule, setPreferredSchedule] =
    useState<PreferredSchedule>('Mañana');
  const [specificTime, setSpecificTime] = useState('');
  const [comments, setComments] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const today = getTodayIsoDate();

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!clientName.trim()) {
      nextErrors.clientName = 'Por favor escribe tu nombre.';
    }

    if (!service.trim()) {
      nextErrors.service = 'Selecciona un servicio de interés.';
    }

    if (!desiredDate) {
      nextErrors.desiredDate = 'Selecciona una fecha deseada.';
    } else if (desiredDate < today) {
      nextErrors.desiredDate = 'La fecha no puede ser anterior a hoy.';
    }

    if (
      preferredSchedule === 'Elegir una hora específica' &&
      !specificTime.trim()
    ) {
      nextErrors.specificTime = 'Indica la hora específica que prefieres.';
    }

    return nextErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const message = buildAppointmentMessage({
      clientName,
      service,
      desiredDate,
      preferredSchedule,
      specificTime:
        preferredSchedule === 'Elegir una hora específica'
          ? specificTime
          : undefined,
      comments,
    });

    const url = buildWhatsAppUrl(message);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="form-card">
      <form className="form-grid" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="appointment-name" className="form-label">
            Nombre <span className="form-label__required">*</span>
          </label>
          <input
            id="appointment-name"
            name="clientName"
            type="text"
            className="form-control"
            placeholder="Escribe tu nombre"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            aria-invalid={Boolean(errors.clientName)}
            required
          />
          {errors.clientName ? (
            <span className="form-error" role="alert">
              {errors.clientName}
            </span>
          ) : null}
        </div>

        <div className="form-grid form-grid--two">
          <div className="form-field">
            <label htmlFor="appointment-service" className="form-label">
              Servicio de interés <span className="form-label__required">*</span>
            </label>
            <select
              id="appointment-service"
              name="service"
              className="form-control"
              value={service}
              onChange={(e) => setService(e.target.value)}
              aria-invalid={Boolean(errors.service)}
              required
            >
              <option value="">Selecciona una opción</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
              <option value="Otro / No estoy seguro">Otro / No estoy seguro</option>
            </select>
            {errors.service ? (
              <span className="form-error" role="alert">
                {errors.service}
              </span>
            ) : null}
          </div>

          <div className="form-field">
            <label htmlFor="appointment-date" className="form-label">
              Fecha deseada <span className="form-label__required">*</span>
            </label>
            <input
              id="appointment-date"
              name="desiredDate"
              type="date"
              min={today}
              className="form-control"
              value={desiredDate}
              onChange={(e) => setDesiredDate(e.target.value)}
              aria-invalid={Boolean(errors.desiredDate)}
              required
            />
            {errors.desiredDate ? (
              <span className="form-error" role="alert">
                {errors.desiredDate}
              </span>
            ) : null}
          </div>
        </div>

        <div className="form-grid form-grid--two">
          <div className="form-field">
            <label htmlFor="appointment-schedule" className="form-label">
              Horario preferido <span className="form-label__required">*</span>
            </label>
            <select
              id="appointment-schedule"
              name="preferredSchedule"
              className="form-control"
              value={preferredSchedule}
              onChange={(e) =>
                setPreferredSchedule(e.target.value as PreferredSchedule)
              }
            >
              <option value="Mañana">Mañana</option>
              <option value="Tarde">Tarde</option>
              <option value="Cualquier horario">Cualquier horario</option>
              <option value="Elegir una hora específica">
                Elegir una hora específica
              </option>
            </select>
          </div>

          {preferredSchedule === 'Elegir una hora específica' ? (
            <div className="form-field">
              <label htmlFor="appointment-time" className="form-label">
                Hora específica <span className="form-label__required">*</span>
              </label>
              <input
                id="appointment-time"
                name="specificTime"
                type="time"
                className="form-control"
                value={specificTime}
                onChange={(e) => setSpecificTime(e.target.value)}
                aria-invalid={Boolean(errors.specificTime)}
                required
              />
              {errors.specificTime ? (
                <span className="form-error" role="alert">
                  {errors.specificTime}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="form-field">
          <label htmlFor="appointment-comments" className="form-label">
            Comentarios adicionales
          </label>
          <textarea
            id="appointment-comments"
            name="comments"
            className="form-control form-textarea"
            placeholder="Cuéntanos qué diseño tienes en mente o qué deseas consultar"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn--primary btn--full">
          <WhatsAppIcon size={18} />
          Enviar solicitud por WhatsApp
        </button>

        <p className="form-disclaimer">
          Al enviar, se abrirá WhatsApp con tu mensaje preparado. La cita no queda
          confirmada automáticamente; te responderemos para confirmar disponibilidad.
        </p>
      </form>
    </div>
  );
}
