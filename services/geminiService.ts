import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AIAnalysis } from "../types";

const ANALYSIS_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    sentimentScore: {
      type: Type.NUMBER,
      description: "A score from 0 to 100 indicating the overall sentiment of the call (0=negative, 100=positive).",
    },
    summary: {
      type: Type.STRING,
      description: "A concise summary of the conversation.",
    },
    missedEmailOpportunity: {
      type: Type.BOOLEAN,
      description: "Whether the agent missed an opportunity to send an email or promised to send one.",
    },
    emailBody: {
      type: Type.STRING,
      description: "Draft of the email if missedEmailOpportunity is true. Otherwise empty string.",
    },
    keywords: {
      type: Type.ARRAY,
      description: "List of key topics/words for a word cloud.",
      items: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          value: { type: Type.NUMBER, description: "Importance weight 1-100" }
        }
      }
    }
  },
  required: ["sentimentScore", "summary", "missedEmailOpportunity", "keywords"]
};

export const analyzeCallTranscript = async (transcript: string): Promise<AIAnalysis> => {
  if (!process.env.API_KEY) {
    throw new Error("Missing Gemini API Key");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze this call transcript for a business dashboard. Return JSON data adhering to the schema.
      
      Transcript:
      "${transcript}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA,
        systemInstruction: "You are an expert AI analyst for a Voice Intelligence platform. Analyze calls for sentiment, key topics, and action items."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const data = JSON.parse(text) as AIAnalysis;
    return data;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Fallback for demo purposes if API fails or key is missing in some envs
    return {
      sentimentScore: 50,
      summary: "Analysis failed. Please check API Key.",
      missedEmailOpportunity: false,
      keywords: [{ text: "Error", value: 100 }]
    };
  }
};