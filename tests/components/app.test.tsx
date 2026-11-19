import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from '../../src/App';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('Luz Beauty Studio — Primera Etapa Visual (Placeholders y Collages)', () => {
  it('renderiza las secciones principales y las 6 categorías oficiales sin imágenes reales', () => {
    const { container } = render(<App />);

    expect(
      screen.getByRole('heading', { level: 1, name: /Detalles que realzan tu/i }),
    ).toBeInTheDocument();

    expect(screen.getByRole('heading', { level: 2, name: /Nuestros Servicios/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Nuestros Trabajos/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Solicita tu Cita/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Preguntas Frecuentes/i })).toBeInTheDocument();

    for (const name of ['Uñas', 'Pedicure', 'Maquillaje', 'Pestañas', 'Cejas', 'Depilación']) {
      expect(screen.getAllByText(name).length).toBeGreaterThan(0);
    }

    // Deben mostrarse únicamente las 4 imágenes reales de Manicure sin repetir ninguna
    const mainImages = Array.from(container.querySelectorAll('main img')).map((img) =>
      img.getAttribute('src'),
    );
    expect(mainImages).toHaveLength(4);
    expect(new Set(mainImages).size).toBe(4);
    // El logotipo oficial de la marca sí se muestra en header y footer
    expect(screen.getAllByAltText('Logotipo Luz Beauty Studio').length).toBeGreaterThanOrEqual(2);
  });

  it('alterna entre Magazine Spread (7 espacios) y Category Spotlight (5 espacios) al filtrar la galería', () => {
    render(<App />);

    expect(screen.getByTestId('collage-magazine-spread')).toBeInTheDocument();
    expect(
      screen.getByTestId('collage-magazine-spread').querySelectorAll('button'),
    ).toHaveLength(7);

    const pedicureTab = screen.getByRole('tab', { name: 'Pedicure' });
    fireEvent.click(pedicureTab);

    expect(screen.getByTestId('collage-category-spotlight')).toBeInTheDocument();
    expect(
      screen.getByTestId('collage-category-spotlight').querySelectorAll('button'),
    ).toHaveLength(5);
  });

  it('muestra el selector condicional de hora específica y valida campos obligatorios en el formulario', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    render(<App />);

    expect(screen.queryByLabelText(/Hora específica/i)).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Horario preferido/i), {
      target: { value: 'Elegir una hora específica' },
    });
    expect(screen.getByLabelText(/Hora específica/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Enviar solicitud por WhatsApp/i }));
    expect(screen.getByText(/Por favor escribe tu nombre/i)).toBeInTheDocument();
    expect(openSpy).not.toHaveBeenCalled();

    fireEvent.change(screen.getByPlaceholderText('Escribe tu nombre'), {
      target: { value: 'Camila' },
    });
    fireEvent.change(screen.getByLabelText(/Servicio de interés/i), {
      target: { value: 'Maquillaje' },
    });
    fireEvent.change(screen.getByLabelText(/Fecha deseada/i), {
      target: { value: '2099-05-20' },
    });
    fireEvent.change(screen.getByLabelText(/Hora específica/i), {
      target: { value: '15:00' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Enviar solicitud por WhatsApp/i }));
    expect(openSpy).toHaveBeenCalledTimes(1);
    expect(openSpy.mock.calls[0][0]).toContain('https://wa.me/');
    expect(screen.getByText(/Solicitud preparada para WhatsApp/i)).toBeInTheDocument();
  });

  it('abre el menú hamburguesa móvil con todas las secciones de navegación', () => {
    render(<App />);

    const toggle = screen.getByRole('button', { name: /Abrir menú de navegación/i });
    fireEvent.click(toggle);

    const drawer = screen.getByRole('dialog', { name: /Menú móvil/i });
    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveTextContent('Inicio');
    expect(drawer).toHaveTextContent('Servicios');
    expect(drawer).toHaveTextContent('Galería');
    expect(drawer).toHaveTextContent('Solicitar cita');
    expect(drawer).toHaveTextContent('Preguntas frecuentes');
    expect(drawer).toHaveTextContent('Contacto');
  });
});
