
import { GoogleGenAI } from "@google/genai";
import { UserProfile } from "../types";

export const getHydrationAdvice = async (profile: UserProfile, currentIntake: number) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `As a professional health coach, provide a brief (max 2 sentences), encouraging hydration tip based on: Climate: ${profile.climate}, Exercise: ${profile.exerciseMinutesPerSession} min, Caffeine: ${profile.caffeineCups} cups, Progress: ${Math.round((currentIntake / profile.dailyGoal) * 100)}%. Keep it focused and professional.`;
  try {
    const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
    return response.text;
  } catch (error) {
    return "Staying hydrated is essential for peak performance. Keep tracking your intake!";
  }
};

export const editImageWithAI = async (base64Image: string, prompt: string, mimeType: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Image.split(',')[1], mimeType } },
          { text: prompt }
        ]
      }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    return null;
  } catch (error) {
    throw error;
  }
};
