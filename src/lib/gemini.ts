import { GoogleGenAI } from "@google/genai";

const apiKey = "AIzaSyAvehuUtM8KBByoTQVSmBNXlza3RSjHEBE"; 
const genAI = new GoogleGenAI(apiKey);

export const models = { flash: 'gemini-1.5-flash' };

export async function getUniversityRecommendations(profile: any) {
  try {
    const model = genAI.getGenerativeModel({ model: models.flash });
    
    const prompt = `Student wants to study ${profile.course || 'Higher Education'}. 
    Suggest 5 universities. Return ONLY JSON. 
    Format: {"recommendations": [{"name": "string", "country": "string", "courses": [], "ranking": "string", "estimatedCost": "string", "roiScore": 90}], "careerOutlook": "string"}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Simple parse, no extra cleaning to avoid crash
    return JSON.parse(text);

  } catch (error) {
    console.error("Critical Error:", error);
    return { 
      recommendations: [{ name: "AI loading...", country: "-", courses: [], ranking: "-", estimatedCost: "-", roiScore: 0 }], 
      careerOutlook: "Please refresh the page." 
    };
  }
}

export async function getMentorResponse(history: any[], query: string) {
  try {
    const model = genAI.getGenerativeModel({ model: models.flash });
    const chat = model.startChat({
      history: history.map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content || h.text || "" }]
      }))
    });

    const result = await chat.sendMessage(query);
    return result.response.text();
  } catch (error) {
    return "I am currently offline. Please check your connection.";
  }
}
