import React from 'react';
import { FilterCategory } from '../types/note';

interface CategoryFilterProps {
  active: FilterCategory;
  onSelect: (cat: FilterCategory) => void;
  counts: Record<FilterCategory, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  active,
  onSelect,
  counts,
}) => {
  // Order strictly per user spec: Kuliah | Tugas | Pribadi | Semua
  const categories: FilterCategory[] = ['Kuliah', 'Tugas', 'Pribadi', 'Semua'];

  return (
    <div className="border-b border-muted/20 w-full overflow-x-auto no-scrollbar">
      <div className="flex space-x-6 sm:space-x-8 text-left" role="tablist">
        {categories.map((cat) => {
          const isActive = active === cat;
          return (
            <button
              key={cat}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => onSelect(cat)}
              className={`pb-2.5 px-0.5 text-sm font-heading transition-colors relative whitespace-nowrap text-left ${
                isActive
                  ? 'text-ink font-semibold'
                  : 'text-muted hover:text-ink font-medium'
              }`}
            >
              <span>{cat}</span>
              <span className={`ml-1 text-xs font-normal ${isActive ? 'text-accent' : 'text-muted/70'}`}>
                ({counts[cat]})
              </span>
              {/* Underline indicator */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
