export const AI_CONFIG = {
  API_PATH: 'http://localhost:8000/api/therapy/ai-session',
  MODEL: 'gemini-1.5-flash',
  MAX_TOKENS: 2000,
  TEMPERATURE: 0.7,
  TIMEOUT: 30000, // 30 seconds
  DEBUG_MODE: process.env.NODE_ENV !== 'production'
};
