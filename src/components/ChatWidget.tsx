"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const CHIPS = [
  "Buy a flat in Dhaka",
  "Office space in Banani",
  "Properties under ৳1 Crore",
  "I want to sell my property",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hello! I'm Mustaraka AI. Tell me what you're looking for and I'll find the perfect property for you.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    function handleOpen() { setOpen(true); }
    window.addEventListener("mustaraka:openChat", handleOpen);
    return () => window.removeEventListener("mustaraka:openChat", handleOpen);
  }, []);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setInput("");
    const newHistory: Message[] = [...messages, { role: "user", text: trimmed }];
    setMessages(newHistory);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.reply ?? "Sorry, something went wrong." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, I couldn't connect. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const showChips = messages.length <= 1 && !loading;

  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-4">

      {/* ── Chat panel ─────────────────────────────────────────────────────── */}
      {open && (
        <div
          className="w-[min(320px,calc(100vw-1.5rem))] sm:w-[380px] flex flex-col bg-[#111] border border-gold/30 overflow-hidden animate-slide-up"
          style={{
            height: "min(580px, calc(100dvh - 100px))",
            boxShadow: "0 24px 64px rgba(0,0,0,0.85), 0 0 0 1px rgba(201,168,76,0.08)",
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gold/15 bg-[#0d0d0d] flex-shrink-0">
            {/* Gold avatar */}
            <div
              className="w-10 h-10 rounded-full bg-gold flex items-center justify-center flex-shrink-0"
              style={{ boxShadow: "0 0 14px rgba(201,168,76,0.45)" }}
            >
              <span className="font-heading text-brand-bg text-[18px] italic font-semibold leading-none">
                M
              </span>
            </div>

            {/* Title + status */}
            <div className="flex-1 min-w-0">
              <p className="font-heading text-brand-text text-[18px] font-normal leading-none tracking-wide">
                Mustaraka AI
              </p>
              <p className="flex items-center gap-1.5 font-body text-[11px] text-[#4ade80] mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] flex-shrink-0" />
                Online 24/7
              </p>
            </div>

            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 flex items-center justify-center text-brand-muted hover:text-brand-text transition-colors text-[22px] leading-none flex-shrink-0"
              aria-label="Close chat"
            >
              &times;
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" ? (
                  <div className="max-w-[84%] bg-brand-surface border-l-2 border-gold px-3.5 py-2.5 font-body text-[13px] leading-relaxed text-brand-text">
                    {m.text}
                  </div>
                ) : (
                  <div className="max-w-[84%] bg-gold px-3.5 py-2.5 font-body text-[13px] leading-relaxed text-brand-bg font-medium">
                    {m.text}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-brand-surface border-l-2 border-gold px-4 py-3.5 flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-full bg-gold animate-type-dot"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestion chips — visible only before first user message */}
          {showChips && (
            <div
              className="flex gap-2 px-4 py-2.5 border-t border-gold/10 overflow-x-auto flex-shrink-0"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
            >
              {CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => sendMessage(chip)}
                  className="flex-shrink-0 px-3 py-1.5 bg-gold/8 border border-gold/25 text-gold font-body text-[11px] whitespace-nowrap hover:bg-gold/18 hover:border-gold/50 transition-colors duration-200"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Input row */}
          <div className="border-t border-gold/15 px-3 py-3 flex gap-2 bg-[#0d0d0d] flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="Ask about properties…"
              className="flex-1 bg-brand-surface border border-gold/15 text-brand-text placeholder:text-brand-muted/40 font-body text-[13px] px-3.5 py-2.5 focus:outline-none focus:border-gold/50 transition-colors"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="w-10 h-10 bg-gold hover:bg-gold-light disabled:opacity-40 text-brand-bg flex items-center justify-center flex-shrink-0 transition-colors duration-200"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-[15px] h-[15px]"
              >
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22 11 13 2 9l20-7z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── FAB ────────────────────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open AI property assistant"}
        className="w-16 h-16 rounded-full bg-gold hover:scale-110 text-brand-bg flex items-center justify-center transition-transform duration-200 animate-pulse-gold"
      >
        {open ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
