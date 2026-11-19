import { useState } from 'react';
import {
  buildWhatsAppUrl,
  DEFAULT_WHATSAPP_MESSAGE,
  INSTAGRAM_HANDLE,
} from '../../services/whatsapp.service';
import {
  BrandMonogram,
  CloseIcon,
  MenuIcon,
  WhatsAppIcon,
} from '../ui/BrandIcons';

const NAV_ITEMS = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#galeria', label: 'Galería' },
  { href: '#solicitar-cita', label: 'Solicitar cita' },
  { href: '#preguntas-frecuentes', label: 'Preguntas frecuentes' },
  { href: '#contacto', label: 'Contacto' },
];

export function AppHeader() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const directWhatsAppUrl = buildWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGE);

  const handleCloseDrawer = () => setIsDrawerOpen(false);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a href="#inicio" className="brand-lockup" aria-label="Luz Beauty Studio — Ir al inicio">
          <BrandMonogram size={42} />
          <span className="brand-lockup__text">
            <span className="brand-lockup__name">
              Luz Beauty <em>Studio</em>
            </span>
            <span className="brand-lockup__tag">{INSTAGRAM_HANDLE}</span>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Navegación principal">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} className="desktop-nav__link">
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href={directWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn--primary header-cta"
        >
          <WhatsAppIcon size={18} />
          WhatsApp
        </a>

        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label={isDrawerOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
          aria-expanded={isDrawerOpen}
          aria-controls="mobile-navigation-drawer"
          onClick={() => setIsDrawerOpen((prev) => !prev)}
        >
          {isDrawerOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
        </button>
      </div>

      {isDrawerOpen ? (
        <div
          id="mobile-navigation-drawer"
          className="mobile-drawer"
          role="dialog"
          aria-label="Menú móvil"
        >
          <nav className="mobile-drawer__nav" aria-label="Navegación móvil">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="mobile-drawer__link"
                onClick={handleCloseDrawer}
              >
                <span>{item.label}</span>
                <span aria-hidden="true" style={{ color: '#E83E78' }}>
                  →
                </span>
              </a>
            ))}
          </nav>

          <a
            href={directWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--primary btn--full"
            onClick={handleCloseDrawer}
          >
            <WhatsAppIcon size={18} />
            Consultar por WhatsApp
          </a>
        </div>
      ) : null}
    </header>
  );
}
