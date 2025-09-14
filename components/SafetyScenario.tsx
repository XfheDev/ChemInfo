import React from 'react';
import { ChemicalInfo } from '../types';
import FormattedContent from './FormattedContent';

interface Props {
  safetyInfo: ChemicalInfo['safety_information'];
  pictograms: Record<string, string>;
}

const SafetyScenario: React.FC<Props> = ({ safetyInfo, pictograms }) => {
  if (!safetyInfo) return null;

  return (
    <div className="bg-red-900/40 backdrop-blur-lg p-6 rounded-xl ring-1 ring-red-500/30">
        <h3 className="text-xl font-bold text-red-300 mb-4 flex items-center gap-3">
            <span className="material-symbols-outlined">gpp_bad</span>
            Güvenlik Bilgileri
        </h3>

        {safetyInfo.pictograms && safetyInfo.pictograms.length > 0 && (
             <div className="flex flex-wrap gap-4 mb-4">
                {safetyInfo.pictograms.map((p, index) => (
                    <div key={index} className="flex flex-col items-center text-center p-2 bg-gray-700/50 rounded-lg w-24">
                        <span className="material-symbols-outlined text-4xl text-red-300">
                            {pictograms[p.symbol] || 'question_mark'}
                        </span>
                        <span className="text-xs text-gray-300 mt-1">{p.label}</span>
                    </div>
                ))}
            </div>
        )}
       
        <FormattedContent content={safetyInfo.summary} />
    </div>
  );
};

export default SafetyScenario;
