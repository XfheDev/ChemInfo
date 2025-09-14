// FIX: Define all necessary types for the application.
export type HistoryItem = string;

export enum ResponseType {
  CHEMICAL_INFO = "chemical_info",
  COMPARISON = "comparison",
  GENERAL = "general_answer",
  UNKNOWN = "unknown",
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export interface ChemicalInfo {
  name: string;
  formula: string;
  description: string;
  properties: Record<string, string>;
  safety_information: {
    pictograms: {
        label: string;
        symbol: string;
    }[];
    summary: string;
  };
  quiz: {
    title: string;
    questions: QuizQuestion[];
  } | null;
}

export interface ComparisonInfo {
  title: string;
  compounds: {
    name: string;
    features: Record<string, string>;
  }[];
  summary: string;
}

export interface GeneralAnswer {
  title: string;
  summary: string;
  sections: {
    subtitle: string;
    content: string;
  }[];
}

export type GeminiResponseData = ChemicalInfo | ComparisonInfo | GeneralAnswer | { error: string };

export interface GeminiResponse {
  type: ResponseType;
  data: GeminiResponseData;
}
