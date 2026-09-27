import { describe, expect, it } from "vitest";

import { updateEnaState } from "./ena";
import { INITIAL_ENA } from "./types";

describe("updateEnaState", () => {
  it("raises conversation load when a message is complex and unresolved", () => {
    const next = updateEnaState(INITIAL_ENA, {
      valence: -0.7,
      energy: 0.8,
      complexity: 1,
      novelty: 0.9,
      repetition: 0.7,
      regulation: 0,
      unresolvedThreads: 4,
    });

    expect(next.load).toBeGreaterThan(INITIAL_ENA.load);
    expect(next.turn).toBe(1);
    expect(next.unresolvedThreads).toBe(4);
  });

  it("reduces load when the conversation shows regulation and resolution", () => {
    const next = updateEnaState(
      { ...INITIAL_ENA, load: 0.72, pace: "gentle" },
      {
        valence: 0.2,
        energy: 0.3,
        complexity: 0.1,
        novelty: 0,
        repetition: 0,
        regulation: 1,
        unresolvedThreads: 0,
      },
    );

    expect(next.load).toBeLessThan(0.72);
    expect(next.pace).toBe("open");
  });

  it("clamps model-provided signals to safe ranges", () => {
    const next = updateEnaState(INITIAL_ENA, {
      valence: -8,
      energy: 5,
      complexity: 5,
      novelty: 5,
      repetition: 5,
      regulation: -2,
      unresolvedThreads: 99,
    });

    expect(next.valence).toBe(-1);
    expect(next.energy).toBe(1);
    expect(next.unresolvedThreads).toBe(6);
    expect(next.load).toBeLessThanOrEqual(1);
  });
});
