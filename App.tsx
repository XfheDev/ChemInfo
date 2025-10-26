import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ResponseDisplay from './components/ResponseDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import Welcome from './components/Welcome';
import History from './components/History';
import { getAnalysisForQuery } from './services/geminiService';
import { GeminiResponse, HistoryItem } from './types';

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [response, setResponse] = useState<GeminiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const savedHistory = localStorage.getItem('chemHistory');
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('chemHistory', JSON.stringify(history));
    } catch (e) {
      console.error("Could not save history to localStorage", e);
    }
  }, [history]);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setQuery(searchQuery);
    setIsLoading(true);
    setError(null);
    setResponse(null);

    if (!history.includes(searchQuery)) {
      setHistory(prev => [searchQuery, ...prev].slice(0, 10));
    }

    try {
      const result = await getAnalysisForQuery(searchQuery);
      setResponse(result);
      if (result.type === 'unknown' && (result.data as any).error) {
         setError((result.data as any).error);
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [history]);
  
  const handleHistoryClick = (historyItem: HistoryItem) => {
    handleSearch(historyItem);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleSampleClick = (sampleQuery: string) => {
      handleSearch(sampleQuery);
  }

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (error) {
      return <ErrorMessage message={error} />;
    }
    if (response) {
      return <ResponseDisplay response={response} />;
    }
    return <Welcome onSampleClick={handleSampleClick} />;
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8 sm:py-12 md:py-16 max-w-4xl">
        <Header />
        <SearchBar onSearch={handleSearch} isLoading={isLoading} initialQuery={query} />
        <History history={history} onHistoryClick={handleHistoryClick} onClearHistory={handleClearHistory} isLoading={isLoading} />
        <div className="mt-8">
          {renderContent()}
        </div>
      </main>
      <footer className="w-full text-center py-4 text-gray-500 text-sm no-print">
        Çınar Şerif AKIN ve Yağız Eren ÖZTEKİN
      </footer>
    </div>
  );
};

export default App;
