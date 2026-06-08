"use client";

export default function OpenChatButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("mustaraka:openChat"))}
      className={className}
    >
      Talk to AI Matchmaker
    </button>
  );
}
