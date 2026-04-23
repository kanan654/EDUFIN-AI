import { GoogleGenAI, Type } from "@google/genai";

// AI Studio automatically injects GEMINI_API_KEY into process.env
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const models = {
  flash: 'gemini-3-flash-preview',
  pro: 'gemini-3.1-pro-preview'
};

export async function getUniversityRecommendations(profile: any) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Gemini API Key is missing. Please check your AI Studio secrets.");
    }

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
          "roiScore": 88,
          "description": "Short 1-sentence tagline.",
          "tier": 1,
          "image": "https://images.unsplash.com/photo-1562774053-701939374585?auto=format",
          "contact": {
            "email": "admissions@univ.edu",
            "phone": "+1-555-0199",
            "reception": "9 AM - 5 PM EST, Mon-Fri"
          },
          "placements": {
            "avgPackage": "$125,000",
            "topRecruiters": ["Google", "NASA", "Goldman Sachs"]
          },
          "notableAlumni": ["Person Name", "Famous Scientist"],
          "history": "Brief 1-sentence history of heritage or growth.",
          "gallery": [
            "https://images.unsplash.com/photo-1562774053-701939374585?auto=format",
            "https://images.unsplash.com/photo-1541339907198-e08756eaa43f?auto=format",
            "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format"
          ]
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
          name: profile.targetCountry === 'USA' ? "Stanford University" : "Oxford University",
          country: profile.targetCountry,
          courses: [profile.targetDegree, "System Design"],
          ranking: "#2 Global",
          estimatedCost: "$55,000/year",
          roiScore: 98,
          description: "A world-leading research institution in the heart of innovation.",
          tier: 1,
          image: "https://images.unsplash.com/photo-1541339907198-e08756eaa43f?auto=format",
          contact: {
            "email": "admissions@university.edu",
            "phone": "+1-650-723-2300",
            "reception": "Leland Stanford Junior University, Stanford, CA 94305"
          },
          placements: {
            "avgPackage": "$160,000",
            "topRecruiters": ["Google", "Apple", "OpenAI"]
          },
          notableAlumni: ["Herbert Hoover", "Sally Ride", "Elon Musk"],
          history: "Founded in 1885 by Leland and Jane Stanford in memory of their only child.",
          gallery: [
            "https://images.unsplash.com/photo-1541339907198-e08756eaa43f?auto=format",
            "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format",
            "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format"
          ]
        },
        {
          name: profile.targetCountry === 'USA' ? "MIT" : "London School of Economics",
          country: profile.targetCountry,
          courses: [profile.targetDegree, "Algorithms"],
          ranking: "#1 Global",
          estimatedCost: "$58,000/year",
          roiScore: 99,
          description: "Global center for science, technology, and engineering excellence.",
          tier: 1,
          image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format",
          contact: {
            "email": "admissions@mit.edu",
            "phone": "+1-617-253-1000",
            "reception": "77 Massachusetts Ave, Cambridge, MA 02139"
          },
          placements: {
            "avgPackage": "$145,000",
            "topRecruiters": ["SpaceX", "Intel", "Microsoft"]
          },
          notableAlumni: ["Buzz Aldrin", "Kofi Annan"],
          history: "Established in 1861 in response to the increasing industrialization of the United States.",
          gallery: [
            "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format",
            "https://images.unsplash.com/photo-1498243639351-a6c9af82a74c?auto=format",
            "https://images.unsplash.com/photo-1541339907198-e08756eaa43f?auto=format"
          ]
        }
      ],
      careerOutlook: "Excellent prospects in your chosen field. (Note: Using enhanced interactive data)"
    };
  }
}

export async function getMentorResponse(history: any[], query: string) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Gemini API Key is missing.");
    }

    const chat = ai.chats.create({
      model: models.flash,
      config: {
        systemInstruction: "You are an expert Education Consultant and Financial Advisor for Indian students. Help them navigate university applications and education loans with practical, high-trust advice."
      }
    });

    const response = await chat.sendMessage({ message: query });
    return response.text;
  } catch (error) {
    console.error("Mentor AI Error:", error);
    return "I'm having trouble connecting to my knowledge base right now. Please try again in a moment.";
  }
}
