import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";

// 1. New connection logic with Safety Settings disabled
const apiKey = "AIzaSyAvehuUtM8KBByoTQVSmBNXlza3RSjHEBE"; 
const genAI = new GoogleGenAI(apiKey);

// Safety settings taaki AI "No" na bole
const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

export const models = { flash: 'gemini-1.5-flash' };

export async function getUniversityRecommendations(profile: any) {
  try {
    const model = genAI.getGenerativeModel({ 
        model: models.flash,
        safetySettings 
    });

    const prompt = `Student Profile: ${JSON.stringify(profile)}. 
    Give 5 university matches for ${profile.course || 'Higher Education'} in ${profile.country || 'any country'}. 
    Return ONLY pure JSON. No markdown. No text. 
    Format: {"recommendations": [{"name": "...", "country": "...", "courses": [], "ranking": "...", "estimatedCost": "...", "roiScore": 90}], "careerOutlook": "..."}`;
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().replace(/```json|```/g, "").trim(); 
    return JSON.parse(responseText);

  } catch (error) {
    console.error("Critical Error:", error);
    // Fake data hata diya, ab seedha error dikhayega agar fail hua toh
    return { recommendations: [], careerOutlook: "AI Connection failed. Please check Console (F12)." };
  }
}

export async function getMentorResponse(history: any[], query: string) {
  try {
    const model = genAI.getGenerativeModel({ 
        model: models.flash,
        safetySettings 
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
    console.error("Chat Error:", error);
    return "I'm having trouble connecting. Please check your API Key and Network.";
  }
}
