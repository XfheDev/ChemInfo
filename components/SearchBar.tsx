import React from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  initialQuery?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading, initialQuery = '' }) => {
  const [query, setQuery] = React.useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  React.useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-4 sm:mb-6 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Örn: Su, Asetik Asit veya 'alkanları karşılaştır'"
          disabled={isLoading}
          className="w-full pl-5 pr-12 py-4 text-base sm:text-lg bg-gray-700/50 text-white rounded-full border border-transparent focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 focus:bg-gray-700/80 outline-none transition-all duration-300 shadow-lg placeholder-gray-400 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-12 my-auto mr-2 text-cyan-200 bg-cyan-600/50 rounded-full hover:bg-cyan-500/70 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform focus:scale-110 focus:outline-none"
        >
          <span className="material-symbols-outlined">search</span>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
