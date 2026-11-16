// Daily journalling prompts for people tracking general wellbeing. The day of
// the month picks the theme, so everyone lands on the same prompt each day and
// the rotation moves through mood, gratitude and visualisation.
export const JOURNAL_THEMES = [
  {
    key: "mood",
    label: "Mood & energy",
    prompts: [
      "What did your energy feel like today, and what gave it or took it away?",
      "Name three moments: one that lifted you, one that drained you, one that steadied you.",
      "If today had a weather forecast, what would it be, and what shifted it?",
      "Where in your body did today's feelings show up most strongly?",
      "What's one small thing you could change tomorrow to protect your energy?",
    ],
  },
  {
    key: "gratitude",
    label: "Gratitude",
    prompts: [
      "What are three things from today you'd happily live again?",
      "Who made today lighter, and how could you let them know?",
      "What part of your everyday life do you usually take for granted?",
      "Thank something ordinary today: a warm drink, a familiar song, a quiet moment. What was it?",
      "What did today give you that last week didn't?",
    ],
  },
  {
    key: "visualisation",
    label: "Visualisation",
    prompts: [
      "Picture tomorrow going exactly as you'd want it. What does the first hour look like?",
      "Describe the version of you a year from now who already has what you're working towards.",
      "Imagine a place where you feel completely at ease. Where are you, and what can you hear?",
      "What would today have looked like if you'd moved through it as your calmest self?",
      "Write your next small win in the present tense, as though it has already happened.",
    ],
  },
];

// The same date always returns the same prompt, so it holds for anyone who
// opens the page later that day.
export function promptForDate(dateKey) {
  const days = Math.floor(
    new Date(`${dateKey}T00:00:00`).getTime() / 86400000
  );
  const theme = JOURNAL_THEMES[((days % 3) + 3) % 3];
  const prompt =
    theme.prompts[Math.abs(Math.floor(days / 3)) % theme.prompts.length];
  return { theme, prompt };
}