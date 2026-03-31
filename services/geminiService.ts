
import { GoogleGenAI } from "@google/genai";
import { 
  MODEL_TEXT, 
  URVASHI_SYSTEM_PROMPT, 
  EXTRACT_PROMPT_INSTRUCTION 
} from "../constants";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const extractPromptFromImage = async (base64Image: string): Promise<string> => {
  const ai = getAIClient();
  const imagePart = {
    inlineData: {
      mimeType: 'image/png',
      data: base64Image.split(',')[1] || base64Image,
    },
  };
  
  const response = await ai.models.generateContent({
    model: MODEL_TEXT,
    contents: {
      parts: [
        { text: EXTRACT_PROMPT_INSTRUCTION },
        imagePart
      ]
    },
    config: {
      systemInstruction: URVASHI_SYSTEM_PROMPT,
      temperature: 0.1 // High precision
    }
  });

  return response.text?.trim() || "Failed to generate prompt.";
};

export const getUrvashiReply = async (message: string): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: MODEL_TEXT,
    contents: `User uploaded a photo. Give a short, funny, 1-line reply in Hinglish about the result being ready.`,
    config: {
      systemInstruction: URVASHI_SYSTEM_PROMPT
    }
  });
  return response.text || "Lo yaar, prompt taiyaar hai!";
};
