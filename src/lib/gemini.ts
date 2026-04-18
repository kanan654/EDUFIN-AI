import { GoogleGenAI } from "@google/genai";

// 1. API Key Initialization
const apiKey = "AIzaSyAvehuUtM8KBByoTQVSmBNXlza3RSjHEBE"; 
const ai = new GoogleGenAI(apiKey);

export const models = {
  flash: 'gemini-1.5-flash',
  pro: 'gemini-1.5-pro'
};

// 2. University Recommendations Function
export async function getUniversityRecommendations(profile: any) {
  try {
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

    const model = ai.getGenerativeModel({ 
      model: models.flash,
      generationConfig: { responseMimeType: "application/json" }
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    if (!text) throw new Error("Empty AI response");
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Recommendation Error:", error);
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

// 3. Mentor Response Function (Fixed History Logic)
export async function getMentorResponse(history: any[], query: string) {
  try {
    const model = ai.getGenerativeModel({ 
      model: models.flash,
      systemInstruction: "You are an expert Education Consultant and Financial Advisor for Indian students. Help them navigate university applications and education loans with practical, high-trust advice."
    });

    // Gemini expects history in a specific role/parts format
    const chat = model.startChat({
      history: history.length > 0 ? history.map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content || h.text || "" }]
      })) : []
    });

    const result = await chat.sendMessage(query);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Mentor AI Error:", error);
    return "I'm sorry, I'm having trouble connecting to my brain right now. Please try asking again in a moment!";
  }
}
