import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="bg-danger-bg/50 backdrop-blur-lg p-4 rounded-xl shadow-lg ring-1 ring-danger-fg/30 my-4 flex items-start sm:items-center animate-fade-in-up" role="alert">
        <span className="material-symbols-outlined text-danger-fg mr-3 mt-1 sm:mt-0">error</span>
        <div>
            <strong className="font-bold text-danger-fg">Bir Hata Oluştu</strong>
            <span className="block text-danger-fg/90 text-sm">
                {message}. Lütfen tekrar deneyin veya farklı bir sorgu kullanın.
            </span>
        </div>
    </div>
  );
};

export default ErrorMessage;