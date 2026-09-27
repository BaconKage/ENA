export type SupportMode = "listen" | "understand" | "plan";

export type SafetyLevel = "normal" | "concern" | "urgent";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

export interface SessionMemory {
  currentConcern: string;
  userGoal: string;
  keyPoints: string[];
  supports: string[];
  tried: string[];
  resolved: string[];
}

export interface EnaState {
  load: number;
  valence: number;
  energy: number;
  unresolvedThreads: number;
  turn: number;
  pace: "open" | "focused" | "gentle";
}

export interface ChatResponse {
  reply: string;
  memory: SessionMemory;
  ena: EnaState;
  safety: {
    level: SafetyLevel;
    reasonCode: "none" | "self_harm" | "harm_others" | "abuse" | "medical";
  };
}

export const EMPTY_MEMORY: SessionMemory = {
  currentConcern: "",
  userGoal: "",
  keyPoints: [],
  supports: [],
  tried: [],
  resolved: [],
};

export const INITIAL_ENA: EnaState = {
  load: 0.12,
  valence: 0,
  energy: 0.35,
  unresolvedThreads: 0,
  turn: 0,
  pace: "open",
};
