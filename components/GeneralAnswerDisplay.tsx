import React from 'react';
import { GeneralAnswer } from '../types';
import FormattedContent from './FormattedContent';

interface Props {
    data: GeneralAnswer;
}

const GeneralAnswerDisplay: React.FC<Props> = ({ data }) => {
    return (
        <div className="space-y-6 animate-fade-in-up printable-content">
            <div className="bg-surface-800/50 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl ring-1 ring-surface-600/50">
                 <div className="flex justify-between items-start">
                    <h2 className="text-3xl font-bold text-primary-400 flex-grow">{data.title}</h2>
                    <button
                        onClick={() => window.print()}
                        className="no-print -mt-2 -mr-2 p-2 text-text-muted rounded-full hover:bg-surface-700/50 hover:text-primary-400 transition-colors"
                        aria-label="Cevabı yazdır"
                    >
                        <span className="material-symbols-outlined">print</span>
                    </button>
                </div>
                <div className="mt-4 text-lg text-text-main">
                    <FormattedContent content={data.summary} />
                </div>
            </div>
            {data.sections.map((section, index) => (
                <div key={index} className="bg-surface-800/60 p-6 rounded-xl ring-1 ring-surface-600/50">
                    <h3 className="text-xl font-bold text-text-main mb-3">{section.subtitle}</h3>
                    <FormattedContent content={section.content} />
                </div>
            ))}
        </div>
    );
};

export default GeneralAnswerDisplay;