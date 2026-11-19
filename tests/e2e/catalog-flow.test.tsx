import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import App from '../../src/App';

afterEach(() => {
  cleanup();
});

describe('Flujos End-to-End de Catálogo Público y Panel Admin', () => {
  it('Recorrido 1: abre el Lightbox de galería, navega con Anterior/Siguiente y cierra con Escape', () => {
    render(<App initialRoute="/" />);

    const galleryGrid = screen.getByTestId('collage-magazine-spread');
    const firstSlot = galleryGrid.querySelector('button');
    expect(firstSlot).not.toBeNull();
    fireEvent.click(firstSlot!);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByRole('heading', { name: 'Trabajo protagonista — Uñas' })).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole('button', { name: /Siguiente/i }));
    expect(within(dialog).getByRole('heading', { name: 'Detalle de cuidado — Pedicure' })).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole('button', { name: /Anterior/i }));
    expect(within(dialog).getByRole('heading', { name: 'Trabajo protagonista — Uñas' })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('Recorrido 2: al pulsar "Explorar trabajos →" en Servicios cambia la galería a Category Spotlight', () => {
    render(<App initialRoute="/" />);

    const exploreButtons = screen.getAllByRole('button', { name: /Explorar trabajos/i });
    fireEvent.click(exploreButtons[2]); // Maquillaje

    expect(screen.getByTestId('collage-category-spotlight')).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: 'Maquillaje' }),
    ).toHaveAttribute('aria-selected', 'true');
  });

  it('Recorrido 3: cambios en /admin (nueva foto y categoría vacía) se sincronizan en tiempo real con la web pública', async () => {
    render(<App initialRoute="/" />);

    // Ir al panel administrativo desde el enlace del footer
    fireEvent.click(
      screen.getByRole('button', { name: /Panel administrativo \(\/admin\)/i }),
    );
    fireEvent.click(
      await screen.findByRole('button', { name: /Entrar en Vista Previa Local/i }),
    );

    // Subir un espacio reservado en la categoría Uñas
    fireEvent.click(
      await screen.findByRole('button', { name: 'Cargar fotografías' }),
    );
    fireEvent.click(
      screen.getByRole('button', { name: /Simular espacio reservado/i }),
    );
    fireEvent.change(screen.getByLabelText('Título'), {
      target: { value: 'Diseño Editorial Nuevo' },
    });
    fireEvent.change(screen.getByLabelText(/Categoría/i), {
      target: { value: 'unas' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: /Guardar fotografías/i }),
    );

    expect(
      await screen.findByText('Fotografía agregada correctamente'),
    ).toBeInTheDocument();

    // Crear nueva categoría sin trabajos ("Facial")
    fireEvent.click(
      screen.getByRole('button', { name: 'Categorías de servicio' }),
    );
    fireEvent.change(screen.getByLabelText('Nombre de nueva categoría'), {
      target: { value: 'Facial' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: /Agregar categoría/i }),
    );
    expect(
      screen.getByText('Categoría agregada correctamente'),
    ).toBeInTheDocument();

    // Regresar a la vista pública y comprobar sincronización
    fireEvent.click(screen.getByRole('button', { name: /Ver página pública/i }));

    expect(await screen.findByText('Diseño Editorial Nuevo')).toBeInTheDocument();
    const facialTab = screen.getByRole('tab', { name: 'Facial' });
    expect(facialTab).toBeInTheDocument();

    // Al filtrar por Facial (sin fotos), mostrar Empty State editorial
    fireEvent.click(facialTab);
    expect(
      screen.getByText('Aún no hay trabajos publicados en esta categoría.'),
    ).toBeInTheDocument();

    // Volver a ver todos los trabajos
    fireEvent.click(
      screen.getByRole('button', { name: 'Ver todos los trabajos' }),
    );
    expect(screen.getByTestId('collage-magazine-spread')).toBeInTheDocument();
  });
});
