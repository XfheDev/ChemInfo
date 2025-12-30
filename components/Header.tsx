import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="relative text-center mb-16 no-print animate-fade-in-up">
      <div className="inline-block mb-4 p-3 bg-primary-500/10 rounded-3xl border border-primary-500/20">
          <span className="material-symbols-outlined text-4xl text-primary-400 animate-pulse">
            experiment
          </span>
      </div>
      <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-white">
          Chem<span className="text-primary-500">Info</span>
      </h1>
      <div className="h-1.5 w-24 bg-primary-600 mx-auto mt-4 rounded-full shadow-[0_0_15px_rgba(var(--color-primary-500),0.5)]"></div>
      <p className="mt-6 text-xl text-text-muted max-w-2xl mx-auto font-medium leading-relaxed">
        Yapay zeka ile moleküler dünyayı <span className="text-white border-b-2 border-primary-500/30">3 boyutlu keşfedin</span>, 
        analiz edin ve öğrenin.
      </p>
    </header>
  );
};

export default Header;