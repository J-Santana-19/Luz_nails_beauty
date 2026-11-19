import type { CategorySlug, ServiceCategory } from '../../types/catalog';

interface CategoryFilterBarProps {
  categories: ServiceCategory[];
  selectedCategory: CategorySlug | 'todos';
  onSelectCategory: (category: CategorySlug | 'todos') => void;
}

export function CategoryFilterBar({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterBarProps) {
  return (
    <div className="filter-bar" role="tablist" aria-label="Filtrar trabajos por categoría">
      <button
        type="button"
        role="tab"
        aria-selected={selectedCategory === 'todos'}
        className={`filter-pill ${selectedCategory === 'todos' ? 'filter-pill--active' : ''}`}
        onClick={() => onSelectCategory('todos')}
      >
        Todos
      </button>

      {categories.map((category) => {
        const isActive = selectedCategory === category.slug;
        return (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`filter-pill ${isActive ? 'filter-pill--active' : ''}`}
            onClick={() => onSelectCategory(category.slug)}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
