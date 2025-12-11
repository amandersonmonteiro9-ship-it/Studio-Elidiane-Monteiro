import { GoogleGenAI } from "@google/genai";
import { SERVICES } from "../constants";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getBeautyConsultation = async (userQuery: string): Promise<string> => {
  if (!apiKey) {
    return "Desculpe, o serviço de consultoria virtual está indisponível no momento (Chave API não configurada).";
  }

  const serviceList = SERVICES.map(s => `- ${s.name} (R$ ${s.price})`).join('\n');

  const prompt = `
    Você é a assistente virtual especialista em beleza do "Studio Elidiane Monteiro".
    Sua missão é ser gentil, sofisticada e acolhedora.
    A usuária disse: "${userQuery}"

    Com base nisso, sugira 1 a 3 serviços da lista abaixo que melhor se adequam ao desejo dela.
    
    Lista de Serviços:
    ${serviceList}

    Responda em português, de forma curta (máximo 1 parágrafo), convidativa e termine sugerindo agendar um horário.
    Não invente serviços que não estão na lista.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Não consegui entender, pode repetir querida?";
  } catch (error) {
    console.error("Erro na consultoria IA:", error);
    return "Tive um pequeno problema técnico, mas estou aqui para ajudar você a escolher o melhor serviço presencialmente!";
  }
};
