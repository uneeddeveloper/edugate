import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

// Safely initialize only when needed
let ai: GoogleGenAI | null = null;

const getAI = () => {
  if (!ai && apiKey) {
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

export const generateStudyHelp = async (
  subject: string,
  question: string,
): Promise<string> => {
  if (!apiKey) return "API Key tidak dikonfigurasi.";

  try {
    const aiInstance = getAI();
    if (!aiInstance) return "Asisten AI tidak dapat diinisialisasi.";

    const response = await aiInstance.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an expert academic tutor for university students. 
      The subject is: ${subject}.
      Please answer the following student question concisely and clearly in Indonesian language (Bahasa Indonesia).
      
      Question: ${question}`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }, // Low latency
      },
    });

    return (
      response.text || "Maaf, saya tidak dapat menghasilkan jawaban saat ini."
    );
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Terjadi kesalahan saat menghubungi asisten AI.";
  }
};

export const summarizeForum = async (posts: string): Promise<string> => {
  if (!apiKey) return "API Key tidak dikonfigurasi.";

  try {
    const aiInstance = getAI();
    if (!aiInstance) return "Asisten AI tidak dapat diinisialisasi.";

    const response = await aiInstance.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize the following forum discussions into key points (bullet points) in Indonesian.
            
            Discussions:
            ${posts}`,
    });
    return response.text || "Tidak ada ringkasan tersedia.";
  } catch (error) {
    console.error("Forum summarization error:", error);
    return "Gagal meringkas forum.";
  }
};
