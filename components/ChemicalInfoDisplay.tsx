import React, { useState } from 'react';
import { ChemicalInfo } from '../types';
import FormattedContent from './FormattedContent';
import Quiz from './Quiz';
import SafetyScenario from './SafetyScenario';
import MoleculeVisualizer from './MoleculeVisualizer';

const ChemicalInfoDisplay: React.FC<{ data: ChemicalInfo }> = ({ data }) => {
    const [propFilter, setPropFilter] = useState('');

    const filteredProperties = Object.entries(data.properties).filter(([key, value]) => 
        key.toLowerCase().includes(propFilter.toLowerCase()) || 
        value.toLowerCase().includes(propFilter.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in-up printable-content">
            {/* Top Section: Basic Info & Visualizer */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-8">
                    {/* Header Section */}
                    <div className="bg-surface-800/50 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl ring-1 ring-surface-600/50 h-full flex flex-col justify-center">
                        <div className="flex justify-between items-start">
                            <div className="border-b border-surface-600/50 pb-6 mb-6 flex-grow">
                                <h2 className="text-4xl font-extrabold text-primary-400 tracking-tight">{data.name}</h2>
                                <p className="text-2xl font-mono text-text-muted mt-2">{data.formula}</p>
                            </div>
                            <button
                                onClick={() => window.print()}
                                className="no-print ml-4 p-2 text-text-muted rounded-full hover:bg-surface-700/50 hover:text-primary-400 transition-colors"
                                aria-label="Bilgileri yazdır"
                            >
                                <span className="material-symbols-outlined">print</span>
                            </button>
                        </div>
                        <FormattedContent content={data.description} />
                    </div>
                </div>

                <div className="lg:col-span-2">
                    {/* Molecule Visualizer */}
                    <MoleculeVisualizer name={data.name} smiles={data.smiles} cid={data.pubchem_cid} />
                </div>
            </div>

            {/* Properties Section */}
            <div className="bg-surface-800/60 p-6 sm:p-8 rounded-2xl ring-1 ring-white/10 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h3 className="text-xl font-bold text-text-main flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary-400">science</span>
                        Fiziksel ve Kimyasal Özellikler
                    </h3>
                    
                    <div className="relative max-w-xs w-full no-print">
                        <input 
                            type="text" 
                            placeholder="Özelliklerde ara..." 
                            value={propFilter}
                            onChange={(e) => setPropFilter(e.target.value)}
                            className="w-full bg-surface-900/50 border border-surface-600 rounded-lg py-1.5 pl-8 pr-3 text-sm focus:ring-1 focus:ring-primary-400 outline-none transition-all"
                        />
                        <span className="material-symbols-outlined absolute left-2 top-1.5 text-text-muted text-lg">search</span>
                    </div>
                </div>

                {filteredProperties.length > 0 ? (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
                        {filteredProperties.map(([key, value]) => (
                            <li key={key} className="flex justify-between items-center border-b border-surface-700/50 py-3 group">
                                <span className="font-bold text-primary-300/90 text-sm group-hover:text-primary-400 transition-colors">{key}</span>
                                <span className="text-text-main text-sm font-medium text-right">{value}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="py-8 text-center text-text-muted italic">
                        "{propFilter}" ile eşleşen özellik bulunamadı.
                    </div>
                )}
            </div>
            
            {/* Safety Information Section */}
            <SafetyScenario safetyInfo={data.safety_information} />

            {/* Quiz Section */}
            {data.quiz && <Quiz title={data.quiz.title} questions={data.quiz.questions} />}
        </div>
    );
};

export default ChemicalInfoDisplay;