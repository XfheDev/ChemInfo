import React from 'react';

interface FormattedContentProps {
  content: string;
}

// Bu yardımcı bileşen, API'den gelen ve HTML içerebilen metinleri
// güvenli bir şekilde işlemek için kullanılır.
const FormattedContent: React.FC<FormattedContentProps> = ({ content }) => {
  if (!content) return null;

  // Tailwind CSS'in 'prose' eklentisi, render edilen HTML'e
  // otomatik olarak güzel stiller uygular.
  return (
    <div
      className="prose prose-invert max-w-none prose-p:text-gray-300 prose-p:my-2 prose-strong:text-white prose-ul:list-disc prose-ul:ml-5 prose-li:text-gray-300 prose-li:my-1"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default FormattedContent;
