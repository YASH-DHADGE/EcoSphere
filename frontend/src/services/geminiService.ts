// Configuration
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// We use a prioritized list of models.
// The first one is optimized for this preview environment.
// The second is the standard public model for local dev/production.
const MODEL_IDS = [
  "gemini-2.5-flash-preview-09-2025", // Preview environment specific
  "gemini-1.5-flash", // Standard public model
  "gemini-1.5-flash-002", // Fallback version
];

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

if (!API_KEY) {
  console.error("VITE_GEMINI_API_KEY is not defined in your .env file");
}

/**
 * ROBUST API CALL FUNCTION
 * Handles connection, headers, and retries with model fallbacks.
 */
async function callGeminiAPI(
  prompt: string,
  retryCount = 0,
  modelIndex = 0
): Promise<string> {
  if (!API_KEY) return "Error: API Key is missing. Please check .env file.";
  if (modelIndex >= MODEL_IDS.length)
    return "Error: All models failed to respond.";

  const currentModel = MODEL_IDS[modelIndex];
  const apiUrl = `${BASE_URL}/${currentModel}:generateContent`;

  try {
    const response = await fetch(`${apiUrl}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    // SPECIFIC HANDLING FOR 404 (Model Not Found)
    if (response.status === 404) {
      console.warn(
        `Model ${currentModel} not found (404). Switching to fallback...`
      );
      return callGeminiAPI(prompt, 0, modelIndex + 1);
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error("No content generated");

    return text;
  } catch (error) {
    // Retry logic for network blips (up to 2 times)
    if (retryCount < 2) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return callGeminiAPI(prompt, retryCount + 1, modelIndex);
    }

    console.error(`Gemini API Failed (${currentModel}):`, error);

    // If retries failed, try next model
    if (modelIndex < MODEL_IDS.length - 1) {
      return callGeminiAPI(prompt, 0, modelIndex + 1);
    }

    return "I'm sorry, I'm having trouble connecting to the climate database right now. Please try again later.";
  }
}

// ----------- Chatbot Response -----------
export const getChatbotResponse = async (
  history: { role: string; parts: { text: string }[] }[],
  newMessage: string
) => {
  try {
    const conversationHistory = history
      .map(
        (h) =>
          `${h.role === "model" ? "Assistant" : "User"}: ${h.parts
            .map((p) => p.text)
            .join(" ")}`
      )
      .join("\n");

    const combinedPrompt = `
      You are EcoSphere's friendly and knowledgeable climate assistant.
      Provide helpful, accurate, and concise information about climate change, sustainability,
      and carbon footprints. Use Markdown if it improves readability.
      
      Conversation so far:
      ${conversationHistory}

      User: ${newMessage}
      Assistant:
    `;

    return await callGeminiAPI(combinedPrompt);
  } catch (error) {
    console.error("Error getting chatbot response:", error);
    return "I'm sorry, I'm having trouble connecting right now.";
  }
};

// ----------- Article Summarizer -----------
export const summarizeArticle = async (articleContent: string) => {
  try {
    const prompt = `
      Summarize the following news article in three concise bullet points.
      Focus on key findings and their implications for climate change:

      ---
      ${articleContent}
    `;
    return await callGeminiAPI(prompt);
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
    return await callGeminiAPI(prompt);
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
    return await callGeminiAPI(prompt);
  } catch (error) {
    console.error("Error getting stat card details:", error);
    return "I'm sorry, I'm having trouble fetching details right now.";
  }
};
