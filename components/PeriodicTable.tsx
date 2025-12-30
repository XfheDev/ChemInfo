import React from 'react';

interface PeriodicTableProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (symbol: string) => void;
}

const elements = [
  { s: 'H', n: 'Hidrojen' }, { s: 'He', n: 'Helyum' },
  { s: 'Li', n: 'Lityum' }, { s: 'Be', n: 'Berilyum' }, { s: 'B', n: 'Bor' }, { s: 'C', n: 'Karbon' }, { s: 'N', n: 'Azot' }, { s: 'O', n: 'Oksijen' }, { s: 'F', n: 'Flor' }, { s: 'Ne', n: 'Neon' },
  { s: 'Na', n: 'Sodyum' }, { s: 'Mg', n: 'Magnezyum' }, { s: 'Al', n: 'Alüminyum' }, { s: 'Si', n: 'Silisyum' }, { s: 'P', n: 'Fosfor' }, { s: 'S', n: 'Kükürt' }, { s: 'Cl', n: 'Klor' }, { s: 'Ar', n: 'Argon' },
  { s: 'K', n: 'Potasyum' }, { s: 'Ca', n: 'Kalsiyum' }, { s: 'Fe', n: 'Demir' }, { s: 'Cu', n: 'Bakır' }, { s: 'Zn', n: 'Çinko' }, { s: 'Ag', n: 'Gümüş' }, { s: 'Au', n: 'Altın' }, { s: 'Hg', n: 'Cıva' }, { s: 'Pb', n: 'Kurşun' }
];

const PeriodicTable: React.FC<PeriodicTableProps> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end no-print">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-surface-900 border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] p-8 overflow-y-auto animate-fade-in-right">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black text-white flex items-center gap-3">
                <span className="material-symbols-outlined text-primary-400">apps</span>
                HIZLI ELEMENT SEÇİMİ
            </h2>
            <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
            </button>
        </div>

        <div className="grid grid-cols-4 gap-3">
            {elements.map((el) => (
                <button
                    key={el.s}
                    onClick={() => { onSelect(el.n); onClose(); }}
                    className="aspect-square bg-surface-800 border border-white/5 rounded-xl flex flex-col items-center justify-center group hover:bg-primary-600 hover:border-primary-400 transition-all"
                >
                    <span className="text-xl font-black text-white group-hover:scale-110 transition-transform">{el.s}</span>
                    <span className="text-[8px] text-text-muted group-hover:text-white/80 uppercase tracking-tighter">{el.n}</span>
                </button>
            ))}
        </div>

        <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/5">
            <p className="text-[10px] text-text-muted font-bold leading-relaxed">
                * Bu liste en yaygın elementleri içerir. Diğer bileşikler için lütfen arama çubuğunu kullanın.
            </p>
        </div>
      </div>
    </div>
  );
};

export default PeriodicTable;