
import { GoogleGenAI, Type } from "@google/genai";
import { ScriptContext, InsuranceDetails, ExtractedTreatment, SentimentAnalysis, SmartFillCandidate, ProviderPerformance } from "../types";
import { IS_PRODUCTION_MODE, callCloudFunction } from "./gcpService";

// DEV MODE: Direct Key (unsafe for prod)
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const extractInsuranceInfo = async (file: File): Promise<InsuranceDetails> => {
  const base64Data = await fileToGenerativePart(file);

  // PRODUCTION ROUTE
  if (IS_PRODUCTION_MODE) {
    return await callCloudFunction('extractInsuranceInfo', { 
      mimeType: file.type, 
      data: base64Data 
    });
  }

  // DEV ROUTE
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: file.type,
            data: base64Data
          }
        },
        {
          text: "Analyze this insurance card image. Extract the Member ID, Group Number, Payer Name (e.g. Aetna, Delta Dental), and Plan Type (e.g. PPO, HMO). Return JSON."
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          memberId: { type: Type.STRING },
          groupNumber: { type: Type.STRING },
          payerName: { type: Type.STRING },
          planType: { type: Type.STRING }
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No data returned from Gemini");
  return JSON.parse(text) as InsuranceDetails;
};

export const generatePatientScript = async (context: ScriptContext): Promise<string> => {
  if (IS_PRODUCTION_MODE) {
    return await callCloudFunction('generateScript', context);
  }

  const prompt = `
    You are an AI assistant for a dental practice named 'PracticeBridge'.
    Write a ${context.tone} SMS text message (max 160 chars) to patient ${context.patientName}.
    Context:
    - Last Visit: ${context.lastVisitDate}
    - Recommended Treatment: ${context.treatmentType}
    - Birthday Month: ${context.isBirthdayMonth ? "Yes (mention briefly)" : "No"}
    
    Do not include placeholders. Write the final message ready to send.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text || "Error generating script.";
};

export const mineClinicalNotes = async (notes: string): Promise<ExtractedTreatment[]> => {
  if (IS_PRODUCTION_MODE) {
    return await callCloudFunction('mineNotes', { notes });
  }

  const prompt = `
    Analyze the following dental clinical notes. Identify any treatments that were diagnosed, recommended, or "watched", but effectively unscheduled.
    
    Notes: "${notes}"
    
    Return a JSON array of objects with fields: treatmentName, status (Diagnosed or Watch), confidence (0-100 integer), and snippet (the specific text).
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            treatmentName: { type: Type.STRING },
            status: { type: Type.STRING },
            confidence: { type: Type.INTEGER },
            snippet: { type: Type.STRING }
          }
        }
      }
    }
  });

  const text = response.text;
  if (!text) return [];
  return JSON.parse(text) as ExtractedTreatment[];
};

export const analyzeMessage = async (message: string, patientName: string): Promise<SentimentAnalysis> => {
  if (IS_PRODUCTION_MODE) {
    return await callCloudFunction('analyzeSentiment', { message, patientName });
  }

  const prompt = `
    Analyze the incoming SMS from dental patient "${patientName}".
    Message: "${message}"

    Tasks:
    1. Determine Sentiment: Positive, Neutral, Negative, Complaint, or Urgent.
    2. Determine Intent: Booking, Question, Billing, or General.
    3. Draft a Suggested Reply: Polite, professional, and concise.
    4. Flag for Human Review: True if it's a Complaint or Urgent.

    Return JSON.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sentiment: { type: Type.STRING, enum: ['Positive', 'Neutral', 'Negative', 'Complaint', 'Urgent'] },
          intent: { type: Type.STRING, enum: ['Booking', 'Question', 'Billing', 'General'] },
          suggestedReply: { type: Type.STRING },
          requiresHumanReview: { type: Type.BOOLEAN }
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Analysis failed");
  return JSON.parse(text) as SentimentAnalysis;
};

export const generateSmartFillInvite = async (candidate: SmartFillCandidate, slotTime: string): Promise<string> => {
  if (IS_PRODUCTION_MODE) {
    return await callCloudFunction('smartFill', { candidate, slotTime });
  }

  const prompt = `
    You are 'PracticeBridge', a dental office AI.
    Write a short, high-conversion SMS to fill a last-minute opening.
    
    To: ${candidate.name}
    Slot Available: ${slotTime}
    Why them: ${candidate.reason}
    Distance: ${candidate.distanceMiles} miles away
    
    Tone: Helpful, Urgent, Exclusive.
    Max 160 chars. No placeholders.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text || "We have an opening! Call us to book.";
};

export const generateSoapNote = async (transcript: string): Promise<string> => {
  if (IS_PRODUCTION_MODE) {
    return await callCloudFunction('transcribeSoap', { transcript });
  }

  const prompt = `
    You are a professional Dental AI Scribe.
    Convert the following raw audio transcript from a dentist into a structured SOAP Note (Subjective, Objective, Assessment, Plan).
    
    Transcript: "${transcript}"
    
    Rules:
    - Use standard dental abbreviations (MOD, B, L, PFM).
    - Be concise and professional.
    - Format strictly with:
      S: 
      O: 
      A: 
      P: 
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text || "Error generating SOAP note.";
};

export const generateCoachingPlan = async (provider: ProviderPerformance, metricName: string, metricValue: number, target: number): Promise<string> => {
  if (IS_PRODUCTION_MODE) {
    return await callCloudFunction('coachingPlan', { provider, metricName, metricValue, target });
  }

  const prompt = `
    You are a Dental Practice Management Consultant AI.
    Create a short, constructive 1-on-1 coaching script for the Owner Doctor to use with an Associate.
    
    Associate: ${provider.providerName}
    Issue: Low ${metricName}
    Current Stat: ${metricValue}
    Target Stat: ${target}
    
    Provide 3 specific, actionable talking points to improve this metric. Tone should be supportive but performance-oriented.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text || "Error generating coaching plan.";
};
