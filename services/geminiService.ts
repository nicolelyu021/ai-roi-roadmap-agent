import { GoogleGenAI, Type } from "@google/genai";
import { FinalCanvasData } from "../types";

const initGenAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is not set in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// Helper to strip markdown code blocks if the model includes them
const cleanJson = (text: string) => {
  return text.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
};

export const generateCanvasInsights = async (partialData: Partial<FinalCanvasData>): Promise<{
  strategicFocus: string;
  finalNotes: {
    risks: string;
    dataInfra: string;
    org: string;
  };
  inputs: {
    resources: string;
    personnel: string;
    externalSupport: string;
  };
  impacts: {
    hardBenefits: string;
    softBenefits: string;
  };
  capabilities: {
    skills: string;
    technology: string;
  };
}> => {
  const ai = initGenAI();
  if (!ai) {
    return {
      strategicFocus: "API Key missing.",
      finalNotes: { risks: "N/A", dataInfra: "N/A", org: "N/A" },
      inputs: { resources: "N/A", personnel: "N/A", externalSupport: "N/A" },
      impacts: { hardBenefits: "N/A", softBenefits: "N/A" },
      capabilities: { skills: "N/A", technology: "N/A" }
    };
  }

  const prompt = `
    Analyze the following AI Portfolio data and generate specific strategic insights and structure for a Business Canvas.
    
    Context:
    Industry: ${partialData.Header?.DesignedFor}
    Objective: ${partialData.Business_Context?.Objective}
    
    Selected Portfolio Use Cases:
    ${JSON.stringify(partialData.Use_Cases?.filter(u => u.Selected_for_Portfolio === 'Yes').map(u => ({ name: u.Name, problem: u.Problem, npv: u.NPV_3yr_10pct })))}
    
    Task:
    1. Write a 1-sentence "Strategic Focus" for this portfolio (balancing short-term wins and long-term transformation).
    2. Provide 3 specific bullet points for "Risks and Mitigations".
    3. Provide 3 specific bullet points for "Data and Infra Requirements".
    4. Provide 3 specific bullet points for "Organizational Considerations".
    5. List "Inputs":
       - "Resources": (e.g., Cloud compute, Data Lakes)
       - "Personnel": (e.g., Data Scientists, Domain Experts)
       - "ExternalSupport": (e.g., Implementation partners, Specialized API providers)
    6. List "Impacts":
       - "HardBenefits": Summarize financial/efficiency gains (e.g., "Cost savings of $X from automation...")
       - "SoftBenefits": Summarize qualitative gains (e.g., "Improved customer satisfaction...")
    7. List "Capabilities":
       - "Skills": (e.g., NLP, Python, ML Engineering)
       - "Technology": (e.g., Azure AI, TensorFlow, Vector DB)
    
    Output JSON format only.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strategicFocus: { type: Type.STRING },
            risksAndMitigations: { type: Type.STRING },
            dataAndInfra: { type: Type.STRING },
            orgConsiderations: { type: Type.STRING },
            inputs: {
                type: Type.OBJECT,
                properties: {
                    resources: { type: Type.STRING },
                    personnel: { type: Type.STRING },
                    externalSupport: { type: Type.STRING }
                },
                required: ["resources", "personnel", "externalSupport"]
            },
            impacts: {
                type: Type.OBJECT,
                properties: {
                    hardBenefits: { type: Type.STRING },
                    softBenefits: { type: Type.STRING }
                },
                required: ["hardBenefits", "softBenefits"]
            },
            capabilities: {
                type: Type.OBJECT,
                properties: {
                    skills: { type: Type.STRING },
                    technology: { type: Type.STRING }
                },
                required: ["skills", "technology"]
            }
          },
          required: ["strategicFocus", "risksAndMitigations", "dataAndInfra", "orgConsiderations", "inputs", "impacts", "capabilities"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const cleanedText = cleanJson(text);
    const result = JSON.parse(cleanedText);

    return {
      strategicFocus: result.strategicFocus || "No focus generated.",
      finalNotes: {
        risks: result.risksAndMitigations || "No risks generated.",
        dataInfra: result.dataAndInfra || "No requirements generated.",
        org: result.orgConsiderations || "No considerations generated."
      },
      inputs: {
        resources: result.inputs?.resources || "N/A",
        personnel: result.inputs?.personnel || "N/A",
        externalSupport: result.inputs?.externalSupport || "N/A"
      },
      impacts: {
        hardBenefits: result.impacts?.hardBenefits || "N/A",
        softBenefits: result.impacts?.softBenefits || "N/A"
      },
      capabilities: {
        skills: result.capabilities?.skills || "N/A",
        technology: result.capabilities?.technology || "N/A"
      }
    };

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    return {
      strategicFocus: "Error generating focus.",
      finalNotes: {
        risks: "Error generating risks.",
        dataInfra: "Error generating requirements.",
        org: "Error generating considerations."
      },
      inputs: { resources: "Error", personnel: "Error", externalSupport: "Error" },
      impacts: { hardBenefits: "Error", softBenefits: "Error" },
      capabilities: { skills: "Error", technology: "Error" }
    };
  }
};