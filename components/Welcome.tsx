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
        <div className="text-center bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl ring-1 ring-white/10 animate-fade-in-up">
            <span className="material-symbols-outlined text-6xl text-cyan-400 mb-4">
                science
            </span>
            <h2 className="text-2xl font-bold text-white mb-2">Kimya Dünyasına Hoş Geldiniz</h2>
            <p className="text-gray-400 mb-6">
                Başlamak için bir kimyasal bileşik adı girin veya aşağıdaki örneklerden birini deneyin.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
                {sampleQueries.map((query) => (
                    <button
                        key={query}
                        onClick={() => onSampleClick(query)}
                        className="px-4 py-2 bg-gray-700/60 text-gray-200 rounded-lg text-sm hover:bg-gray-600/80 hover:text-white transition-all duration-200 transform hover:scale-105"
                    >
                        {query}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Welcome;
