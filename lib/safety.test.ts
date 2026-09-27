import { describe, expect, it } from "vitest";

import { hasUrgentSafetySignal, urgentResponse } from "./safety";
import { EMPTY_MEMORY, INITIAL_ENA } from "./types";

describe("safety routing", () => {
  it("recognizes direct urgent statements without sending them to the model", () => {
    expect(hasUrgentSafetySignal("I am going to hurt myself")).toBe(true);
    expect(hasUrgentSafetySignal("I can't stay safe tonight")).toBe(true);
  });

  it("does not route ordinary distress through the deterministic emergency response", () => {
    expect(hasUrgentSafetySignal("I feel overwhelmed by work and need to talk")).toBe(false);
  });

  it("returns a reviewed response that preserves only in-memory state", () => {
    const result = urgentResponse(EMPTY_MEMORY, INITIAL_ENA);

    expect(result.safety.level).toBe("urgent");
    expect(result.reply).toContain("immediate safety");
    expect(result.ena.pace).toBe("gentle");
  });
});
