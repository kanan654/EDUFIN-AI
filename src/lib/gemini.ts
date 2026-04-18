import { GoogleGenAI } from "@google/genai";

// 1. Vite/Browser mein 'import.meta.env' use hota hai 'process.env' nahi
// Make sure Vercel mein variable ka naam 'VITE_GEMINI_API_KEY' rakha ho
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenAI(apiKey);

export const models = {
  // Preview models kabhi-kabhi unstable hote hain, stable use karte hain
  flash: 'gemini-1.5-flash',
  pro: 'gemini-1.5-pro'
};

export async function getUniversityRecommendations(profile: any) {
  try {
    if (!apiKey) throw new Error("API Key missing in Environment Variables");

    const model = genAI.getGenerativeModel({ 
      model: models.flash,
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `Based on this student profile, recommend 5 top universities and specific courses that fit their goals. 
    Student Profile: ${JSON.stringify(profile)}
    
    Return ONLY a JSON object exactly like this:
    {
      "recommendations": [
        {
          "name": "University Name",
          "country": "USA",
          "courses": ["Data Science", "AI"],
          "ranking": "#15 Global",
          "estimatedCost": "$45,000/year",
          "roiScore": 88
        }
      ],
      "careerOutlook": "Strong growth in tech sectors..."
    }`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    // Fallback data agar AI fail ho jaye
    return {
      recommendations: [
        {
          name: "Stanford University",
          country: "USA",
          courses: ["Computer Science"],
          ranking: "#1 Global",
          estimatedCost: "$50,000/year",
          roiScore: 95
        }
      ],
      careerOutlook: "High demand in global markets."
    };
  }
}

export async function getMentorResponse(history: any[], query: string) {
  try {
    if (!apiKey) throw new Error("API Key missing");

    const model = genAI.getGenerativeModel({ 
      model: models.flash,
      systemInstruction: "You are an expert Education Consultant."
    });

    const chat = model.startChat({
      history: history.map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content || h.text || "" }]
      }))
    });

    const result = await chat.sendMessage(query);
    return result.response.text();
  } catch (error) {
    console.error("Mentor AI Error:", error);
    return "I'm having trouble connecting. Please check if VITE_GEMINI_API_KEY is set in Vercel.";
  }
}
