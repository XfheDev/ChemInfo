import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ResponseDisplay from './components/ResponseDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import History from './components/History';
import ThemeEditor from './components/ThemeEditor';
import FilterChips from './components/FilterChips';
import PeriodicTable from './components/PeriodicTable';
import FeedbackModal from './components/FeedbackModal';
import { getAnalysisForQuery } from './services/geminiService';
import { GeminiResponse, HistoryItem } from './types';
import { themes, Theme } from './themes';

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [response, setResponse] = useState<GeminiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isPeriodicTableOpen, setIsPeriodicTableOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('chemTheme');
    return themes.find(t => t.id === saved) || themes[0];
  });
  
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const savedHistory = localStorage.getItem('chemHistory');
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('chemHistory', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary-400', currentTheme.colors.primary400);
    root.style.setProperty('--color-primary-500', currentTheme.colors.primary500);
    root.style.setProperty('--color-primary-600', currentTheme.colors.primary600);
    root.style.setProperty('--color-surface-900', currentTheme.colors.surface900);
    root.style.setProperty('--color-surface-800', currentTheme.colors.surface800);
    
    document.body.style.backgroundColor = `rgb(${currentTheme.colors.surface900})`;
    localStorage.setItem('chemTheme', currentTheme.id);
  }, [currentTheme]);

  const handleFilterToggle = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    const enhancedQuery = activeFilters.length > 0 
      ? `${searchQuery} (${activeFilters.join(', ')} özellikleri dahil)` 
      : searchQuery;

    setQuery(searchQuery);
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await getAnalysisForQuery(enhancedQuery);
      setResponse(result);
      
      if (result.type === 'unknown' && (result.data as any).error) {
         setError((result.data as any).error);
      } else {
         setHistory(prev => {
            const filtered = prev.filter(item => item !== searchQuery);
            return [searchQuery, ...filtered].slice(0, 12);
         });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Beklenmedik bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  }, [activeFilters]);

  return (
    <div className="min-h-screen flex flex-col transition-all duration-1000 bg-surface-900 selection:bg-primary-500/30">
      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4 no-print">
         <button 
           onClick={() => setIsPeriodicTableOpen(true)}
           className="w-16 h-16 bg-surface-800 border border-white/10 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-all group"
           title="Periyodik Tablo"
         >
            <span className="material-symbols-outlined text-primary-400 group-hover:rotate-12 transition-transform text-3xl">grid_view</span>
         </button>
         <button 
           onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
           className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-primary-500 active:scale-90 transition-all opacity-0 pointer-events-none sm:opacity-100 sm:pointer-events-auto"
           style={{ opacity: window.scrollY > 400 ? 1 : 0 }}
         >
            <span className="material-symbols-outlined text-3xl">expand_less</span>
         </button>
      </div>

      <PeriodicTable isOpen={isPeriodicTableOpen} onClose={() => setIsPeriodicTableOpen(false)} onSelect={(s) => handleSearch(s)} />
      <FeedbackModal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} />

      <main className="flex-grow container mx-auto px-4 py-12 max-w-5xl">
        <Header />
        
        <div className="max-w-3xl mx-auto">
          <ThemeEditor 
            currentThemeId={currentTheme.id} 
            onThemeChange={setCurrentTheme} 
          />
          <SearchBar onSearch={handleSearch} isLoading={isLoading} initialQuery={query} />
          <FilterChips onFilterSelect={handleFilterToggle} activeFilters={activeFilters} />
          <History 
            history={history} 
            onHistoryClick={handleSearch} 
            onClearHistory={() => setHistory([])} 
            isLoading={isLoading} 
          />
        </div>

        <div className="mt-12">
          {isLoading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} />}
          {response && !isLoading && <ResponseDisplay response={response} />}
        </div>
      </main>

      <footer className="w-full text-center py-10 text-text-muted text-xs border-t border-white/5 no-print">
        <div className="flex justify-center gap-6 mb-4">
           <span className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">verified</span> Profesyonel Analiz</span>
           <span className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">view_in_ar</span> 3D Görselleştirme</span>
           <button 
             onClick={() => setIsFeedbackModalOpen(true)}
             className="flex items-center gap-2 hover:text-primary-400 transition-colors"
           >
             <span className="material-symbols-outlined text-sm">feedback</span> 
             Geri Bildirim Gönder
           </button>
        </div>
        &copy; {new Date().getFullYear()} ChemInfo Pro • Moleküler Zeka Platformu
      </footer>
    </div>
  );
};

export default App;