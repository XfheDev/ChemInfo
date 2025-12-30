import React from 'react';
import { themes, Theme } from '../themes';

interface ThemeEditorProps {
  currentThemeId: string;
  onThemeChange: (theme: Theme) => void;
}

const ThemeEditor: React.FC<ThemeEditorProps> = ({ currentThemeId, onThemeChange }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-10 no-print animate-fade-in-up" style={{ animationDelay: '50ms' }}>
      {themes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => onThemeChange(theme)}
          title={theme.name}
          className={`group relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-500 ${
            currentThemeId === theme.id 
              ? 'ring-2 ring-offset-4 ring-offset-surface-900 ring-primary-500 scale-110 rotate-3 shadow-[0_0_20px_rgba(var(--color-primary-500),0.4)]' 
              : 'hover:scale-110 opacity-40 hover:opacity-100 hover:-rotate-3'
          }`}
          style={{ 
            background: `linear-gradient(135deg, rgb(${theme.colors.primary400}), rgb(${theme.colors.primary600}))`,
            boxShadow: currentThemeId === theme.id ? `0 0 25px rgba(${theme.colors.primary500}, 0.5)` : 'none'
          }}
        >
          <span className="material-symbols-outlined text-white text-2xl drop-shadow-md">
            {theme.icon}
          </span>
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-surface-800 text-[10px] font-black whitespace-nowrap rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none border border-white/10 shadow-2xl z-50 transform translate-y-2 group-hover:translate-y-0">
            {theme.name.toUpperCase()}
          </div>
        </button>
      ))}
    </div>
  );
};

export default ThemeEditor;