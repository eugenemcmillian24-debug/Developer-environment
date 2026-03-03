export const APP_NAME = "DevBase";
export const APP_VERSION = "2.0.0";
export const APP_DESCRIPTION = "AI-powered mobile development environment";

export const STORAGE_KEYS = {
  GUIDE_PROGRESS: "devbase:guide:progress",
  AI_SETTINGS: "devbase:ai:settings",
  CHAT_HISTORY: "devbase:chat:history",
  ACTIVE_TAB: "devbase:ui:active-tab",
} as const;

export const PHASE_COLORS = {
  1: { accent: "#00ff88", bg: "rgba(0,255,136,0.1)", border: "#00ff88" },
  2: { accent: "#00c6ff", bg: "rgba(0,198,255,0.1)", border: "#00c6ff" },
  3: { accent: "#ff6b6b", bg: "rgba(255,107,107,0.1)", border: "#ff6b6b" },
  4: { accent: "#ffd93d", bg: "rgba(255,217,61,0.1)", border: "#ffd93d" },
  5: { accent: "#bd93f9", bg: "rgba(189,147,249,0.1)", border: "#bd93f9" },
  6: { accent: "#ffb86c", bg: "rgba(255,184,108,0.1)", border: "#ffb86c" },
} as const;

export const MAX_CHAT_HISTORY = 50;
export const TOAST_DURATION = 2500;
