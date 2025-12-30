import React from 'react';
import { ComparisonInfo } from '../types';
import FormattedContent from './FormattedContent';

interface Props {
  data: ComparisonInfo;
}

const ComparisonDisplay: React.FC<Props> = ({ data }) => {
  const allKeys = Array.from(new Set(data.compounds.flatMap(c => Object.keys(c.features))));

  return (
    <div className="bg-surface-800/50 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl ring-1 ring-surface-600/50 animate-fade-in-up printable-content">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary-400 text-center flex-grow">{data.title}</h2>
        <button
            onClick={() => window.print()}
            className="no-print -mr-2 p-2 text-text-muted rounded-full hover:bg-surface-700/50 hover:text-primary-400 transition-colors"
            aria-label="Karşılaştırmayı yazdır"
        >
            <span className="material-symbols-outlined">print</span>
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-surface-900/40">
                    <th className="p-3 font-semibold text-text-main border-b-2 border-surface-600/50">Özellik</th>
                    {data.compounds.map(c => <th key={c.name} className="p-3 font-semibold text-text-main border-b-2 border-surface-600/50">{c.name}</th>)}
                </tr>
            </thead>
            <tbody>
                {/* FIX: Add explicit string type to 'key' to resolve potential type inference issues. */}
                {allKeys.map((key: string) => (
                    <tr key={key} className="border-b border-surface-600/50">
                        <td className="p-3 font-medium text-text-main">{key}</td>
                        {data.compounds.map(c => (
                            <td key={c.name} className="p-3 text-text-muted">{c.features[key] || 'N/A'}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      <div className="mt-8 pt-6 border-t border-surface-600/50">
          <h3 className="text-xl font-semibold text-text-main mb-3">Özet</h3>
          <FormattedContent content={data.summary} />
      </div>
    </div>
  );
};

export default ComparisonDisplay;