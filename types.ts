export type HistoryItem = string;

export enum ResponseType {
  CHEMICAL_INFO = "chemical_info",
  COMPARISON = "comparison",
  GENERAL = "general_answer",
  CONCEPT_MAP = "concept_map",
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
  smiles?: string;
  pubchem_cid?: string | number;
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
    name:string;
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

export interface ConceptMapInfo {
    centralConcept: string;
    relatedConcepts: {
        topic: string;
        relationship: string;
    }[];
}

export type GeminiResponseData = ChemicalInfo | ComparisonInfo | GeneralAnswer | ConceptMapInfo | { error: string };

export interface GeminiResponse {
  type: ResponseType;
  data: GeminiResponseData;
}