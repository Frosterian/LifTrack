"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Mode = "magic" | "password";

export function LoginForm() {
  const [mode, setMode] = useState<Mode>("magic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const supabase = createClient();

    try {
      if (mode === "magic") {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setMessage({ type: "success", text: "Vérifie ta boîte mail — le lien magique est envoyé." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Erreur inconnue" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-[8px] border border-white/10 bg-background-hover px-4 py-2.5 text-text outline-none transition focus:border-accent-primary"
          placeholder="ton@email.com"
        />
      </div>

      {mode === "password" && (
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-[8px] border border-white/10 bg-background-hover px-4 py-2.5 text-text outline-none transition focus:border-accent-primary"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-[8px] gradient-accent px-4 py-2.5 font-semibold text-background transition hover:opacity-90 disabled:opacity-50"
      >
        {loading
          ? "..."
          : mode === "magic"
            ? "Envoyer le lien magique"
            : "Se connecter"}
      </button>

      {message && (
        <p
          className={`text-sm ${
            message.type === "success" ? "text-success" : "text-danger"
          }`}
        >
          {message.text}
        </p>
      )}

      <button
        type="button"
        onClick={() => {
          setMode(mode === "magic" ? "password" : "magic");
          setMessage(null);
        }}
        className="block w-full text-center text-sm text-text-muted underline transition hover:text-accent-secondary"
      >
        {mode === "magic" ? "Utiliser un mot de passe" : "Utiliser un lien magique"}
      </button>

      <p className="text-center text-sm text-text-muted">
        Pas de compte ?{" "}
        <Link href="/register" className="text-accent-secondary hover:underline">
          Créer un compte
        </Link>
      </p>
    </form>
  );
}
