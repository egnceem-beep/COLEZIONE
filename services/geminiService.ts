
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function searchCarImage(modello: string, colore: string, marcaMacchina: string): Promise<string> {
  // Busca específica pela versão REAL do carro para referência
  const prompt = `Trova un'immagine professionale dell'auto reale originale (versione stradale o da corsa, NON un modellino) del modello "${modello}" ${marcaMacchina ? `di marca ${marcaMacchina}` : ''} di colore "${colore}". Restituisci l'URL diretto dell'immagine più bella e pulita.`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks && groundingChunks.length > 0) {
      for (const chunk of groundingChunks) {
        if (chunk.web?.uri && (chunk.web.uri.match(/\.(jpg|jpeg|png|webp)/i))) {
          return chunk.web.uri;
        }
      }
      if (groundingChunks[0].web?.uri) return groundingChunks[0].web.uri;
    }

    return `https://picsum.photos/seed/${encodeURIComponent(modello + colore)}/800/600`;
  } catch (error) {
    console.error("Errore nella ricerca immagine:", error);
    return `https://picsum.photos/seed/${encodeURIComponent(modello)}/800/600`;
  }
}
