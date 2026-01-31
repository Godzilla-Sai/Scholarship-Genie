
import { GoogleGenAI } from "@google/genai";
import { UserProfile, AnalysisResult, Scholarship } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeScholarshipProfile = async (profile: UserProfile): Promise<AnalysisResult> => {
  const prompt = `
    Analyze this student's profile for scholarship eligibility and find specific scholarships currently available.
    
    Student Profile:
    - Name: ${profile.fullName}
    - GPA: ${profile.gpa}
    - Major/Field of Study: ${profile.major}
    - Education Level: ${profile.educationLevel}
    - Location: ${profile.location}
    - Financial Need: ${profile.financialNeed}
    - Extracurriculars: ${profile.extracurriculars}
    - Personal Background: ${profile.background}

    Tasks:
    1. Calculate a general eligibility score (0-100) based on their GPA and profile strength.
    2. Provide a 2-3 sentence summary of their prospects.
    3. List 3-4 specific pieces of advice for improving their applications.
    4. Use Google Search to find real, active scholarships matching their profile (Major, Location, Background).
    
    Format the output as clear sections.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No analysis available.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Parse the text to extract structured data
    // In a real app, we'd use responseSchema, but since we are using googleSearch, 
    // we can't use responseSchema. We will manually parse or use a secondary call.
    // For this prototype, we'll use regex/parsing for the text and mapping for chunks.

    const scholarships: Scholarship[] = chunks
      .filter(chunk => chunk.web && chunk.web.uri)
      .map(chunk => ({
        title: chunk.web.title || "Found Scholarship",
        description: "Matched based on your academic and personal profile.",
        url: chunk.web.uri || "#",
        amount: "Varies",
        deadline: "Check website"
      }))
      .slice(0, 5);

    // Simple parsing for eligibility score
    const scoreMatch = text.match(/(\d+)\/100/);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 75;

    return {
      summary: text.split('\n').filter(l => l.length > 20)[0] || "Analysis complete.",
      eligibilityScore: score,
      recommendations: text.split('\n').filter(l => l.includes('•') || l.match(/^\d\./)).slice(0, 4),
      scholarships
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
