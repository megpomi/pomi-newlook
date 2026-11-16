import { base44 } from "@/api/base44Client";
import { charityLabel } from "@/lib/charities";

// Share of every revenue stream that goes into the donation pot.
export const DONATION_SHARE = 0.2;
// Free (ad-supported) plan: revenue from the ads shown on each visit.
export const AD_REVENUE_PER_VISIT = 0.02;
// Ad-free subscription: revenue accrues every day, whether or not the app is opened.
export const SUBSCRIPTION_REVENUE_PER_DAY = 0.1;

const DAY = 86400000;
const VISIT_KEY = "pomi_ad_visit_recorded";

const toDate = (value) => {
  const d = new Date(value);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

export const monthKey = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

// --- days tracked (shown as the tracking stat) ---

// Days covered by one log — an open entry counts as a single day.
export const logDays = (log) => {
  const start = toDate(log.start_date);
  if (!log.end_date) return 1;
  const end = toDate(log.end_date);
  return Math.max(Math.round((end - start) / DAY) + 1, 1);
};

export const countTrackedDays = (logs) =>
  logs.reduce((total, log) => total + logDays(log), 0);

const dayKeyOf = (value) => {
  const d = toDate(value);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

// Distinct days with any data: every day covered by a period log, plus every
// daily check-in. Returns the all-time count and the count for this month.
export const countContributionDays = (logs, dailyLogs) => {
  const days = new Set();

  (logs || []).forEach((log) => {
    if (!log.start_date) return;
    const start = toDate(log.start_date);
    const total = logDays(log);
    for (let i = 0; i < total; i += 1) {
      days.add(dayKeyOf(new Date(start.getTime() + i * DAY)));
    }
  });

  (dailyLogs || []).forEach((log) => {
    if (log.date) days.add(dayKeyOf(log.date));
  });

  const thisMonthPrefix = monthKey();
  let thisMonth = 0;
  days.forEach((day) => {
    if (day.startsWith(thisMonthPrefix)) thisMonth += 1;
  });

  return { allTime: days.size, thisMonth };
};

// --- ad-funded donations (free plan) ---

const viewsByMonth = (user) => user?.ad_views_by_month || {};

export const adViewsThisMonth = (user) => viewsByMonth(user)[monthKey()] || 0;

export const adViewsAllTime = (user) =>
  Object.values(viewsByMonth(user)).reduce(
    (total, views) => total + (Number(views) || 0),
    0
  );

// One ad view per app visit, recorded once per browser session for ad-supported users.
// `subscriber` is the server-derived ad-free flag (useIsSubscriber), not a User field.
export const recordAdVisit = async (user, subscriber) => {
  if (!user || subscriber || sessionStorage.getItem(VISIT_KEY)) {
    return user;
  }
  sessionStorage.setItem(VISIT_KEY, "1");

  const key = monthKey();
  const ad_views_by_month = {
    ...viewsByMonth(user),
    [key]: (viewsByMonth(user)[key] || 0) + 1,
  };

  try {
    await base44.auth.updateMe({ ad_views_by_month });
    return { ...user, ad_views_by_month };
  } catch (e) {
    console.error("Couldn't record this visit's ad view", e);
    return user;
  }
};

// --- subscription donations (ad-free plans) ---

// Whole days of subscription, optionally only those inside the current month.
const subscriptionDays = (user, subscriber, { thisMonth = false } = {}) => {
  if (!subscriber || !user?.plan_started_at) return 0;

  const start = toDate(user.plan_started_at);
  const today = toDate(new Date());
  const end = user.plan_ended_at ? toDate(user.plan_ended_at) : today;
  const from = thisMonth
    ? new Date(today.getFullYear(), today.getMonth(), 1)
    : start;
  const overlapStart = start > from ? start : from;

  if (overlapStart > end) return 0;
  return Math.round((end - overlapStart) / DAY) + 1;
};

// The revenue this user's activity generated, and the donation pot (20% of it) that follows.
export const donationTotals = (user, subscriber) => {
  let mode;
  let thisMonthCount;
  let allTimeCount;
  let thisMonthRevenue;
  let allTimeRevenue;

  if (subscriber) {
    mode = "subscription";
    thisMonthCount = subscriptionDays(user, subscriber, { thisMonth: true });
    allTimeCount = subscriptionDays(user, subscriber);
    thisMonthRevenue = thisMonthCount * SUBSCRIPTION_REVENUE_PER_DAY;
    allTimeRevenue = allTimeCount * SUBSCRIPTION_REVENUE_PER_DAY;
  } else {
    mode = "ads";
    thisMonthCount = adViewsThisMonth(user);
    allTimeCount = adViewsAllTime(user);
    thisMonthRevenue = thisMonthCount * AD_REVENUE_PER_VISIT;
    allTimeRevenue = allTimeCount * AD_REVENUE_PER_VISIT;
  }

  return {
    mode,
    thisMonthRevenue,
    allTimeRevenue,
    thisMonth: thisMonthRevenue * DONATION_SHARE,
    allTime: allTimeRevenue * DONATION_SHARE,
    thisMonthCount,
    allTimeCount,
  };
};

// The pot, split equally between the causes this user chose.
export const splitByCause = (user, pot) => {
  const causes = user?.charity_interests || [];
  if (!causes.length) return [];
  const share = pot / causes.length;
  return causes.map((value) => ({
    value,
    label: charityLabel(value),
    amount: share,
  }));
};