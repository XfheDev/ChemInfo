import React from 'react';
import { GeneralAnswer } from '../types';
import FormattedContent from './FormattedContent';

interface Props {
    data: GeneralAnswer;
}

const GeneralAnswerDisplay: React.FC<Props> = ({ data }) => {
    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="bg-gray-800/50 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl ring-1 ring-white/10">
                <h2 className="text-3xl font-bold text-cyan-400">{data.title}</h2>
                <div className="mt-4 text-lg text-gray-300">
                    <FormattedContent content={data.summary} />
                </div>
            </div>
            {data.sections.map((section, index) => (
                <div key={index} className="bg-gray-800/60 p-6 rounded-xl ring-1 ring-white/10">
                    <h3 className="text-xl font-bold text-white mb-3">{section.subtitle}</h3>
                    <FormattedContent content={section.content} />
                </div>
            ))}
        </div>
    );
};

export default GeneralAnswerDisplay;