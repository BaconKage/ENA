import type { EnaState } from "./types";

export interface EnaSignals {
  valence: number;
  energy: number;
  complexity: number;
  novelty: number;
  repetition: number;
  regulation: number;
  unresolvedThreads: number;
}

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));

/**
 * ENA-inspired conversation control. This is an interaction heuristic, not a
 * psychological score. Coefficients are implementation choices, not claims
 * made by the paper.
 */
export function updateEnaState(previous: EnaState, signals: EnaSignals): EnaState {
  const complexity = clamp(signals.complexity);
  const novelty = clamp(signals.novelty);
  const repetition = clamp(signals.repetition);
  const regulation = clamp(signals.regulation);
  const cognitiveCost = 0.4 * complexity + 0.35 * novelty + 0.25 * repetition;
  const nextLoad = clamp(previous.load * 0.82 + cognitiveCost * 0.32 - regulation * 0.26);

  return {
    load: Number(nextLoad.toFixed(3)),
    valence: Number(clamp(signals.valence, -1, 1).toFixed(3)),
    energy: Number(clamp(signals.energy).toFixed(3)),
    unresolvedThreads: Math.round(clamp(signals.unresolvedThreads, 0, 6)),
    turn: previous.turn + 1,
    pace: nextLoad >= 0.68 ? "gentle" : nextLoad >= 0.4 ? "focused" : "open",
  };
}
