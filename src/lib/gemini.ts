import { GoogleGenAI } from "@google/genai";

// Apni real API Key yahan quotation marks ke andar paste kar dein
const apiKey = "AQ.Ab8RN6JjFzFpH2pdq4d_bvxVfKrd6KVeEss-TB9cJJNjUwBvtg"; 

const ai = new GoogleGenAI(apiKey);

// 2. Models ke naam update kiye hain (Preview models kabhi kabhi fail ho jate hain)
export const models = {
  flash: 'gemini-1.5-flash',
  pro: 'gemini-1.5-pro'
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

    // 3. getGenerativeModel method use kiya hai jo latest SDK ka standard hai
    const model = ai.getGenerativeModel({ 
      model: models.flash,
      generationConfig: { responseMimeType: "application/json" }
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    if (!text) throw new Error("Empty AI response");
    
    const data = JSON.parse(text);
    if (!data.recommendations || data.recommendations.length === 0) throw new Error("No recommendations found");
    
    return data;
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    // FALLBACK MOCK DATA
    return {
      recommendations: [
        {
          name: profile.targetCountry === 'USA' ? "Stanford University" : "University of Toronto",
          country: profile.targetCountry,
          courses: [profile.targetDegree || "Computer Science", "Business Analytics"],
          ranking: "#1 Global",
          estimatedCost: "$50,000/year",
          roiScore: 95
        },
        {
          name: profile.targetCountry === 'USA' ? "MIT" : "University of British Columbia",
          country: profile.targetCountry,
          courses: [profile.targetDegree || "Engineering", "Data Science"],
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
  const model = ai.getGenerativeModel({ 
    model: models.flash,
    systemInstruction: "You are an expert Education Consultant and Financial Advisor for Indian students. Help them navigate university applications and education loans with practical, high-trust advice."
  });

  const chat = model.startChat({
    history: history.map(h => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.content }]
    }))
  });

  const result = await chat.sendMessage(query);
  return result.response.text();
}
