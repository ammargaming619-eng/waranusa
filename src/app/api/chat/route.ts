/**
 * WaraNusa AI Assistant Route (Forwarder / Re-export)
 * Seluruh logika dipusatkan di /api/ai/chat/route.ts untuk eliminasi mock responses
 * dan integrasi langsung ke Google Generative AI (Gemini 1.5 Flash).
 */
export { POST, dynamic } from "../ai/chat/route";
