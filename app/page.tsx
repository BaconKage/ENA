"use client";

import {
  ArrowRight,
  Brain,
  Check,
  ChevronDown,
  Ear,
  HeartHandshake,
  Lightbulb,
  LockKeyhole,
  NotebookPen,
  RefreshCw,
  Send,
  ShieldCheck,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { MODE_LABELS } from "@/lib/prompt";
import {
  EMPTY_MEMORY,
  INITIAL_ENA,
  type ChatMessage,
  type ChatResponse,
  type EnaState,
  type SessionMemory,
  type SupportMode,
} from "@/lib/types";

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "assistant",
  text: "You don’t need to have the right words. Start wherever feels easiest—I’ll stay with one thing at a time.",
};

const modes: Array<{
  id: SupportMode;
  title: string;
  description: string;
  icon: typeof Ear;
}> = [
  { id: "listen", title: "Just listen", description: "Give me room to say it", icon: Ear },
  { id: "understand", title: "Help me understand", description: "Untangle what I’m feeling", icon: Lightbulb },
  { id: "plan", title: "Help me plan", description: "Find one small next step", icon: NotebookPen },
];

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function MemoryList({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;

  return (
    <div className="memory-group">
      <span>{title}</span>
      <ul>
        {items.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function MemoryDetails({
  memory,
  hasMemory,
  onForget,
}: {
  memory: SessionMemory;
  hasMemory: boolean;
  onForget: () => void;
}) {
  if (!hasMemory) {
    return (
      <div className="empty-memory-state">
        <NotebookPen size={20} />
        <p>Helpful details will appear here as you talk.</p>
        <span>These notes exist only in this tab and disappear when the session ends.</span>
      </div>
    );
  }

  return (
    <>
      {memory.currentConcern && (
        <div className="memory-group memory-highlight">
          <span>What feels important right now</span>
          <p>{memory.currentConcern}</p>
        </div>
      )}
      {memory.userGoal && (
        <div className="memory-group memory-highlight goal">
          <span>What you want from this session</span>
          <p>{memory.userGoal}</p>
        </div>
      )}
      <MemoryList title="Key things you shared" items={memory.keyPoints} />
      <MemoryList title="Support around you" items={memory.supports} />
      <MemoryList title="Things you have tried" items={memory.tried} />
      <MemoryList title="Topics already resolved" items={memory.resolved} />
      <div className="memory-privacy-note">
        <LockKeyhole size={14} />
        <span>Only a short summary is kept—not a hidden profile.</span>
      </div>
      <button className="forget-button" onClick={onForget}>
        <RefreshCw size={15} /> Clear all session notes
      </button>
    </>
  );
}

function PaceCard({ ena }: { ena: EnaState }) {
  const content = {
    open: {
      title: "Open conversation",
      detail: "There’s room to explore.",
      width: "34%",
    },
    focused: {
      title: "Focused conversation",
      detail: "Keeping to one clear thread.",
      width: "62%",
    },
    gentle: {
      title: "Gentle pace",
      detail: "Shorter replies, one thing at a time.",
      width: "86%",
    },
  }[ena.pace];

  return (
    <section className="side-card pace-card" aria-labelledby="pace-title">
      <div className="card-heading">
        <div className="heading-icon soft-green"><Brain size={17} /></div>
        <div>
          <p className="eyebrow">Conversation rhythm</p>
          <h2 id="pace-title">{content.title}</h2>
        </div>
      </div>
      <div className="pace-track" aria-hidden="true">
        <span style={{ width: content.width }} />
      </div>
      <p className="card-note">{content.detail} This guides ENA’s replies; it is not an assessment of you.</p>
    </section>
  );
}

export default function Home() {
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState<SupportMode>("listen");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [privacyConfirmed, setPrivacyConfirmed] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [memory, setMemory] = useState<SessionMemory>(EMPTY_MEMORY);
  const [ena, setEna] = useState<EnaState>(INITIAL_ENA);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [showUrgentHelp, setShowUrgentHelp] = useState(false);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [showMemory, setShowMemory] = useState(true);
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasMemory = useMemo(
    () =>
      Boolean(
        memory.currentConcern ||
          memory.userGoal ||
          memory.keyPoints.length ||
          memory.supports.length ||
          memory.tried.length ||
          memory.resolved.length,
      ),
    [memory],
  );

  const memoryItemCount = useMemo(
    () =>
      Number(Boolean(memory.currentConcern)) +
      Number(Boolean(memory.userGoal)) +
      memory.keyPoints.length +
      memory.supports.length +
      memory.tried.length +
      memory.resolved.length,
    [memory],
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, sending]);

  useEffect(() => {
    if (!started) return;
    const timeout = window.setTimeout(() => endSession(), 30 * 60 * 1000);
    return () => window.clearTimeout(timeout);
    // Reset the expiry whenever the conversation changes.
  }, [started, messages.length]);

  function startSession() {
    if (!ageConfirmed || !privacyConfirmed) return;
    setStarted(true);
    window.setTimeout(() => textareaRef.current?.focus(), 100);
  }

  function endSession() {
    setMessages([WELCOME]);
    setMemory(EMPTY_MEMORY);
    setEna(INITIAL_ENA);
    setDraft("");
    setError("");
    setSending(false);
    setStarted(false);
    setShowEndDialog(false);
    setAgeConfirmed(false);
    setPrivacyConfirmed(false);
  }

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;

    const userMessage: ChatMessage = { id: makeId(), role: "user", text };
    const recentMessages = messages
      .filter((message) => message.id !== "welcome")
      .slice(-9)
      .map(({ role, text: content }) => ({ role, text: content }));

    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setSending(true);
    setError("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ message: text, mode, recentMessages, memory, ena }),
      });

      const data = (await response.json()) as ChatResponse | { error: string };
      if (!response.ok || "error" in data) {
        throw new Error("error" in data ? data.error : "Something interrupted the reply.");
      }

      setMessages((current) => [
        ...current,
        { id: makeId(), role: "assistant", text: data.reply },
      ]);
      setMemory(data.memory);
      setEna(data.ena);

      if (data.safety.level === "urgent") {
        setShowUrgentHelp(true);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "ENA couldn’t reply just now.");
      setDraft(text);
    } finally {
      setSending(false);
      window.setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }

  function handleComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  if (!started) {
    return (
      <main className="welcome-page">
        <header className="landing-header">
          <a className="brand" href="#top" aria-label="ENA home">
            <span className="brand-mark"><Image src="/ena-logo.png" width={44} height={44} alt="" priority /></span>
            <span>ENA</span>
          </a>
          <button className="help-link" onClick={() => setShowUrgentHelp(true)}>
            <TriangleAlert size={16} /> Need urgent help?
          </button>
        </header>

        <section className="welcome-grid" id="top">
          <div className="welcome-copy">
            <div className="intro-pill"><HeartHandshake size={15} /> A quieter kind of conversation</div>
            <h1>A place to put down what you’re carrying.</h1>
            <p className="welcome-lede">
              ENA listens without rushing you. Share a little or a lot, and we’ll keep the conversation clear, gentle, and focused on what you need right now.
            </p>
            <div className="trust-row">
              <div><LockKeyhole size={19} /><span><strong>Session only</strong>Your chat clears when you leave</span></div>
              <div><HeartHandshake size={19} /><span><strong>You set the pace</strong>Listen, understand, or plan</span></div>
            </div>
          </div>

          <div className="start-card">
            <div className="step-label"><span>1</span> What would feel helpful?</div>
            <div className="mode-grid" role="radiogroup" aria-label="Choose support style">
              {modes.map((item) => {
                const Icon = item.icon;
                const selected = mode === item.id;
                return (
                  <button
                    key={item.id}
                    className={`mode-card ${selected ? "selected" : ""}`}
                    onClick={() => setMode(item.id)}
                    role="radio"
                    aria-checked={selected}
                  >
                    <span className="mode-icon"><Icon size={20} /></span>
                    <span><strong>{item.title}</strong><small>{item.description}</small></span>
                    <span className="radio-dot">{selected && <Check size={13} />}</span>
                  </button>
                );
              })}
            </div>

            <div className="divider" />
            <div className="step-label"><span>2</span> Before we begin</div>
            <div className="privacy-callout">
              <ShieldCheck size={20} />
              <div>
                <p>
                  This prototype keeps no chat history. Messages are sent to GroqCloud to generate replies. Groq says inference content is not retained by default, but it may be temporarily logged for reliability or abuse monitoring unless Zero Data Retention is enabled. Avoid names, addresses, or identifying details.
                </p>
                <span className="inline-legal-links"><Link href="/privacy">Privacy notice</Link><Link href="/terms">Prototype terms</Link></span>
              </div>
            </div>
            <label className="check-row">
              <input type="checkbox" checked={ageConfirmed} onChange={(event) => setAgeConfirmed(event.target.checked)} />
              <span className="custom-check"><Check size={13} /></span>
              <span>I confirm that I am 18 or older.</span>
            </label>
            <label className="check-row">
              <input type="checkbox" checked={privacyConfirmed} onChange={(event) => setPrivacyConfirmed(event.target.checked)} />
              <span className="custom-check"><Check size={13} /></span>
              <span>I have read the notices and understand this is a prototype—not therapy or emergency care.</span>
            </label>

            <button className="primary-button" disabled={!ageConfirmed || !privacyConfirmed} onClick={startSession}>
              Begin my session <ArrowRight size={18} />
            </button>
            <p className="microcopy">Nothing from this session is saved by ENA.</p>
          </div>
        </section>

        <footer className="landing-legal">
          <span>Experimental prototype · Not therapy or emergency care</span>
          <nav aria-label="Legal information"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></nav>
        </footer>

        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        {showUrgentHelp && <UrgentHelp onClose={() => setShowUrgentHelp(false)} />}
      </main>
    );
  }

  return (
    <main className="app-page">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark"><Image src="/ena-logo.png" width={42} height={42} alt="" priority /></span>
          <span>ENA</span>
          <span className="session-badge"><span /> Session only</span>
        </div>
        <div className="header-actions">
          <nav className="header-legal" aria-label="Legal information"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></nav>
          <button className="help-link" onClick={() => setShowUrgentHelp(true)}><TriangleAlert size={15} /> Urgent help</button>
          <button className="quiet-button" onClick={() => setShowEndDialog(true)}><Trash2 size={15} /> End session</button>
        </div>
      </header>

      <div className="app-shell">
        <aside className="sidebar">
          <section className="side-card mode-switcher">
            <p className="eyebrow">Choose how ENA helps</p>
            <div className="compact-modes">
              {modes.map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.id} className={mode === item.id ? "active" : ""} onClick={() => setMode(item.id)}>
                    <Icon size={16} /> {item.title}
                  </button>
                );
              })}
            </div>
          </section>

          <PaceCard ena={ena} />

          <section className="side-card memory-card">
            <button className="memory-toggle" onClick={() => setShowMemory((value) => !value)} aria-expanded={showMemory}>
              <span className="card-heading">
                <span className="heading-icon soft-peach"><NotebookPen size={17} /></span>
                <span>
                  <span className="eyebrow">Session notes · {memoryItemCount} {memoryItemCount === 1 ? "item" : "items"}</span>
                  <strong>What I’m keeping in mind</strong>
                </span>
              </span>
              <ChevronDown className={showMemory ? "rotated" : ""} size={17} />
            </button>
            {showMemory && (
              <div className="memory-content">
                <MemoryDetails memory={memory} hasMemory={hasMemory} onForget={() => setMemory(EMPTY_MEMORY)} />
              </div>
            )}
          </section>

          <div className="mobile-session-bar">
            <button onClick={() => setShowNotesDialog(true)}>
              <NotebookPen size={17} />
              <span>Session notes</span>
              <strong>{memoryItemCount}</strong>
            </button>
            <div>
              <Brain size={17} />
              <span>{ena.pace === "open" ? "Open pace" : ena.pace === "focused" ? "Focused pace" : "Gentle pace"}</span>
            </div>
          </div>
        </aside>

        <section className="chat-panel" aria-label="Conversation with ENA">
          <div className="chat-heading">
            <div>
              <p className="eyebrow">{MODE_LABELS[mode]}</p>
              <h1>What’s on your mind?</h1>
            </div>
            <span className="boundary-pill">Support, not therapy</span>
          </div>

          <div className="messages" aria-live="polite">
            {messages.map((message) => (
              <div key={message.id} className={`message-row ${message.role}`}>
                {message.role === "assistant" && <span className="assistant-avatar"><Image src="/ena-logo.png" width={27} height={27} alt="" /></span>}
                <div className="message-wrap">
                  {message.role === "assistant" && <span className="message-name">ENA</span>}
                  <div className="message-bubble">{message.text}</div>
                </div>
              </div>
            ))}
            {sending && (
              <div className="message-row assistant">
                <span className="assistant-avatar"><Image src="/ena-logo.png" width={27} height={27} alt="" /></span>
                <div className="message-wrap">
                  <span className="message-name">ENA</span>
                  <div className="message-bubble typing" aria-label="ENA is thinking"><span /><span /><span /></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="composer-area">
            {error && <div className="error-message"><TriangleAlert size={16} />{error}</div>}
            <form className="composer" onSubmit={sendMessage}>
              <textarea
                ref={textareaRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value.slice(0, 4000))}
                onKeyDown={handleComposerKeyDown}
                placeholder={mode === "listen" ? "Say whatever you need to say…" : mode === "understand" ? "What feels tangled right now?" : "What would you like help moving forward with?"}
                rows={1}
                aria-label="Your message"
                disabled={sending}
              />
              <button type="submit" className="send-button" disabled={!draft.trim() || sending} aria-label="Send message"><Send size={18} /></button>
            </form>
            <div className="composer-meta">
              <span><LockKeyhole size={12} /> Cleared when your session ends</span>
              <span>Enter to send · Shift + Enter for a new line</span>
            </div>
          </div>
        </section>
      </div>

      {showUrgentHelp && <UrgentHelp onClose={() => setShowUrgentHelp(false)} />}
      {showNotesDialog && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowNotesDialog(false)}>
          <section className="notes-dialog" role="dialog" aria-modal="true" aria-labelledby="notes-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowNotesDialog(false)} aria-label="Close session notes"><X size={19} /></button>
            <div className="notes-dialog-heading">
              <span className="heading-icon soft-peach"><NotebookPen size={19} /></span>
              <div>
                <p className="eyebrow">Session only · {memoryItemCount} {memoryItemCount === 1 ? "item" : "items"}</p>
                <h2 id="notes-title">What ENA is keeping in mind</h2>
              </div>
            </div>
            <p className="notes-intro">This is the complete summary ENA uses to stay consistent during this conversation.</p>
            <div className="notes-dialog-content">
              <MemoryDetails memory={memory} hasMemory={hasMemory} onForget={() => setMemory(EMPTY_MEMORY)} />
            </div>
          </section>
        </div>
      )}
      {showEndDialog && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowEndDialog(false)}>
          <div className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="end-title" onMouseDown={(event) => event.stopPropagation()}>
            <span className="dialog-icon"><Trash2 size={22} /></span>
            <h2 id="end-title">End this session?</h2>
            <p>Your conversation and everything ENA is keeping in mind will be cleared from this tab.</p>
            <div className="dialog-actions">
              <button className="quiet-button" onClick={() => setShowEndDialog(false)}>Keep talking</button>
              <button className="danger-button" onClick={endSession}>End and clear</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function UrgentHelp({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div className="urgent-dialog" role="dialog" aria-modal="true" aria-labelledby="urgent-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close urgent help"><X size={19} /></button>
        <span className="urgent-icon"><TriangleAlert size={24} /></span>
        <p className="eyebrow">Immediate support</p>
        <h2 id="urgent-title">If you may be in danger right now</h2>
        <p>ENA is not an emergency service. Contact your local emergency service or go to the nearest emergency department. If possible, call a trusted person and ask them to stay with you.</p>
        <a className="crisis-link" href="https://findahelpline.com" target="_blank" rel="noreferrer">Find a verified crisis line for your country <ArrowRight size={17} /></a>
        <p className="urgent-note">If making a call feels difficult, send someone this: “I don’t feel safe alone right now. Can you stay with me?”</p>
      </div>
    </div>
  );
}
