export const DEFAULT_CURRENCY = "USD";

// Currencies a user can display their donations in.
export const CURRENCIES = [
  { code: "USD", label: "US dollar", symbol: "$" },
  { code: "EUR", label: "Euro", symbol: "€" },
  { code: "GBP", label: "British pound", symbol: "£" },
  { code: "CAD", label: "Canadian dollar", symbol: "CA$" },
  { code: "AUD", label: "Australian dollar", symbol: "A$" },
  { code: "INR", label: "Indian rupee", symbol: "₹" },
  { code: "BRL", label: "Brazilian real", symbol: "R$" },
  { code: "ZAR", label: "South African rand", symbol: "R" },
];

const isCurrency = (code) => CURRENCIES.some((c) => c.code === code);

// The currency a user picked in their profile, falling back to the default.
export const currencyOf = (user) =>
  isCurrency(user?.currency) ? user.currency : DEFAULT_CURRENCY;

export const formatMoney = (value, currency = DEFAULT_CURRENCY) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: isCurrency(currency) ? currency : DEFAULT_CURRENCY,
  }).format(Number(value) || 0);