import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { z } from "zod";

import { updateEnaState } from "@/lib/ena";
import { MODE_LABELS, SYSTEM_PROMPT } from "@/lib/prompt";
import { hasUrgentSafetySignal, urgentResponse } from "@/lib/safety";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const memorySchema = z.object({
  currentConcern: z.string().max(240),
  userGoal: z.string().max(240),
  keyPoints: z.array(z.string().max(180)).max(5),
  supports: z.array(z.string().max(180)).max(3),
  tried: z.array(z.string().max(180)).max(3),
  resolved: z.array(z.string().max(180)).max(3),
});

const enaSchema = z.object({
  load: z.number().min(0).max(1),
  valence: z.number().min(-1).max(1),
  energy: z.number().min(0).max(1),
  unresolvedThreads: z.number().min(0).max(6),
  turn: z.number().min(0).max(100),
  pace: z.enum(["open", "focused", "gentle"]),
});

const requestSchema = z.object({
  message: z.string().trim().min(1).max(4000),
  mode: z.enum(["listen", "understand", "plan"]),
  recentMessages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        text: z.string().max(4000),
      }),
    )
    .max(10),
  memory: memorySchema,
  ena: enaSchema,
});

const modelResponseSchema = z.object({
  signals: z.object({
    valence: z.number(),
    energy: z.number(),
    complexity: z.number(),
    novelty: z.number(),
    repetition: z.number(),
    regulation: z.number(),
    unresolvedThreads: z.number(),
  }),
  safety: z.object({
    level: z.enum(["normal", "concern", "urgent"]),
    reasonCode: z.enum(["none", "self_harm", "harm_others", "abuse", "medical"]),
  }),
  memory: memorySchema,
  reply: z.string().min(1).max(1800),
});

const responseSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signals: {
      type: "object",
      additionalProperties: false,
      properties: {
        valence: { type: "number", description: "-1 negative to 1 positive" },
        energy: { type: "number", description: "0 low activation to 1 high activation" },
        complexity: { type: "number", description: "0 to 1" },
        novelty: { type: "number", description: "0 to 1" },
        repetition: { type: "number", description: "0 to 1" },
        regulation: { type: "number", description: "0 to 1; evidence of relief, clarity, or resolution" },
        unresolvedThreads: { type: "number", description: "integer from 0 to 6" },
      },
      required: [
        "valence",
        "energy",
        "complexity",
        "novelty",
        "repetition",
        "regulation",
        "unresolvedThreads",
      ],
    },
    safety: {
      type: "object",
      additionalProperties: false,
      properties: {
        level: { type: "string", enum: ["normal", "concern", "urgent"] },
        reasonCode: {
          type: "string",
          enum: ["none", "self_harm", "harm_others", "abuse", "medical"],
        },
      },
      required: ["level", "reasonCode"],
    },
    memory: {
      type: "object",
      additionalProperties: false,
      properties: {
        currentConcern: { type: "string" },
        userGoal: { type: "string" },
        keyPoints: { type: "array", items: { type: "string" } },
        supports: { type: "array", items: { type: "string" } },
        tried: { type: "array", items: { type: "string" } },
        resolved: { type: "array", items: { type: "string" } },
      },
      required: ["currentConcern", "userGoal", "keyPoints", "supports", "tried", "resolved"],
    },
    reply: { type: "string" },
  },
  required: ["signals", "safety", "memory", "reply"],
};

const noStoreHeaders = { "Cache-Control": "no-store, max-age=0" };

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "That message could not be read." }, { status: 400, headers: noStoreHeaders });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please shorten the message and try again." },
      { status: 400, headers: noStoreHeaders },
    );
  }

  const input = parsed.data;

  if (hasUrgentSafetySignal(input.message)) {
    return NextResponse.json(urgentResponse(input.memory, input.ena), { headers: noStoreHeaders });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ENA is not connected yet. Add GROQ_API_KEY to .env.local." },
      { status: 503, headers: noStoreHeaders },
    );
  }

  const groq = new Groq({ apiKey });
  const model = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
  const fallbackModel = process.env.GROQ_FALLBACK_MODEL || "openai/gpt-oss-20b";
  const conversation = input.recentMessages
    .map((message) => `${message.role === "user" ? "Person" : "ENA"}: ${message.text}`)
    .join("\n\n");

  const prompt = `SUPPORT MODE: ${MODE_LABELS[input.mode]} (${input.mode})
CURRENT CONVERSATION PACE: ${input.ena.pace}
CURRENT ENA INTERACTION STATE: ${JSON.stringify(input.ena)}
CURRENT SESSION MEMORY: ${JSON.stringify(input.memory)}

RECENT CONVERSATION:
${conversation || "No earlier messages in this session."}

LATEST MESSAGE:
${input.message}

Respond to the latest message. Update the compact session memory using explicit facts only. Keep the reply under 170 words; use fewer than 90 words for focused or gentle pace.`;

  try {
    const generate = (modelId: string) =>
      groq.chat.completions.create({
        model: modelId,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        temperature: 0.72,
        max_completion_tokens: 900,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "ena_response",
            strict: true,
            schema: responseSchema,
          },
        },
      });

    let response;
    try {
      response = await generate(model);
    } catch (primaryError) {
      const primaryMessage = primaryError instanceof Error ? primaryError.message : String(primaryError);
      const temporarilyUnavailable = /429|503|rate.?limit|unavailable|high demand/i.test(primaryMessage);
      if (!temporarilyUnavailable || fallbackModel === model) throw primaryError;
      response = await generate(fallbackModel);
    }

    const responseText = response.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error("Empty model response");
    }

    const modelResult = modelResponseSchema.parse(JSON.parse(responseText));
    const nextEna = updateEnaState(input.ena, modelResult.signals);

    if (modelResult.safety.level === "urgent") {
      const urgent = urgentResponse(modelResult.memory, nextEna);
      urgent.safety.reasonCode = modelResult.safety.reasonCode;
      return NextResponse.json(urgent, { headers: noStoreHeaders });
    }

    return NextResponse.json(
      {
        reply: modelResult.reply,
        memory: modelResult.memory,
        ena: nextEna,
        safety: modelResult.safety,
      },
      { headers: noStoreHeaders },
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Groq request failed:", error instanceof Error ? error.message : "unknown error");
    }
    const errorMessage = error instanceof Error ? error.message : "";
    const status = /429|rate.?limit/i.test(errorMessage)
      ? 429
      : /503|unavailable|high demand/i.test(errorMessage)
        ? 503
        : 502;
    const message =
      status === 429
        ? "ENA is receiving a lot of messages right now. Please pause for a moment and try again."
        : status === 503
          ? "ENA is momentarily unavailable. Your session is still safe in this tab—please try again in a minute."
        : "ENA couldn’t respond just now. Your session is still here in this tab—please try again.";

    return NextResponse.json({ error: message }, { status, headers: noStoreHeaders });
  }
}
