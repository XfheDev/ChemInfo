import React from 'react';

interface FilterChipsProps {
  onFilterSelect: (filter: string) => void;
  activeFilters: string[];
}

const filterOptions = [
  { id: 'boiling', label: 'Kaynama Noktası', icon: 'thermostat' },
  { id: 'melting', label: 'Erime Noktası', icon: 'ac_unit' },
  { id: 'density', label: 'Yoğunluk', icon: 'fitness_center' },
  { id: 'molar_mass', label: 'Molekül Ağırlığı', icon: 'monitor_weight' },
  { id: 'solubility', label: 'Çözünürlük', icon: 'water_drop' },
  { id: 'toxicity', label: 'Toksisite', icon: 'skull' },
];

const FilterChips: React.FC<FilterChipsProps> = ({ onFilterSelect, activeFilters }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mb-6 animate-fade-in-up no-print" style={{ animationDelay: '200ms' }}>
      <div className="flex items-center gap-2 mb-2 px-2 overflow-x-auto pb-2 scrollbar-hide">
        <span className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1 whitespace-nowrap">
          <span className="material-symbols-outlined text-sm">filter_list</span>
          Özellik Filtreleri:
        </span>
        <div className="flex gap-2">
          {filterOptions.map((filter) => {
            const isActive = activeFilters.includes(filter.label);
            return (
              <button
                key={filter.id}
                onClick={() => onFilterSelect(filter.label)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 whitespace-nowrap border ${
                  isActive 
                    ? 'bg-primary-500 text-white border-primary-400 shadow-lg shadow-primary-500/30 scale-105' 
                    : 'bg-surface-800/40 text-text-muted border-surface-700 hover:border-primary-500/50 hover:text-primary-400'
                }`}
              >
                <span className="material-symbols-outlined text-base">{filter.icon}</span>
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>
      {activeFilters.length > 0 && (
        <p className="text-[10px] text-primary-400/80 px-2 italic">
          * Seçilen özellikler aramaya eklenecek ve sonuçlarda önceliklendirilecektir.
        </p>
      )}
    </div>
  );
};

export default FilterChips;