import { GoogleGenAI } from "@google/genai";

const apiKey = "AIzaSyAvehuUtM8KBByoTQVSmBNXlza3RSjHEBE"; 
const ai = new GoogleGenAI({ apiKey: apiKey });

export const models = {
  flash: 'gemini-1.5-flash',
  pro: 'gemini-1.5-pro'
};

export async function getUniversityRecommendations(profile: any) {
  try {
    // Kanan, maine prompt ko aur clear kar diya hai taaki wo BBA ko prioritize kare
    const prompt = `Act as a professional study abroad consultant. 
    Analyze this student profile: ${JSON.stringify(profile)}.
    The student wants to study: ${profile.course || 'the selected course'}.
    The student's preferred country is: ${profile.country || 'the selected country'}.

    Provide 5 specific university recommendations based on their interest in ${profile.course}.
    
    Return ONLY a JSON object exactly like this:
    {
      "recommendations": [
        {
          "name": "Actual University Name",
          "country": "Actual Country",
          "courses": ["Specific Course 1", "Specific Course 2"],
          "ranking": "Global Rank",
          "estimatedCost": "Cost in local currency",
          "roiScore": 85
        }
      ],
      "careerOutlook": "Brief career growth details"
    }`;

    const model = ai.getGenerativeModel({ 
      model: models.flash,
      generationConfig: { 
        responseMimeType: "application/json",
        temperature: 0.7 // Isse variety badh jayegi
      }
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    if (!text) throw new Error("Empty AI response");
    return JSON.parse(text);

  } catch (error) {
    console.error("AI Recommendation Error:", error);
    // Agar AI fail ho jaye, toh ye empty dikhaye ya error message, Stanford nahi
    return {
      recommendations: [],
      careerOutlook: "Sorry, I couldn't fetch specific recommendations. Please check your internet or try a different course."
    };
  }
}

export async function getMentorResponse(history: any[], query: string) {
  try {
    const model = ai.getGenerativeModel({ 
      model: models.flash,
      systemInstruction: "You are an expert Education Consultant and Financial Advisor for Indian students. Always focus on the student's specific query."
    });

    const chat = model.startChat({
      history: history.length > 0 ? history.map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content || h.text || "" }]
      })) : []
    });

    const result = await chat.sendMessage(query);
    return result.response.text();
  } catch (error) {
    console.error("Mentor AI Error:", error);
    return "I am facing a connection issue. Please try again.";
  }
}
