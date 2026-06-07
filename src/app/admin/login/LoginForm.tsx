"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (!result?.ok || result?.error) {
      setError("Invalid email or password.");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block font-body text-[11px] tracking-[0.2em] text-brand-muted uppercase mb-2">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full bg-brand-bg border border-gold/20 px-4 py-3 font-body text-sm text-brand-text placeholder-brand-muted/50 focus:outline-none focus:border-gold/50 transition-colors"
          placeholder="admin@example.com"
        />
      </div>

      <div>
        <label className="block font-body text-[11px] tracking-[0.2em] text-brand-muted uppercase mb-2">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full bg-brand-bg border border-gold/20 px-4 py-3 font-body text-sm text-brand-text placeholder-brand-muted/50 focus:outline-none focus:border-gold/50 transition-colors"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <p className="font-body text-xs text-red-400 tracking-wide">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gold text-brand-bg font-body text-xs font-medium tracking-[0.2em] uppercase py-3.5 hover:bg-gold-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
      >
        {loading ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
