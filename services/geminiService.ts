import { GoogleGenAI } from "@google/genai";
import { AppConfig, REASONING_MODEL } from "../types";

// NOTA: Siguiendo las instrucciones del sistema, la API Key se toma exclusivamente de process.env.API_KEY
// El usuario no debe ingresarla manualmente en la UI por seguridad y conformidad.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStreamResponse = async (
  history: { role: string; parts: { text: string }[] }[],
  lastUserMessage: string,
  context: string,
  config: AppConfig,
  onChunk: (text: string) => void
): Promise<string> => {
  try {
    // Preparar el mensaje final combinando contexto y pregunta
    const finalPrompt = context 
      ? `${context}\n\nPREGUNTA DEL USUARIO: ${lastUserMessage}`
      : lastUserMessage;

    // Configuración dinámica
    const generationConfig: any = {
      systemInstruction: config.systemInstructions,
    };

    // Configurar Thinking Mode si el modelo es Pro y hay presupuesto
    if (config.model === REASONING_MODEL && config.thinkingBudget > 0) {
      generationConfig.thinkingConfig = { thinkingBudget: config.thinkingBudget };
    }

    // Configurar Grounding si está activo (Google Search)
    if (config.useSearchGrounding) {
        generationConfig.tools = [{ googleSearch: {} }];
    }

    const modelId = config.model;

    // Usamos generateContentStream para un flujo "stateless" simplificado o 
    // podríamos usar chats.create. Para RAG, suele ser mejor inyectar el contexto 
    // fresco en cada turno o mantener el historial manualmente.
    // Aquí convertimos el historial simple al formato de contenido.
    
    // Transformar historial previo para enviarlo (si se desea mantener contexto de conversación)
    // Nota: El contexto RAG se envía en el último mensaje para ahorrar tokens de historial repetido.
    
    const responseStream = await ai.models.generateContentStream({
      model: modelId,
      contents: [
        // Historial previo (opcional, aquí lo simplificamos enviando solo el prompt actual + contexto para RAG puro)
        // Para un chat real, mapearíamos 'history'.
        {
           role: 'user',
           parts: [{ text: finalPrompt }]
        }
      ],
      config: generationConfig
    });

    let fullText = "";

    for await (const chunk of responseStream) {
      const chunkText = chunk.text;
      if (chunkText) {
        fullText += chunkText;
        onChunk(fullText);
      }
    }

    return fullText;

  } catch (error) {
    console.error("Error en Gemini Service:", error);
    throw error;
  }
};

export const checkApiKey = (): boolean => {
    return !!process.env.API_KEY;
}