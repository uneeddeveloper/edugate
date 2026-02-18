import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Safely initialize, though we rely on environment variable existing
const ai = new GoogleGenAI({ apiKey });

export const generateStudyHelp = async (subject: string, question: string): Promise<string> => {
  if (!apiKey) return "API Key not configured.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an expert academic tutor for university students. 
      The subject is: ${subject}.
      Please answer the following student question concisely and clearly in Indonesian language (Bahasa Indonesia).
      
      Question: ${question}`,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Low latency
      }
    });

    return response.text || "Maaf, saya tidak dapat menghasilkan jawaban saat ini.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Terjadi kesalahan saat menghubungi asisten AI.";
  }
};

export const summarizeForum = async (posts: string): Promise<string> => {
    if (!apiKey) return "API Key not configured.";
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Summarize the following forum discussions into key points (bullet points) in Indonesian.
            
            Discussions:
            ${posts}`,
        });
        return response.text || "Tidak ada ringkasan tersedia.";
    } catch (error) {
        return "Gagal meringkas forum.";
    }
}
