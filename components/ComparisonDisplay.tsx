import React from 'react';
import { ComparisonInfo } from '../types';
import FormattedContent from './FormattedContent';

interface Props {
  data: ComparisonInfo;
}

const ComparisonDisplay: React.FC<Props> = ({ data }) => {
  const allKeys = Array.from(new Set(data.compounds.flatMap(c => Object.keys(c.features))));

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl ring-1 ring-white/10 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6 text-center">{data.title}</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-gray-900/40">
                    <th className="p-3 font-semibold text-white border-b-2 border-white/10">Özellik</th>
                    {data.compounds.map(c => <th key={c.name} className="p-3 font-semibold text-white border-b-2 border-white/10">{c.name}</th>)}
                </tr>
            </thead>
            <tbody>
                {/* FIX: Add explicit string type to 'key' to resolve potential type inference issues. */}
                {allKeys.map((key: string) => (
                    <tr key={key} className="border-b border-white/10">
                        <td className="p-3 font-medium text-gray-300">{key}</td>
                        {data.compounds.map(c => (
                            <td key={c.name} className="p-3 text-gray-400">{c.features[key] || 'N/A'}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      <div className="mt-8 pt-6 border-t border-white/10">
          <h3 className="text-xl font-semibold text-white mb-3">Özet</h3>
          <FormattedContent content={data.summary} />
      </div>
    </div>
  );
};

export default ComparisonDisplay;
