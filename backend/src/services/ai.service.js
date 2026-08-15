const { GoogleGenerativeAI } = require("@google/generative-ai");

// Simple keyword based fallback mappings for symptom triage
const symptomKeywords = {
  cardiology: [/heart|chest.*pain|palpitations/i, /cardio/i],
  dermatology: [/skin|rash|eczema|acne|dermat/i],
  pediatrics: [/child|kid|infant|pediatric/i],
  orthopedics: [/bone|joint|fracture|sprain|ortho/i],
  ophthalmology: [/eye|vision|blur|ophthalm/i],
};

const urgencyLevels = [
  { level: "High", patterns: [/severe|acute|emergency|danger/i] },
  { level: "Medium", patterns: [/moderate|worsening|persistent/i] },
  { level: "Low", patterns: [/mild|occasional|stable/i] },
];

function fallbackSpecialty(text) {
  for (const [specialty, patterns] of Object.entries(symptomKeywords)) {
    if (patterns.some((re) => re.test(text))) {
      return specialty;
    }
  }
  return "General";
}

function fallbackUrgency(text) {
  for (const { level, patterns } of urgencyLevels) {
    if (patterns.some((re) => re.test(text))) {
      return level;
    }
  }
  return "Low";
}

function extractPrescriptions(text) {
  const lines = text.split(/\n/);
  const prescriptions = [];
  const prescriptionRegex =
    /prescribed\s+([\w\s]+?)\s+(\d+\w*)\s+(once|twice|thrice|daily|weekly)\s+for\s+(\d+)\s*(day|week|month)s?/i;
  for (const line of lines) {
    const match = prescriptionRegex.exec(line);
    if (match) {
      const [, medication, dosage, frequency, duration, unit] = match;
      prescriptions.push({
        medication: medication.trim(),
        dosage,
        frequency,
        duration: `${duration} ${unit}`,
      });
    }
  }
  return prescriptions;
}

async function routeSymptoms(symptomText) {
  if (process.env.GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-3.1-flash-lite",
      });
      const prompt = `You are a medical triage assistant. Analyze the following patient symptom description and return a JSON object with keys: specialty (Cardiology, Dermatology, Pediatrics, Orthopedics, Ophthalmology, General), confidence (0-100), urgency (Low, Medium, High), explanation (short sentence).\nSymptoms: "${symptomText}"\n\nRespond with raw JSON only, no markdown.`;
      const result = await model.generateContent(prompt);
      const raw = result.response
        .text()
        .replace(/```(?:json)?\n?|```/g, "")
        .trim();
      try {
        return JSON.parse(raw);
      } catch (parseErr) {
        console.error(
          "[AI Service Error - Triage JSON Parse]:",
          parseErr.message,
          "\nRaw Output:",
          raw
        );
      }
    } catch (apiErr) {
      console.error("[AI Service Error - Gemini Triage API]:", apiErr);
    }
  } else {
    console.warn(
      "[AI Service Warning]: GEMINI_API_KEY missing from environment. Using fallback keyword triage."
    );
  }

  const specialty = fallbackSpecialty(symptomText);
  const urgency = fallbackUrgency(symptomText);
  const confidence = 70;
  const explanation = `Based on keywords, the most likely specialty is ${specialty}.`;
  return { specialty, confidence, urgency, explanation };
}

async function summarizeConsultation(notesText) {
  if (process.env.GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-3.1-flash-lite",
      });
      const prompt = `Convert the following clinical notes into a SOAP formatted JSON object with keys: subjective, objective, assessment, plan. Also extract any prescribed medications into an array of objects with fields medication, dosage, frequency, duration. Return JSON with keys: soap and prescriptions.\nNotes: "${notesText}"\n\nRespond with raw JSON only, no markdown.`;
      const result = await model.generateContent(prompt);
      const raw = result.response
        .text()
        .replace(/```(?:json)?\n?|```/g, "")
        .trim();
      try {
        return JSON.parse(raw);
      } catch (parseErr) {
        console.error(
          "[AI Service Error - Summarize JSON Parse]:",
          parseErr.message,
          "\nRaw Output:",
          raw
        );
      }
    } catch (apiErr) {
      console.error("[AI Service Error - Gemini Summarize API]:", apiErr);
    }
  } else {
    console.warn(
      "[AI Service Warning]: GEMINI_API_KEY missing from environment. Using fallback keyword summarization."
    );
  }

  const prescriptions = extractPrescriptions(notesText);
  const soap = {
    subjective: notesText,
    objective: "",
    assessment: "",
    plan: "",
  };
  return { soap, prescriptions };
}

module.exports = { routeSymptoms, summarizeConsultation };
