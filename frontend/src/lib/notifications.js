// Notification topics and how they are stored on the user record.
// Each topic can be delivered by email, by push, by both or by neither, so a
// wellbeing-only tracker can get journal prompts without cycle alerts.

export const CHANNELS = [
  { key: "email", label: "Email" },
  { key: "push", label: "Push" },
];

export const NOTIFICATION_TOPICS = [
  {
    key: "daily_log",
    label: "Daily check-in",
    desc: "A nudge to log your flow, mood and symptoms.",
    tracks: null,
  },
  {
    key: "journal",
    label: "Journal prompt",
    desc: "Your reflective prompt for the day.",
    tracks: "general_wellbeing",
  },
  {
    key: "cycle",
    label: "Cycle & period alerts",
    desc: "When your period is due, late, or your predictions change.",
    tracks: "menstrual_cycles",
  },
  {
    key: "impact",
    label: "Donation & impact updates",
    desc: "Your giving summary and news from your chosen causes.",
    tracks: null,
  },
];

// Only ask about the trackers the person actually uses.
export const visibleTopics = (tracking = []) =>
  NOTIFICATION_TOPICS.filter((topic) => !topic.tracks || tracking.includes(topic.tracks));

// Older accounts only stored the two channel flags, so those remain the
// starting point for anyone without per-topic choices yet.
export function readNotificationPrefs(user) {
  const stored = user?.notify_prefs || {};
  const fallback = {
    email: user?.notify_email ?? true,
    push: user?.notify_push ?? false,
  };
  return NOTIFICATION_TOPICS.reduce((acc, topic) => {
    acc[topic.key] = { ...fallback, ...(stored[topic.key] || {}) };
    return acc;
  }, {});
}

// notify_email still drives the daily reminder workflow, and notify_push keeps
// a single flag for whether anything is pushed at all.
export function notificationUserFields(prefs) {
  return {
    notify_prefs: prefs,
    notify_email: prefs.daily_log?.email !== false,
    notify_push: NOTIFICATION_TOPICS.some((topic) => prefs[topic.key]?.push),
  };
}