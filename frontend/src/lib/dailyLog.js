// Options for the daily check-in — mood, flow and symptoms.

export const FLOW_OPTIONS = [
  { value: "none", label: "None", dot: "bg-slate-300" },
  { value: "light", label: "Light", dot: "bg-pomegranate-200" },
  { value: "medium", label: "Medium", dot: "bg-pomegranate-400" },
  { value: "heavy", label: "Heavy", dot: "bg-pomegranate-600" },
];

export const MOOD_OPTIONS = [
  { value: "great", label: "Great" },
  { value: "good", label: "Good" },
  { value: "okay", label: "Okay" },
  { value: "low", label: "Low" },
  { value: "devastated", label: "Devastated" },
  { value: "anxious", label: "Anxious" },
];

export const SYMPTOM_OPTIONS = [
  "cramps",
  "headache",
  "bloating",
  "fatigue",
  "breast_tenderness",
  "spotting",
  "acne",
  "cravings",
  "appetite_loss",
  "backache",
  "mood_swings",
  "insomnia",
  "dreams",
  "increased_libido",
];

export const DISCHARGE_OPTIONS = [
  "egg_white",
  "creamy",
  "watery",
  "sticky",
  "milky_white",
  "discoloured",
];

export const prettySymptom = (symptom) => symptom.replace(/_/g, " ");