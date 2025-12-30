import React from 'react';
import { ChemicalInfo } from '../types';
import FormattedContent from './FormattedContent';

interface Props {
  safetyInfo: ChemicalInfo['safety_information'];
}

const pictogramMap: Record<string, string> = {
    explosive: 'bomb',
    flammable: 'local_fire_department',
    oxidizing: 'whatshot',
    compressed_gas: 'propane_tank',
    corrosive: 'invert_colors',
    toxic: 'skull',
    harmful: 'priority_high',
    health_hazard: 'personal_injury',
    environmental_hazard: 'eco',
};

const SafetyScenario: React.FC<Props> = ({ safetyInfo }) => {
  if (!safetyInfo) return null;

  return (
    <div className="bg-danger-bg/40 backdrop-blur-lg p-6 rounded-xl ring-1 ring-danger-fg/30">
        <h3 className="text-xl font-bold text-danger-fg mb-4 flex items-center gap-3">
            <span className="material-symbols-outlined">gpp_bad</span>
            Güvenlik Bilgileri
        </h3>

        {safetyInfo.pictograms && safetyInfo.pictograms.length > 0 && (
             <div className="flex flex-wrap gap-x-4 gap-y-8 justify-center mb-6 pt-2">
                {safetyInfo.pictograms.map((p, index) => (
                    <div key={index} className="flex flex-col items-center text-center w-28">
                        <div className="w-20 h-20 mb-3 bg-white flex items-center justify-center transform rotate-45 ring-4 ring-danger-fg rounded-lg">
                            <div className="transform -rotate-45">
                                <span className="material-symbols-outlined text-5xl text-black">
                                    {pictogramMap[p.symbol] || 'question_mark'}
                                </span>
                            </div>
                        </div>
                        <span className="text-sm font-medium text-text-main">{p.label}</span>
                    </div>
                ))}
            </div>
        )}
       
        <FormattedContent content={safetyInfo.summary} />
    </div>
  );
};

export default SafetyScenario;