// FIX: Removed unused 'Type' import from "@google/genai" to resolve potential type conflicts that were causing compilation errors.
import { GoogleGenAI } from "@google/genai";
import { GeminiResponse, ResponseType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const systemInstruction = `Sen dünya standartlarında bir kimya uzmanı asistansın. Görevin, kullanıcının sorgusunu analiz etmek ve yapılandırılmış bir JSON yanıtı sağlamaktır. Sorguya dayanarak, yanıt türünü belirlemeli ve çıktını buna göre yapılandırmalısın. En üst düzey JSON nesnesi bir 'type' ve bir 'data' özelliğine sahip olmalıdır.

1.  **Eğer sorgu tek bir kimyasal bileşik hakkındaysa (örneğin, "Su", "H2O", "Aspirin"), 'type'ı "${ResponseType.CHEMICAL_INFO}" olarak ayarla.**
    'data' nesnesi şunları içermelidir:
    - 'name': string (Kimyasalın yaygın adı).
    - 'formula': string (Kimyasal formülü).
    - 'description': string (Kısa, ilgi çekici bir açıklama; <p>, <strong>, <ul>, <li> gibi basit HTML etiketleri kullanılabilir).
    - 'properties': object (Önemli kimyasal/fiziksel özelliklerin bir anahtar-değer haritası. Örneğin: {"Molar Kütle": "18.015 g/mol"}).
    - 'safety_information': object ('pictograms' dizisi ve bir 'summary' dizesi içerir. 'pictograms', {label: string, symbol: string} nesnelerinden oluşan bir dizidir. 'symbol' için şunlardan birini kullan: 'explosive', 'flammable', 'oxidizing', 'compressed_gas', 'corrosive', 'toxic', 'harmful', 'health_hazard', 'environmental_hazard').
    - 'quiz': object|null ('title' ve bir 'questions' dizisi (her biri 'question', 'options', 'correct_answer', 'explanation' içerir) olan küçük bir sınav veya uygun değilse null).

2.  **Eğer sorgu bir karşılaştırma ise (örneğin, "alkanlar ve alkenleri karşılaştır", "etanol vs metanol"), 'type'ı "${ResponseType.COMPARISON}" olarak ayarla.**
    'data' nesnesi şunları içermelidir:
    - 'title': string (Karşılaştırma için bir başlık).
    - 'compounds': array (Her biri karşılaştırma noktaları için 'name' ve 'features' nesnesi içeren bir nesne dizisi).
    - 'summary': string (Basit HTML ile biçimlendirilmiş sonuç özeti).

3.  **Eğer sorgu genel bir kimya sorusu ise (örneğin, "oksidasyon nedir?", "kovalent bağları açıkla"), 'type'ı "${ResponseType.GENERAL}" olarak ayarla.**
    'data' nesnesi şunları içermelidir:
    - 'title': string (Konu için bir başlık).
    - 'summary': string (Cevabın kısa bir özeti, basit HTML ile biçimlendirilmiş).
    - 'sections': array (Her biri ayrıntılı açıklama için 'subtitle' ve 'content' içeren bir nesne dizisi, basit HTML ile biçimlendirilmiş).

4.  **Eğer sorgu belirsiz, anlamsız veya kimya alanı dışındaysa, 'type'ı "${ResponseType.UNKNOWN}" olarak ayarla.**
    'data' nesnesi, kullanıcı dostu bir açıklama içeren bir 'error' alanı içermelidir.

- **ÇOK ÖNEMLİ: Tüm yanıtın tek ve geçerli bir JSON nesnesi olmalıdır ve başka hiçbir şey içermemelidir.** Yanıtı markdown \`\`\`json \`\`\` gibi işaretçiler veya başka bir metinle sarma.
- **TÜM METİN İÇERİKLERİ (açıklamalar, özellik adları, sınav soruları vb.) KESİNLİKLE TÜRKÇE OLMALIDIR.**
`;

export const getAnalysisForQuery = async (query: string): Promise<GeminiResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Aşağıdaki kimya sorgusunu analiz et ve bir JSON yanıtı oluştur: "${query}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    // FIX: The error "response.text is not a function" confirms that `response.text` is a property, not a method.
    // The code is corrected to access the response text as a property.
    const jsonText = response.text;
    
    if (!jsonText) {
        throw new Error("API boş bir yanıt döndürdü.");
    }

    const parsedResponse = JSON.parse(jsonText.trim());

    if (!parsedResponse.type || !parsedResponse.data) {
        throw new Error("API'den geçersiz JSON yapısı alındı.");
    }

    return parsedResponse as GeminiResponse;

  } catch (error) {
    console.error("Gemini yanıtı alınırken veya işlenirken hata oluştu:", error);
    let errorMessage = "AI ile iletişim kurulurken bir hata oluştu. Yanıt hatalı biçimlendirilmiş olabilir.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return {
      type: ResponseType.UNKNOWN,
      data: { error: `API Hatası: ${errorMessage}` },
    };
  }
};