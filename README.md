# EduFin AI 🎓💰
### The Unified AI-First Student Engagement & Financing Ecosystem

EduFin AI is a cutting-edge platform designed to help Indian students navigate the complex journey of higher education and financing. By leveraging the **Gemini 3.5 Flash** model, it provides personalized academic and financial pathways.

---

## 🚀 Key Features

### 🤖 AI Career Navigator
Analyze your profile (CGPA, degree, budget) to find "High ROI" university matches. Powered by Gemini AI with a simulation of over 50,000+ courses.

### 📊 ROI Predictor & Financial Health
Visual analytics using **Recharts** to compare costs vs. future earning potential. Includes a "Financial Health Check" to predict borrowing capacity.

### 💬 AI Personal Mentor 
A 24/7 advisor capable of handling complex queries about visa regulations, application strategies, and loan documentation.

### 💳 Loan Center
Personalized loan quotes from top-tier partners (HDFC, ICICI, Prodigy) with dynamic credit-score simulation.

### 📱 PWA (Native Android Feel)
Installable on any Android device as a Progressive Web App with standalone display mode and offline support.

---

## 🛠️ Tech Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS (Vibrant Palette Theme)
- **AI**: @google/genai (Gemini 3.5 Flash)
- **Animations**: Motion/React
- **Charts**: Recharts
- **PWA**: vite-plugin-pwa

---

## 📦 How to Export to GitHub
1. In the **AI Studio** interface, go to the **Settings** menu.
2. Click on **Export to GitHub**.
3. Select your repository name and click **Export**.

## 📲 How to Install as an App
This project is a PWA. To install on Android:
1. Open the URL in Chrome.
2. Tap the menu (three dots) and select **"Install App"**.
3. Use it full-screen from your home screen.

---

## 🏗️ Developing Locally

1. **Install dependencies**: `npm install`
2. **Setup Environment**:
   - Create a `.env` file in the root directory.
   - Add your Gemini API Key: `GEMINI_API_KEY=your_actual_key_here`
3. **Get your API Key**: [Google AI Studio](https://aistudio.google.com/app/apikey)
4. **Run development server**: `npm run dev`

## 🌐 Deployment (GitHub / Vercel / Netlify)

When deploying this app outside of AI Studio:
1. Ensure your hosting platform has an **Environment Variable** named `GEMINI_API_KEY`.
2. Paste your API key from Google AI Studio into that variable.
3. The build process (Vite) will automatically inject this key into your application.

---
*Built with ❤️ for Indian Students aspiring for global education.*
