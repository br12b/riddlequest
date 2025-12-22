import { GoogleGenAI, Type, Schema } from "@google/genai";
import { RiddleData, ValidationResponse, LanguageCode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const riddleSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    question: {
      type: Type.STRING,
      description: "A very short, abstract poetic hint (max 10 words). NOT a direct question.",
    },
    visualConfig: {
      type: Type.OBJECT,
      properties: {
        colors: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "3 Hex color codes representing the concept's mood.",
        },
        animationSpeed: {
          type: Type.STRING,
          enum: ["slow", "normal", "fast", "chaos"],
          description: "The speed of the concept (e.g., Fire=chaos, Ocean=slow)."
        },
        shapeStyle: {
          type: Type.STRING,
          enum: ["rounded", "sharp", "liquid"],
          description: "The physical feeling of the concept."
        },
        complexity: {
          type: Type.STRING,
          enum: ["minimal", "complex"]
        }
      },
      required: ["colors", "animationSpeed", "shapeStyle", "complexity"]
    },
    difficulty: {
      type: Type.STRING,
      enum: ["Easy", "Medium", "Hard"],
    },
    answer: {
      type: Type.STRING,
      description: "The correct answer (single noun).",
    }
  },
  required: ["question", "visualConfig", "difficulty", "answer"],
};

export const generateDailyRiddle = async (lang: LanguageCode): Promise<RiddleData> => {
  try {
    const languageNames = {
      en: "English",
      fr: "French",
      es: "Spanish",
      tr: "Turkish"
    };

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a "Cyber-Synesthesia" puzzle in ${languageNames[lang]}.
      
      Goal: I need you to think of a concrete object or concept (e.g., "Thunder", "Cactus", "Internet", "Ghost").
      Do NOT tell the user what it is directly.
      Instead, define how it "looks" and "feels" using the visualConfig parameters.
      
      Visual Config Logic:
      - Colors: Pick 3 hex codes that perfectly capture the vibe.
      - Speed: Does it move fast or slow?
      - Shape: Is it sharp (danger/tech), liquid (water/ghost), or rounded (organic)?
      
      The 'question' field should NOT be a riddle. It should be a single, cryptic poetic line describing the *feeling* of the object in ${languageNames[lang]}.
      
      Example for "Volcano":
      Colors: ["#FF4500", "#330000", "#FFD700"]
      Speed: "chaos"
      Shape: "liquid"
      Question (TR): "Toprak öfkelendiğinde kustuğu kan."

      Output JSON keys in English, values adapted to ${languageNames[lang]}.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: riddleSchema,
        systemInstruction: "You are an abstract artist AI. You communicate through colors and cryptic poetry.",
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data returned from Gemini");

    const data = JSON.parse(jsonText);
    
    return {
      id: new Date().toISOString().split('T')[0] + `-${lang}-${Math.random()}`,
      question: data.question,
      visualConfig: data.visualConfig,
      difficulty: data.difficulty,
    };
  } catch (error) {
    console.error("Gemini Generate Error:", error);
    // Fallback: A "Night" theme
    return {
      id: "fallback-visual",
      question: lang === 'tr' ? "Sessizlik siyah bir pelerin giyer." : "Silence wears a black cloak.",
      visualConfig: {
        colors: ["#0f0b15", "#1a1a2e", "#ffffff"],
        animationSpeed: "slow",
        shapeStyle: "liquid",
        complexity: "minimal"
      },
      difficulty: "Easy",
    };
  }
};

export const validateAnswerWithAI = async (riddleQuestion: string, userAnswer: string, lang: LanguageCode): Promise<ValidationResponse> => {
  try {
    const languageNames = {
      en: "English",
      fr: "French",
      es: "Spanish",
      tr: "Turkish"
    };

    const prompt = `
      Abstract Hint (in ${languageNames[lang]}): "${riddleQuestion}"
      User's Guess: "${userAnswer}"
      
      Is the user's guess the correct object concept?
      Context: The user is looking at an abstract art piece representing the concept.
      
      CRITICAL VALIDATION RULES:
      1. IGNORE CASE: "Apple" = "apple" = "APPLE".
      2. IGNORE ACCENTS: "Kâğıt" = "kagit".
      3. ALLOW SYNONYMS: If the answer is "Ocean" and user says "Sea", it is CORRECT.
      4. IGNORE MINOR TYPOS: 1-2 letter mistakes are acceptable.
      
      Respond with JSON.
      The 'explanation' should be atmospheric and in ${languageNames[lang]}.
    `;

    const validationSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        isCorrect: { type: Type.BOOLEAN },
        explanation: { type: Type.STRING }
      },
      required: ["isCorrect", "explanation"]
    };

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: validationSchema,
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No validation data returned");

    return JSON.parse(jsonText) as ValidationResponse;

  } catch (error) {
    console.error("Gemini Validation Error:", error);
    return {
      isCorrect: false,
      explanation: "Signal Lost."
    };
  }
};