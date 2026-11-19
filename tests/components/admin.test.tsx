import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import App from '../../src/App';

afterEach(() => {
  cleanup();
});

describe('Panel Privado de Administración (/admin)', () => {
  it('muestra la pantalla de inicio de sesión sin registro público y permite alternar visibilidad de contraseña', () => {
    render(<App initialRoute="/admin" />);

    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    const passwordInput = screen.getByLabelText('Contraseña') as HTMLInputElement;
    expect(passwordInput.type).toBe('password');

    fireEvent.click(screen.getByRole('button', { name: /Mostrar contraseña/i }));
    expect(passwordInput.type).toBe('text');

    expect(screen.queryByText(/Crear cuenta/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Registrarse/i)).not.toBeInTheDocument();
  });

  it('muestra métricas del dashboard, permite ocultar fotografías y bloquea borrar categorías con trabajos', async () => {
    render(<App initialRoute="/admin" />);

    fireEvent.click(screen.getByRole('button', { name: /Entrar en Vista Previa Local/i }));

    expect(
      await screen.findByRole('heading', { level: 1, name: /Inicio \/ Dashboard/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('Cantidad total de imágenes')).toBeInTheDocument();
    expect(screen.getByText('Imágenes visibles al público')).toBeInTheDocument();
    expect(screen.getByText('Imágenes ocultas')).toBeInTheDocument();
    expect(screen.getByText('Total de secciones registradas')).toBeInTheDocument();

    // Ocultar una fotografía desde Galería de trabajos
    fireEvent.click(screen.getByRole('button', { name: 'Galería de trabajos' }));
    const hideButtons = screen.getAllByRole('button', { name: 'Ocultar' });
    fireEvent.click(hideButtons[0]);
    expect(screen.getByText('La fotografía fue ocultada')).toBeInTheDocument();

    // Intentar borrar una categoría que tiene trabajos vinculados
    fireEvent.click(screen.getByRole('button', { name: 'Categorías de servicio' }));
    const deleteCategoryButtons = screen.getAllByRole('button', { name: 'Eliminar' });
    fireEvent.click(deleteCategoryButtons[0]);
    expect(screen.getByText(/No se puede eliminar/i)).toBeInTheDocument();

    // Verificar opción Cerrar sesión
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }));
    expect(await screen.findByLabelText(/Correo electrónico/i)).toBeInTheDocument();
  });
});
