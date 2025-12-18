
import { GoogleGenAI } from "@google/genai";
import { UserProfile } from "../types";

export const getHydrationAdvice = async (profile: UserProfile, currentIntake: number) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    As a professional health and hydration coach, provide a brief, personalized tip for the user.
    
    User Profile:
    - Age: ${profile.age}
    - Gender: ${profile.gender}
    - Weight: ${profile.weight}kg
    - Height: ${profile.height}cm
    - Activity Level: ${profile.activityLevel}
    - Daily Hydration Goal: ${profile.dailyGoal}ml
    - Current Intake Today: ${currentIntake}ml
    
    Current Progress: ${Math.round((currentIntake / profile.dailyGoal) * 100)}%
    
    Provide a concise (max 2 sentences) encouraging tip or health fact relevant to their current status. 
    Focus on the benefits of water for their specific activity level or body metrics.
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
