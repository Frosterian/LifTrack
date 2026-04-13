"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export function RegisterForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          firstName: form.firstName,
          lastName: form.lastName,
          username: form.username,
        },
      },
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({
        type: "success",
        text: "Compte créé. Vérifie ta boîte mail pour confirmer ton adresse.",
      });
    }
    setLoading(false);
  }

  const fieldClass =
    "w-full rounded-[8px] border border-white/10 bg-background-hover px-4 py-2.5 text-text outline-none transition focus:border-accent-primary";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input
          required
          placeholder="Prénom"
          value={form.firstName}
          onChange={(e) => update("firstName", e.target.value)}
          className={fieldClass}
        />
        <input
          required
          placeholder="Nom"
          value={form.lastName}
          onChange={(e) => update("lastName", e.target.value)}
          className={fieldClass}
        />
      </div>
      <input
        required
        placeholder="Username"
        value={form.username}
        onChange={(e) => update("username", e.target.value)}
        className={fieldClass}
      />
      <input
        required
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => update("email", e.target.value)}
        className={fieldClass}
      />
      <input
        required
        minLength={6}
        type="password"
        placeholder="Mot de passe (6+ caractères)"
        value={form.password}
        onChange={(e) => update("password", e.target.value)}
        className={fieldClass}
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-[8px] gradient-accent px-4 py-2.5 font-semibold text-background transition hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "..." : "Créer mon compte"}
      </button>

      {message && (
        <p className={`text-sm ${message.type === "success" ? "text-success" : "text-danger"}`}>
          {message.text}
        </p>
      )}

      <p className="pt-2 text-center text-sm text-text-muted">
        Déjà un compte ?{" "}
        <Link href="/login" className="text-accent-secondary hover:underline">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
