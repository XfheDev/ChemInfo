import React from 'react';
import { type HistoryItem } from '../types';

interface HistoryProps {
    history: HistoryItem[];
    onHistoryClick: (query: HistoryItem) => void;
    onClearHistory: () => void;
    isLoading: boolean;
}

const History: React.FC<HistoryProps> = ({ history, onHistoryClick, onClearHistory, isLoading }) => {
    if (history.length === 0) {
        return null;
    }

    return (
        <div className="w-full max-w-2xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="flex justify-between items-center mb-3 px-2">
                <h3 className="text-sm font-semibold text-gray-400">Son Aramalar</h3>
                <button 
                    onClick={onClearHistory}
                    disabled={isLoading}
                    className="ml-auto text-xs text-gray-500 hover:text-cyan-400 transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    Temizle
                </button>
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {history.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => onHistoryClick(item)}
                        disabled={isLoading}
                        className="px-4 py-1.5 bg-gray-700/50 text-gray-300 rounded-full text-sm hover:bg-gray-600/70 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default History;