import { useEffect, useState } from 'react';
import { AdminLoginView } from './components/admin/AdminLoginView';
import { AdminPanelView } from './components/admin/AdminPanelView';
import { AppFooter } from './components/layout/AppFooter';
import { AppHeader } from './components/layout/AppHeader';
import { FloatingWhatsAppButton } from './components/layout/FloatingWhatsAppButton';
import { AppointmentSection } from './sections/AppointmentSection';
import { ContactSection } from './sections/ContactSection';
import { FaqSection } from './sections/FaqSection';
import { GallerySection } from './sections/GallerySection';
import { HeroSection } from './sections/HeroSection';
import { ServicesSection } from './sections/ServicesSection';
import { getConfirmedFaqs } from './services/catalog.service';
import {
  createInitialAdminCategories,
  createInitialAdminItems,
  type AdminGalleryItem,
  type AdminSession,
} from './services/supabase.service';
import type { CategorySlug, ServiceCategory } from './types/catalog';

interface AppProps {
  initialRoute?: '/' | '/admin';
}

function resolveInitialRoute(initialRoute?: '/' | '/admin'): '/' | '/admin' {
  if (initialRoute) return initialRoute;
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
    return '/admin';
  }
  return '/';
}

export function App({ initialRoute }: AppProps = {}) {
  const [route, setRoute] = useState<'/' | '/admin'>(() =>
    resolveInitialRoute(initialRoute),
  );
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [categories, setCategories] = useState<ServiceCategory[]>(() =>
    createInitialAdminCategories(),
  );
  const [adminItems, setAdminItems] = useState<AdminGalleryItem[]>(() =>
    createInitialAdminItems(),
  );
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<
    CategorySlug | 'todos'
  >('todos');

  const confirmedFaqs = getConfirmedFaqs();

  useEffect(() => {
    const handlePopState = () => {
      setRoute(window.location.pathname.startsWith('/admin') ? '/admin' : '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (target: '/' | '/admin') => {
    setRoute(target);
    if (typeof window !== 'undefined' && window.history?.pushState) {
      window.history.pushState({}, '', target);
    }
  };

  const handleExploreCategory = (slug: CategorySlug) => {
    setSelectedGalleryCategory(slug);
    const galleryEl = document.getElementById('galeria');
    if (galleryEl && typeof galleryEl.scrollIntoView === 'function') {
      galleryEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (route === '/admin') {
    if (!adminSession) {
      return (
        <AdminLoginView
          onLoginSuccess={(session) => setAdminSession(session)}
          onBackToPublic={() => navigateTo('/')}
        />
      );
    }

    return (
      <AdminPanelView
        session={adminSession}
        items={adminItems}
        categories={categories}
        onUpdateItems={setAdminItems}
        onUpdateCategories={setCategories}
        onResetDemoData={() => {
          setCategories(createInitialAdminCategories());
          setAdminItems(createInitialAdminItems());
          setSelectedGalleryCategory('todos');
        }}
        onLogout={() => setAdminSession(null)}
        onBackToPublic={() => navigateTo('/')}
      />
    );
  }

  const activeCategories = categories.filter((category) => category.isActive);

  return (
    <>
      <AppHeader />
      <main>
        <HeroSection />
        <ServicesSection
          categories={activeCategories}
          onExploreCategory={handleExploreCategory}
        />
        <GallerySection
          categories={activeCategories}
          selectedCategory={selectedGalleryCategory}
          onSelectCategory={setSelectedGalleryCategory}
          adminItems={adminItems}
        />
        <AppointmentSection categories={activeCategories} />
        <FaqSection items={confirmedFaqs} />
        <ContactSection />
      </main>
      <AppFooter onOpenAdmin={() => navigateTo('/admin')} />
      <FloatingWhatsAppButton />
    </>
  );
}

export default App;
