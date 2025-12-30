import React, { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  initialQuery?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'tr-TR';
      recognitionRef.current.continuous = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        onSearch(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [onSearch]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative group z-10 no-print animate-fade-in-up">
      <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-indigo-500 to-primary-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
      
      <div className="relative flex items-center">
        <div className="absolute left-6 text-text-muted group-focus-within:text-primary-400 transition-colors">
            <span className="material-symbols-outlined text-2xl">search</span>
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Molekül, bileşik veya kavram..."
          disabled={isLoading}
          className="w-full pl-16 pr-32 py-6 text-xl bg-surface-800/80 backdrop-blur-3xl text-text-main rounded-[2.2rem] border border-white/10 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 outline-none transition-all placeholder:text-text-muted/40 font-medium"
        />

        <div className="absolute right-4 flex gap-2">
            {recognitionRef.current && (
              <button
                type="button"
                onClick={toggleListening}
                className={`w-12 h-12 flex items-center justify-center rounded-full transition-all ${
                  isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white/5 text-text-muted hover:bg-white/10 hover:text-primary-400'
                }`}
                title="Sesle Ara"
              >
                <span className="material-symbols-outlined">{isListening ? 'mic' : 'mic_none'}</span>
              </button>
            )}
            
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="w-12 h-12 flex items-center justify-center text-white bg-primary-600 rounded-full hover:bg-primary-500 transition-all disabled:opacity-30 shadow-lg shadow-primary-500/20 active:scale-90"
            >
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
        </div>
      </div>
      
      {isListening && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-primary-400 tracking-[0.3em] animate-pulse">
          DİNLENİYOR...
        </div>
      )}
    </form>
  );
};

export default SearchBar;