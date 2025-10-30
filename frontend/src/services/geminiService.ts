import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = "gemini-2.5-flash";

export const getChatbotResponse = async (history: { role: string; parts: { text: string }[] }[], newMessage: string) => {
  try {
    const chat = ai.chats.create({
      model: model,
      history: history,
      config: {
          systemInstruction: "You are EcoSphere's friendly and knowledgeable climate assistant. Provide helpful, accurate, and concise information about climate change, sustainability, and carbon footprints. Use Markdown for formatting if it improves readability.",
      }
    });
    
    const response = await chat.sendMessage({ message: newMessage });
    return response.text;
  } catch (error) {
    console.error("Error getting chatbot response:", error);
    return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.";
  }
};

export const summarizeArticle = async (articleContent: string) => {
  try {
    const prompt = `Summarize the following news article for a general audience in three concise bullet points. Focus on the key findings and their implications for climate change:\n\n---\n\n${articleContent}`;
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Error summarizing article:", error);
    return "Could not generate summary.";
  }
};

export const getCarbonFootprintSuggestions = async (
  data: {
    electricity: string;
    naturalGas: string;
    car: string;
    flight: string;
    total: string;
    domestic: string;
    transport: string;
  }
) => {
  try {
    const prompt = `
      Analyze the following monthly carbon footprint data. Provide 3-5 extremely practical, simple, and direct suggestions for how to reduce it.

      **User's Data:**
      - Total Monthly Footprint: ${data.total} tonnes CO₂e
      - Main Contributor: ${parseFloat(data.domestic) > parseFloat(data.transport) ? 'Home Energy' : 'Transport'}
      - Electricity Usage: ${data.electricity || '0'} kWh
      - Car Mileage: ${data.car || '0'} km
      - Flights: ${data.flight || '0'} km

      **CRITICAL INSTRUCTIONS:**
      - **NO THEORY.** Do not give background information or explain climate change. Just give the actions.
      - **BE DIRECT.** The suggestions must be simple actions. Example: "Lower your thermostat by 1 degree" NOT "Heating is a major contributor to emissions."
      - Focus on the "Main Contributor" for the most relevant tips.
      - Start with a single, short, encouraging sentence.
      - Use a bulleted list ('* ') for the suggestions.
    `;
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "You are EcoSphere's friendly and knowledgeable climate assistant, specializing in providing personalized and actionable advice to reduce carbon footprints."
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error getting carbon footprint suggestions:", error);
    return "I'm sorry, I'm having trouble generating suggestions right now. Please try again later.";
  }
};

export const getStatCardDetails = async (stat: { title: string; type: string; value: string; unit: string; }) => {
  let prompt = '';
  const baseInstruction = "You are a helpful climate science communicator. Explain the following metric in a simple, concise way (around 50 words) for a general audience. Explain its significance in the context of climate change. Use Markdown for formatting.";

  switch (stat.type) {
    case 'co2':
      prompt = `${baseInstruction}\n\n**Metric:** ${stat.title}\n**Value:** ${stat.value} ${stat.unit}\n\nExplain what 'parts per million' means and why this concentration level is a concern.`;
      break;
    case 'temp':
      prompt = `${baseInstruction}\n\n**Metric:** ${stat.title}\n**Value:** ${stat.value} ${stat.unit}\n\nExplain what 'temperature anomaly' means and why an increase of over 1°C is significant.`;
      break;
    case 'sea':
      prompt = `${baseInstruction}\n\n**Metric:** ${stat.title} (since 1993)\n**Value:** ${stat.value} ${stat.unit}\n\nExplain what causes sea level rise and the implications of this increase.`;
      break;
    case 'footprint':
      prompt = `${baseInstruction}\n\n**Metric:** Average Individual Carbon Footprint\n**Value:** ${stat.value} ${stat.unit}\n\nExplain what 'tonnes of CO2 equivalent' means and briefly mention the main sources for an individual's footprint.`;
      break;
    default:
      return "No details available for this metric.";
  }

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error getting stat card details:", error);
    return "I'm sorry, I'm having trouble fetching details right now. Please try again later.";
  }
};