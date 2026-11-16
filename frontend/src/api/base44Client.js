// PREVIEW-ONLY MOCK of the Base44 client: nothing is sent anywhere, data lives in localStorage.
const KEY = "pomi_preview_user";
const read = () => JSON.parse(window.localStorage.getItem(KEY) || "null");
const write = (u) => window.localStorage.setItem(KEY, JSON.stringify(u));

const dayStr = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

// Sample cycles so the dashboard has something to show.
const SAMPLE = {
  CycleLog: [-88, -60, -32, -4].map((start, i) => ({
    id: `sample-${i}`,
    start_date: dayStr(start),
    end_date: dayStr(start + 4),
    flow_intensity: "medium",
  })),
};

const tableKey = (name) => `pomi_preview_${name}`;
const rows = (name) => {
  const raw = window.localStorage.getItem(tableKey(name));
  return raw ? JSON.parse(raw) : SAMPLE[name] || [];
};
const save = (name, list) => window.localStorage.setItem(tableKey(name), JSON.stringify(list));

const entity = (name) => ({
  filter: async () => ({ items: rows(name) }),
  list: async () => ({ items: rows(name) }),
  create: async (data) => {
    const row = { id: `${Date.now()}`, ...data };
    save(name, [...rows(name), row]);
    return row;
  },
  bulkCreate: async (list) => save(name, [...rows(name), ...list.map((d, i) => ({ id: `${Date.now()}-${i}`, ...d }))]),
  update: async (id, data) => save(name, rows(name).map((r) => (r.id === id ? { ...r, ...data } : r))),
  delete: async (id) => save(name, rows(name).filter((r) => r.id !== id)),
  deleteMany: async () => save(name, []),
});

export const base44 = {
  auth: {
    me: async () => {
      const u = read();
      if (!u) throw new Error("not signed in");
      return { id: "preview-user", ...u };
    },
    updateMe: async (data) => write({ ...(read() || {}), ...data }),
    register: async () => {},
    verifyOtp: async () => {
      write(read() || {});
      return {};
    },
    setToken: () => {},
    resendOtp: async () => {},
    loginViaEmailPassword: async () => write(read() || {}),
    resetPasswordRequest: async () => {},
    logout: () => {
      resetPreview();
      window.location.href = "/";
    },
    loginWithProvider: (_provider, to) => {
      write(read() || {});
      window.location.href = to;
    },
  },
  entities: new Proxy({}, { get: (_t, name) => entity(name) }),
  functions: {
    invoke: async (name) => ({ data: name === "getSubscriberStatus" ? { subscriber: true } : {} }),
  },
};

export const resetPreview = () => {
  Object.keys(window.localStorage)
    .filter((k) => k.startsWith("pomi_"))
    .forEach((k) => window.localStorage.removeItem(k));
};

export const previewAsSignedIn = () => {
  resetPreview();
  write({ preferred_name: "Alex", tracking_focus: ["menstrual_cycles"], charity_interests: ["period_poverty"] });
};
