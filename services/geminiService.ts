import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AISuggestion } from "../types";

const apiKey = process.env.API_KEY || '';
// Note: In a real app, ensure the API key is handled securely. 
// This setup assumes the key is injected via environment variable or user selection flow if needed.

let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

const timerSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    durationSeconds: {
      type: Type.INTEGER,
      description: "The recommended duration in seconds for the requested task.",
    },
    label: {
      type: Type.STRING,
      description: "A short, catchy label for the timer (e.g., 'Boiling Egg').",
    },
    advice: {
      type: Type.STRING,
      description: "A very short, one-sentence tip regarding the task.",
    },
  },
  required: ["durationSeconds", "label", "advice"],
};

export const getTimerSuggestion = async (prompt: string): Promise<AISuggestion> => {
  if (!ai) {
    // If no API key is found in env, we might need to ask user. 
    // For this demo, we assume env or fail gracefully.
    if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
         ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    } else {
        throw new Error("Gemini API Key not configured.");
    }
  }

  try {
    const response = await ai!.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Set a timer for: ${prompt}. Be precise. If the user inputs relative time (e.g. 5 mins), use that. If they input a task (e.g. 'cook pasta'), estimate the time.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: timerSchema,
        temperature: 0.3, // Lower temperature for more deterministic numbers
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AISuggestion;
    }
    throw new Error("Empty response from AI");
  } catch (error) {
    console.error("Error fetching timer suggestion:", error);
    throw error;
  }
};
