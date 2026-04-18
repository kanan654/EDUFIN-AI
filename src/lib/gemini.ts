import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const models = {
  flash: 'gemini-3-flash-preview',
  pro: 'gemini-3.1-pro-preview'
};

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

    const response = await ai.models.generateContent({
      model: models.flash,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty AI response");
    
    const data = JSON.parse(text);
    if (!data.recommendations || data.recommendations.length === 0) throw new Error("No recommendations found");
    
    return data;
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    // FALLBACK MOCK DATA for Prototype stability
    return {
      recommendations: [
        {
          name: profile.targetCountry === 'USA' ? "Stanford University" : "University of Toronto",
          country: profile.targetCountry,
          courses: [profile.targetDegree, "Business Analytics"],
          ranking: "#1 Global",
          estimatedCost: "$50,000/year",
          roiScore: 95
        },
        {
          name: profile.targetCountry === 'USA' ? "MIT" : "University of British Columbia",
          country: profile.targetCountry,
          courses: [profile.targetDegree, "Data Science"],
          ranking: "#3 Global",
          estimatedCost: "$48,000/year",
          roiScore: 92
        }
      ],
      careerOutlook: "High demand in global markets for your selected degree."
    };
  }
}

export async function getMentorResponse(history: any[], query: string) {
  const chat = ai.chats.create({
    model: models.flash,
    config: {
      systemInstruction: "You are an expert Education Consultant and Financial Advisor for Indian students. Help them navigate university applications and education loans with practical, high-trust advice."
    }
  });

  const response = await chat.sendMessage({ message: query });
  return response.text;
}
