import { GoogleGenAI } from "@google/genai";

// Kanan, yahan quotes ke andar apni real key bina kisi extra space ke daalna
const apiKey = "AIzaSyCiknw1CvPT09T94ZzIiHGrjIZUi4T6CP4"; 
console.log("Kanan, Key Load Ho Gayi Hai!", apiKey.substring(0, 5));

// Is line ko dhyan se dekhiye, maine syntax update kiya hai
const ai = new GoogleGenAI({ apiKey: apiKey });

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

    const model = ai.getGenerativeModel({ 
      model: models.flash,
      generationConfig: { responseMimeType: "application/json" }
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    if (!text) throw new Error("Empty AI response");
    
    const data = JSON.parse(text);
    return data;
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
      careerOutlook: "High demand."
    };
  }
}

export async function getMentorResponse(history: any[], query: string) {
  const model = ai.getGenerativeModel({ 
    model: models.flash,
    systemInstruction: "You are an expert Education Consultant."
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
