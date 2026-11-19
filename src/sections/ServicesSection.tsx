import { CategoryServiceIcon } from '../components/ui/BrandIcons';
import { ImagePlaceholder } from '../components/ui/ImagePlaceholder';
import { SectionHeading } from '../components/ui/SectionHeading';
import type { CategorySlug, PlaceholderSlot, ServiceCategory } from '../types/catalog';

interface ServicesSectionProps {
  categories: ServiceCategory[];
  onExploreCategory: (slug: CategorySlug) => void;
}

export function ServicesSection({
  categories,
  onExploreCategory,
}: ServicesSectionProps) {
  return (
    <>
      <div className="category-strip" aria-label="Accesos rápidos por servicio">
        <div className="container">
          <div className="category-strip__list">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className="category-strip__item"
                onClick={() => onExploreCategory(category.slug)}
              >
                <span className="category-strip__circle">
                  <CategoryServiceIcon slug={category.slug} size={24} />
                </span>
                <span className="category-strip__label">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <section
        id="servicios"
        className="section-band section-band--light"
        aria-labelledby="services-heading"
      >
        <div className="container">
          <SectionHeading
            eyebrow="Catálogo de servicios"
            title="Nuestros"
            highlightWord="Servicios"
            subtitle="Cada categoría está preparada para exhibir fotografías reales de nuestros trabajos, detalles de estilos y consulta directa."
            headingId="services-heading"
          />

          <div className="services-mosaic">
            {categories.map((category) => {
              const placeholderSlot: PlaceholderSlot = {
                id: category.placeholderId,
                title: `Fotografía del servicio — ${category.name}`,
                temporaryLabel: 'Fotografía del servicio',
                subtitle: `Espacio reservado • Proporción ${category.aspectRatio}`,
                categorySlug: category.slug,
                categoryName: category.name,
                aspectRatio: category.aspectRatio,
                role: category.desktopSpan === 5 ? 'panoramic' : 'secondary',
                isPublished: true,
                imageUrl: null,
              };

              return (
                <article
                  key={category.id}
                  className={`service-card services-mosaic__item services-mosaic__item--span-${category.desktopSpan}`}
                >
                  <ImagePlaceholder slot={placeholderSlot} theme="light" />

                  <div className="service-card__body">
                    <div className="service-card__header">
                      <h3 className="service-card__title">{category.name}</h3>
                      <span className="service-card__number">{category.number}</span>
                    </div>
                    <p className="service-card__desc">{category.description}</p>
                  </div>

                  <div className="service-card__footer">
                    <span className="service-card__price-note">
                      {category.priceStatus}
                    </span>
                    <button
                      type="button"
                      className="btn-link"
                      onClick={() => onExploreCategory(category.slug)}
                    >
                      Explorar trabajos →
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
