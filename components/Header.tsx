import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-8 sm:mb-12 animate-fade-in-up">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-sky-500">
          ChemInfo
        </span>
      </h1>
      <p className="mt-3 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
        Kimyasal bileşikler ve genel kimya soruları hakkında anında, doğru bilgi alın.
      </p>
    </header>
  );
};

export default Header;