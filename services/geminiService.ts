
import { GoogleGenAI } from "@google/genai";
import { GeminiResponse, ResponseType } from "../types";

// Note: process.env.API_KEY is automatically provided by the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// The system instruction defines the expected behavior and response format for the model.
// Fix: Triple backticks within the template literal must be escaped (\`\`\`) to prevent ending the string prematurely.
const systemInstruction = `Sen uzman bir kimya asistanısın. Sorguları analiz et ve JSON yanıt dön.

1. Bileşik Sorgusu: 'type' = "${ResponseType.CHEMICAL_INFO}". Data: name, formula, description (HTML formatında, önemli kelimeleri <strong> içine al), smiles (SMILES dizesi), pubchem_cid (sayı veya dize), properties (anahtar-değer çiftleri), safety_information (pictograms: {label: string, symbol: string} dizisi; summary: string), quiz (title: string, questions: {question: string, options: string[], correct_answer: string, explanation: string} dizisi).
   Piktogram sembolleri şunlardan biri olmalı: explosive, flammable, oxidizing, compressed_gas, corrosive, toxic, harmful, health_hazard, environmental_hazard.

2. Karşılaştırma: 'type' = "${ResponseType.COMPARISON}". Data: title, compounds (name, features: nesne), summary.

3. Genel Soru: 'type' = "${ResponseType.GENERAL}". Data: title, summary, sections (subtitle, content).

4. Kavram Haritası: 'type' = "${ResponseType.CONCEPT_MAP}". Data: centralConcept, relatedConcepts (topic, relationship).

5. Diğer: 'type' = "${ResponseType.UNKNOWN}", data.error = kullanıcıya yönelik hata mesajı.

Önemli Kurallar:
- Tüm metinler Türkçe olmalı.
- Yanıt SADECE saf JSON dizesi olmalı, markdown bloğu (\`\`\`json) içermemeli.
- Bileşik sorgularında mutlaka SMILES ve varsa PubChem CID ekle.
- Kimyasal formülleri (örn: H2O) açıklamalarda düzgün göster.`;

// Fetches and parses chemistry data from the Gemini API.
export const getAnalysisForQuery = async (query: string): Promise<GeminiResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Flash model is chosen for speed and cost-effectiveness in JSON tasks.
      contents: [{ parts: [{ text: query }] }],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Modelden boş yanıt döndü.");
    }

    try {
      // Clean possible markdown artifacts if any, though responseMimeType should handle it.
      const cleanedJson = jsonText.trim().replace(/^```json/, '').replace(/```$/, '');
      return JSON.parse(cleanedJson) as GeminiResponse;
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, "Raw Text:", jsonText);
      return {
        type: ResponseType.UNKNOWN,
        data: { error: "Yapay zeka yanıtı anlaşılamadı. Lütfen tekrar deneyin." },
      };
    }

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Handle specific Rpc/XHR errors gracefully to improve user experience.
    let errorMessage = "Yapay zeka şu an meşgul veya bir bağlantı hatası oluştu.";
    if (error.message?.includes("500") || error.message?.includes("Rpc failed")) {
      errorMessage = "Sunucu tarafında bir hata oluştu (RPC 500). Lütfen kısa süre sonra tekrar deneyin.";
    }

    return {
      type: ResponseType.UNKNOWN,
      data: { error: errorMessage },
    };
  }
};
