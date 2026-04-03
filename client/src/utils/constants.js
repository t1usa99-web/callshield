export const BRAND = {
  primary: "#1e3a5f",
  accent: "#e8913a",
  success: "#2d9c5a",
  danger: "#c0392b",
  light: "#f4f7fa",
  white: "#ffffff",
  muted: "#6b7c93",
  dark: "#1a1a2e",
  gradient: "linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)",
};

export const STATUS_MAP = {
  logged: { label: "Logged", color: BRAND.muted },
  "complaint-filed": { label: "Complaint Filed", color: BRAND.accent },
  "claim-filed": { label: "Claim Filed", color: BRAND.primary },
  resolved: { label: "Resolved", color: BRAND.success },
};

export const fmtDate = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export const uid = () => {
  return `id_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
};
