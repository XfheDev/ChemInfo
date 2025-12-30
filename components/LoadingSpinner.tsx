import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-20 animate-fade-in-up">
      <div className="relative w-24 h-24 mb-10">
          <div className="absolute inset-0 border-4 border-primary-500/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-primary-500 rounded-full animate-spin"></div>
          <div className="absolute inset-4 border-4 border-white/5 rounded-full"></div>
          <div className="absolute inset-4 border-4 border-b-primary-400/40 rounded-full animate-[spin_3s_linear_infinite]"></div>
          
          {/* Bubbles */}
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-primary-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-4 right-2 w-1 h-1 bg-white rounded-full animate-bounce"></div>
      </div>
      
      <div className="text-center space-y-3">
          <h3 className="text-xl font-black text-white tracking-widest uppercase animate-pulse">
              ANALİZ <span className="text-primary-500">EDİLİYOR</span>
          </h3>
          <p className="text-[10px] text-text-muted font-bold tracking-[0.4em] uppercase">
              Yapay Zeka Moleküler Bağları İnceliyor
          </p>
      </div>

      <div className="mt-12 w-64 h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary-600 to-indigo-500 w-1/3 animate-[loading_2s_infinite]"></div>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;