import React from 'react';
import { GeminiResponse, ResponseType, ChemicalInfo, ComparisonInfo, GeneralAnswer } from '../types';
import ChemicalInfoDisplay from './ChemicalInfoDisplay';
import ComparisonDisplay from './ComparisonDisplay';
import GeneralAnswerDisplay from './GeneralAnswerDisplay';
import ErrorMessage from './ErrorMessage';

interface ResponseDisplayProps {
  response: GeminiResponse;
}

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ response }) => {
  
  switch (response.type) {
    case ResponseType.CHEMICAL_INFO:
      return <ChemicalInfoDisplay data={response.data as ChemicalInfo} />;
    case ResponseType.COMPARISON:
      return <ComparisonDisplay data={response.data as ComparisonInfo} />;
    case ResponseType.GENERAL:
      return <GeneralAnswerDisplay data={response.data as GeneralAnswer} />;
    case ResponseType.UNKNOWN:
        const errorData = response.data as { error: string };
        return <ErrorMessage message={errorData.error || "Bilinmeyen bir yanıt türü alındı."} />
    default:
      // Bu derleme zamanı kontrolü, bir sözdizimi hatasına neden olduğu için kaldırıldı.
      // Aşağıdaki yedek mesaj, çalışma zamanında işlenmeyen yanıt türlerini yakalayacaktır.
      return <ErrorMessage message={`İşlenemeyen bir yanıt türüyle karşılaşıldı.`} />;
  }
};

export default ResponseDisplay;