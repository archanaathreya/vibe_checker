// app/actions.ts
"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function getVibeSpots(city: string, vibe: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    I am in ${city}. My current vibe is: ${vibe}.
    Give me exactly 3 specific places to visit right now.
    For each place, provide:
    1. Name
    2. A 1-sentence description.
    3. A 'Local Secret' (something not usually in guidebooks).
    Keep it concise and travel-friendly.
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
}