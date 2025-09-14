import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="bg-red-900/50 backdrop-blur-lg p-4 rounded-xl shadow-lg ring-1 ring-red-500/30 my-4 flex items-start sm:items-center animate-fade-in-up" role="alert">
        <span className="material-symbols-outlined text-red-400 mr-3 mt-1 sm:mt-0">error</span>
        <div>
            <strong className="font-bold text-red-300">Bir Hata Oluştu</strong>
            <span className="block text-red-300/90 text-sm">
                {message}. Lütfen tekrar deneyin veya farklı bir sorgu kullanın.
            </span>
        </div>
    </div>
  );
};

export default ErrorMessage;