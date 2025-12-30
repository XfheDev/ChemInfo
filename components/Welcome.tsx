import React from 'react';

interface WelcomeProps {
    onSampleClick: (query: string) => void;
}

const sampleQueries = [
    "Aspirin",
    "Polimer nedir?",
    "H2SO4",
    "Oksidasyon nasıl çalışır?",
];

const Welcome: React.FC<WelcomeProps> = ({ onSampleClick }) => {
    return (
        <div className="text-center bg-surface-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl ring-1 ring-surface-600/50 animate-fade-in-up">
            <span className="material-symbols-outlined text-6xl text-primary-400 mb-4">
                science
            </span>
            <h2 className="text-2xl font-bold text-text-main mb-2">Kimya Dünyasına Hoş Geldiniz</h2>
            <p className="text-text-muted mb-6">
                Başlamak için bir kimyasal bileşik adı girin veya aşağıdaki örneklerden birini deneyin.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
                {sampleQueries.map((query) => (
                    <button
                        key={query}
                        onClick={() => onSampleClick(query)}
                        className="px-4 py-2 bg-surface-700/60 text-text-main rounded-lg text-sm hover:bg-surface-600/80 hover:text-text-main transition-all duration-200 transform hover:scale-105"
                    >
                        {query}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Welcome;