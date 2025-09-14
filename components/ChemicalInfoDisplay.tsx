import React from 'react';
import { ChemicalInfo } from '../types';
import FormattedContent from './FormattedContent';
import Quiz from './Quiz';
import SafetyScenario from './SafetyScenario';

const pictogramMap: Record<string, string> = {
    explosive: 'bomb',
    flammable: 'local_fire_department',
    oxidizing: 'whatshot',
    compressed_gas: 'gas_meter',
    corrosive: 'invert_colors',
    toxic: 'skull',
    harmful: 'priority_high',
    health_hazard: 'health_and_safety',
    environmental_hazard: 'eco',
};

const ChemicalInfoDisplay: React.FC<{ data: ChemicalInfo }> = ({ data }) => {
    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header Section */}
            <div className="bg-gray-800/50 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl ring-1 ring-white/10">
                <div className="border-b border-white/10 pb-6 mb-6">
                    <h2 className="text-4xl font-extrabold text-cyan-400 tracking-tight">{data.name}</h2>
                    <p className="text-2xl font-mono text-gray-400 mt-2">{data.formula}</p>
                </div>
                <FormattedContent content={data.description} />
            </div>

            {/* Properties Section */}
            <div className="bg-gray-800/60 p-6 rounded-xl ring-1 ring-white/10">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <span className="material-symbols-outlined">science</span>
                    Özellikler
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                    {Object.entries(data.properties).map(([key, value]) => (
                        <li key={key} className="flex justify-between border-b border-gray-700 py-2">
                            <span className="font-semibold text-gray-300">{key}</span>
                            <span className="text-gray-400 text-right">{value}</span>
                        </li>
                    ))}
                </ul>
            </div>
            
            {/* Safety Information Section */}
            <SafetyScenario safetyInfo={data.safety_information} pictograms={pictogramMap} />

            {/* Quiz Section */}
            {data.quiz && <Quiz title={data.quiz.title} questions={data.quiz.questions} />}
        </div>
    );
};

export default ChemicalInfoDisplay;
