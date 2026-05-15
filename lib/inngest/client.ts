import { Inngest } from "inngest";

const geminiApiKey = process.env.GEMINI_API_KEY;
const inngestEventKey = process.env.INNGEST_EVENT_KEY;
const inngestSigningKey = process.env.INNGEST_SIGNING_KEY;
const inngestSigningKeyFallback = process.env.INNGEST_SIGNING_KEY_FALLBACK;
const inngestApiBaseUrl = process.env.INNGEST_API_BASE_URL;
const inngestDev = process.env.INNGEST_DEV;

export const inngest = new Inngest({
    id: "MarketPulse",
    ai: { gemini: { apiKey: geminiApiKey } },
    eventKey: inngestEventKey,
    signingKey: inngestSigningKey,
    signingKeyFallback: inngestSigningKeyFallback,
    baseUrl: inngestApiBaseUrl,
    env: process.env.INNGEST_ENV,
    isDev: inngestDev === "1" || inngestDev === "true",
});