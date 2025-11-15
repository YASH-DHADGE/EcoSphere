import { GoogleGenerativeAI } from "@google/generative-ai";

// Use Vite-style environment variable (must start with VITE_)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("VITE_GEMINI_API_KEY is not defined in your .env file");
}

const ai = new GoogleGenerativeAI(API_KEY);
const modelName = "gemini-1.5-flash"; // use stable, available model

// ----------- Chatbot Response -----------
export const getChatbotResponse = async (
  history: { role: string; parts: { text: string }[] }[],
  newMessage: string
) => {
  try {
    const model = ai.getGenerativeModel({ model: modelName });

    // Create conversation context as one prompt
    const combinedPrompt = `
      You are EcoSphere's friendly and knowledgeable climate assistant.
      Provide helpful, accurate, and concise information about climate change, sustainability,
      and carbon footprints. Use Markdown if it improves readability.
      
      Conversation so far:
      ${history.map((h) => `${h.role}: ${h.parts.map((p) => p.text).join(" ")}`).join("\n")}

      User: ${newMessage}
    `;

    const result = await model.generateContent(combinedPrompt);
    return result.response.text();
  } catch (error) {
    console.error("Error getting chatbot response:", error);
    return "I'm sorry, I'm having trouble connecting right now. Please try again later.";
  }
};

// ----------- Article Summarizer -----------
export const summarizeArticle = async (articleContent: string) => {
  try {
    const model = ai.getGenerativeModel({ model: modelName });
    const prompt = `
      Summarize the following news article in three concise bullet points.
      Focus on key findings and their implications for climate change:

      ---
      ${articleContent}
    `;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error summarizing article:", error);
    return "Could not generate summary.";
  }
};

// ----------- Carbon Footprint Suggestions -----------
export const getCarbonFootprintSuggestions = async (data: {
  electricity: string;
  naturalGas: string;
  car: string;
  flight: string;
  total: string;
  domestic: string;
  transport: string;
}) => {
  try {
    const model = ai.getGenerativeModel({ model: modelName });
    const prompt = `
      Analyze the following monthly carbon footprint data. Provide 3–5 extremely practical,
      simple, and direct suggestions for how to reduce it.

      **User's Data:**
      - Total Monthly Footprint: ${data.total} tonnes CO₂e
      - Main Contributor: ${
        parseFloat(data.domestic) > parseFloat(data.transport)
          ? "Home Energy"
          : "Transport"
      }
      - Electricity Usage: ${data.electricity || "0"} kWh
      - Car Mileage: ${data.car || "0"} km
      - Flights: ${data.flight || "0"} km

      **INSTRUCTIONS:**
      - No theory or background info.
      - Be specific and action-oriented (e.g., "Switch to LED bulbs" not "Use efficient lighting").
      - Focus more on the main contributor.
      - Start with one short, encouraging line.
      - Use Markdown bullet points.
    `;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error getting carbon footprint suggestions:", error);
    return "I'm sorry, I'm having trouble generating suggestions right now.";
  }
};

// ----------- Stat Card Explanation -----------
export const getStatCardDetails = async (stat: {
  title: string;
  type: string;
  value: string;
  unit: string;
}) => {
  let prompt = "";
  const baseInstruction =
    "You are a helpful climate communicator. Explain the following metric in around 50 words, in simple language. " +
    "Explain why it matters in the context of climate change. Use Markdown for formatting.";

  switch (stat.type) {
    case "co2":
      prompt = `${baseInstruction}\n\n**Metric:** ${stat.title}\n**Value:** ${stat.value} ${stat.unit}\nExplain what 'parts per million' means and why this level is concerning.`;
      break;
    case "temp":
      prompt = `${baseInstruction}\n\n**Metric:** ${stat.title}\n**Value:** ${stat.value} ${stat.unit}\nExplain what 'temperature anomaly' means and why an increase of over 1°C is significant.`;
      break;
    case "sea":
      prompt = `${baseInstruction}\n\n**Metric:** ${stat.title} (since 1993)\n**Value:** ${stat.value} ${stat.unit}\nExplain what causes sea level rise and what it means for coastal regions.`;
      break;
    case "footprint":
      prompt = `${baseInstruction}\n\n**Metric:** Average Individual Carbon Footprint\n**Value:** ${stat.value} ${stat.unit}\nExplain what 'tonnes of CO₂ equivalent' means and mention main individual sources.`;
      break;
    default:
      return "No details available for this metric.";
  }

  try {
    const model = ai.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error getting stat card details:", error);
    return "I'm sorry, I'm having trouble fetching details right now.";
  }
};
