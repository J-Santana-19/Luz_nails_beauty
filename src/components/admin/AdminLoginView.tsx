import { useState, type FormEvent } from 'react';
import {
  isSupabaseConfigured,
  signInAdmin,
  type AdminSession,
} from '../../services/supabase.service';
import { BrandMonogram } from '../ui/BrandIcons';

interface AdminLoginViewProps {
  onLoginSuccess: (session: AdminSession) => void;
  onBackToPublic: () => void;
}

export function AdminLoginView({
  onLoginSuccess,
  onBackToPublic,
}: AdminLoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabaseReady = isSupabaseConfigured();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Ingresa tu correo electrónico y contraseña.');
      return;
    }

    try {
      setIsSubmitting(true);
      const session = await signInAdmin(email, password);
      onLoginSuccess(session);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'No fue posible iniciar sesión.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreviewDemo = async () => {
    const session = await signInAdmin('admin-vista-previa@local', 'vista-previa');
    onLoginSuccess(session);
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <div style={{ backgroundColor: '#171317', borderRadius: '9999px', padding: '6px' }}>
            <BrandMonogram size={48} />
          </div>
          <span className="section-heading__eyebrow">Panel privado de administración</span>
          <h1 className="admin-login-title">
            Luz Beauty <em>Studio</em>
          </h1>
          <p style={{ fontSize: '14px', color: '#8C7C84' }}>
            Acceso exclusivo para gestión del portafolio visual y categorías de servicio.
          </p>
        </div>

        {!supabaseReady ? (
          <div className="admin-notice">
            <strong>Modo Demostración Local:</strong> Las variables de Supabase aún no
            están configuradas en <code>.env</code>. Puedes explorar el panel usando el
            acceso de vista previa local.
          </div>
        ) : null}

        {errorMessage ? (
          <div className="admin-notice admin-notice--error" role="alert">
            {errorMessage}
          </div>
        ) : null}

        <form className="form-grid" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="admin-email" className="form-label">
              Correo electrónico
            </label>
            <input
              id="admin-email"
              type="email"
              className="form-control"
              placeholder="admin@luzbeautystudio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="admin-password" className="form-label">
              Contraseña
            </label>
            <div className="admin-password-wrap">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="admin-password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={
                  showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                }
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Verificando acceso...' : 'Iniciar sesión'}
          </button>

          {!supabaseReady ? (
            <button
              type="button"
              className="btn btn--secondary btn--full"
              onClick={handlePreviewDemo}
            >
              Entrar en Vista Previa Local
            </button>
          ) : null}
        </form>

        <div style={{ textAlign: 'center', paddingTop: '8px', borderTop: '1px solid rgba(140,124,132,0.2)' }}>
          <button
            type="button"
            className="btn-link"
            onClick={onBackToPublic}
          >
            ← Volver a la página pública
          </button>
        </div>
      </div>
    </div>
  );
}
