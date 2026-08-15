import api from "./api";

export interface TriageResult {
  specialty: string;
  confidence: number;
  urgency: "Low" | "Medium" | "High";
  explanation: string;
}

export interface SummarizeResult {
  soap: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  prescriptions: {
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
}

export const triageSymptoms = async (symptoms: string): Promise<TriageResult> => {
  const { data } = await api.post("/ai/triage", { symptoms });
  return data.data;
};

export const summarizeNotes = async (notes: string): Promise<SummarizeResult> => {
  const { data } = await api.post("/ai/summarize", { notes });
  return data.data;
};
