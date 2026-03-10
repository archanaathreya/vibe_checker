"use server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getVibeSpots(vibe: string, lat?: number, lng?: number) {
  // Use the 2026 stable workhorse
  const modelName = "gemini-2.5-flash"; 

  const locationContext = (lat && lng) 
    ? `I am currently at Latitude: ${lat}, Longitude: ${lng}.` 
    : "I am in Bengaluru, India."; // Default fallback

  const prompt = `
    ${locationContext}
    Vibe: "${vibe}".
    Using Google Maps, find 3 real spots within 3km. 
    Provide: Name, Address, and why it fits.
  `;

  try {
    const result = await ai.models.generateContent({
      model: modelName,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        tools: [{ googleMaps: {} }] 
      }
    });

    // --- THE FIX STARTS HERE ---
    // In the new SDK, we check for 'candidates' first to avoid 'undefined' errors
    const candidate = result.candidates?.[0];
    
    if (!candidate || !candidate.content || !candidate.content.parts) {
      throw new Error("No response parts found from AI");
    }

    // Combine all text parts (sometimes AI returns multiple parts)
    const responseText = candidate.content.parts
      .map(part => part.text)
      .filter(text => text !== undefined)
      .join("\n");

    return responseText || "I found some spots, but couldn't generate a description. Try a different vibe!";
    
  } catch (error) {
    console.error("AI Search Error:", error);
    return "AI Error: The search failed. Ensure your API Key is valid in Vercel/Env.";
  }
}