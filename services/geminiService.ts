
import { GoogleGenAI } from "@google/genai";
import { UserProfile } from "../types";

export const getHydrationAdvice = async (profile: UserProfile, currentIntake: number) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    As a professional health and hydration coach, provide a brief, personalized tip for the user based on their specific lifestyle metrics.
    
    User Profile:
    - Age: ${profile.age}
    - Gender: ${profile.gender}
    - Weight: ${profile.weight}${profile.weightUnit}
    - Climate: ${profile.climate}
    - Exercise: ${profile.exerciseDaysPerWeek} days/week, ${profile.exerciseMinutesPerSession} mins per session
    - Caffeine: ${profile.caffeineCups} cups daily
    - Health: ${profile.hasMedicalCondition ? 'Has medical conditions' : 'No specific medical conditions reported'}
    - Daily Hydration Goal: ${profile.dailyGoal}ml
    - Current Intake Today: ${currentIntake}ml
    
    Current Progress: ${Math.round((currentIntake / profile.dailyGoal) * 100)}%
    
    Provide a concise (max 2 sentences) encouraging tip. 
    Acknowledge their climate or exercise habits. 
    If they have medical conditions, add a friendly reminder to follow their doctor's guidance.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Keep drinking water to stay energized throughout your day!";
  }
};

export const editImageWithAI = async (base64Image: string, prompt: string, mimeType: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1],
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Editing Error:", error);
    throw error;
  }
};
