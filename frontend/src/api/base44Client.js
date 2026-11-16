// PREVIEW-ONLY MOCK of the Base44 client: nothing is sent anywhere, answers live in localStorage.
const KEY = "pomi_preview_user";
const read = () => JSON.parse(window.localStorage.getItem(KEY) || "null");
const write = (u) => window.localStorage.setItem(KEY, JSON.stringify(u));

export const base44 = {
  auth: {
    me: async () => {
      const u = read();
      if (!u) throw new Error("not signed in");
      return u;
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
    loginWithProvider: (_provider, to) => {
      write(read() || {});
      window.location.href = to;
    },
  },
  entities: { CycleLog: { bulkCreate: async () => {} } },
  functions: { invoke: async () => ({ data: {} }) },
};

export const resetPreview = () => {
  window.localStorage.removeItem(KEY);
  window.localStorage.removeItem("pomi_onboarding_draft");
};
