export interface WellnessTip {
  icon: string;
  tip: string;
  category: string;
}

export const WELLNESS_TIPS: WellnessTip[] = [
  { icon: "💧", tip: "Drink at least 8 glasses of water daily, especially in hot weather. Dehydration is a leading cause of fatigue.", category: "Hydration" },
  { icon: "🚶", tip: "A 30-minute brisk walk each morning improves cardiovascular health and mood.", category: "Exercise" },
  { icon: "🌙", tip: "Aim for 7–8 hours of sleep each night. Poor sleep raises blood pressure and weakens the immune system.", category: "Rest" },
  { icon: "🥗", tip: "Include vegetables in at least two meals per day. Leafy greens support heart and kidney health.", category: "Nutrition" },
  { icon: "☀️", tip: "Apply SPF 30+ sunscreen before going outdoors. UV exposure is a major cause of skin aging.", category: "Skin Care" },
  { icon: "🫀", tip: "Schedule a blood pressure check every 6 months if you are over 40 or have a family history of heart disease.", category: "Prevention" },
  { icon: "🩺", tip: "Don't skip your annual checkup. Early detection saves lives — especially for diabetes and hypertension.", category: "Prevention" },
  { icon: "🧘", tip: "Practice 5 minutes of deep breathing before bed to reduce stress hormones and improve sleep quality.", category: "Mental Health" },
  { icon: "🚫", tip: "Smoking doubles your risk of heart disease. It's never too late to quit — your body begins recovering within hours.", category: "Lifestyle" },
  { icon: "🍽️", tip: "Reduce salt intake to under 5g per day. Excess sodium is linked to kidney strain and high blood pressure.", category: "Nutrition" },
  { icon: "🏃", tip: "Even 10 minutes of movement breaks during a long desk day reduces back pain and blood clot risk.", category: "Exercise" },
  { icon: "👁️", tip: "Apply the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds to reduce eye strain.", category: "Eye Health" },
];

export const getTodayTipIndex = () => {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const dayOfYear = Math.floor((Date.now() - start.getTime()) / 86400000);
  return dayOfYear % WELLNESS_TIPS.length;
};
