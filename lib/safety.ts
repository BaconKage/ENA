import type { ChatResponse, EnaState, SessionMemory } from "./types";

const urgentPatterns = [
  /\b(kill|hurt|harm)\s+(myself|me)\b/i,
  /\b(end|take)\s+my\s+(life|own life)\b/i,
  /\b(suicid(?:e|al)|self[- ]?harm)\b/i,
  /\b(overdose|cannot stay safe|can't stay safe)\b/i,
  /\b(kill|seriously hurt|attack)\s+(him|her|them|someone)\b/i,
  /\b(in immediate danger|someone is going to hurt me)\b/i,
];

export function hasUrgentSafetySignal(message: string) {
  return urgentPatterns.some((pattern) => pattern.test(message));
}

export function urgentResponse(memory: SessionMemory, ena: EnaState): ChatResponse {
  return {
    reply:
      "I’m really glad you said this out loud. Your immediate safety matters more than continuing the conversation here. Are you in immediate danger right now? If yes, please contact your local emergency service or go to the nearest emergency department now. If you can, call or move toward a trusted person nearby and tell them plainly that you need them to stay with you. You can also find a verified crisis line for your country at findahelpline.com.\n\nPlease reply with just one thing: “I’m in immediate danger” or “I’m safe for the next few minutes.”",
    memory,
    ena: { ...ena, pace: "gentle", turn: ena.turn + 1 },
    safety: { level: "urgent", reasonCode: "self_harm" },
  };
}
