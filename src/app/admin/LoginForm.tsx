"use client";

import { useState } from "react";
import { adminLogin } from "@/lib/admin-actions";

export default function LoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    try {
      const success = await adminLogin(password);
      if (success) {
        window.location.href = "/admin";
      } else {
        setError("Mot de passe incorrect");
      }
    } catch {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg)" }}>
      <div className="w-full max-w-sm p-8 rounded-2xl border" style={{ background: "var(--color-card-bg)", borderColor: "var(--color-border)" }}>
        <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: "var(--color-foreground)", fontFamily: "var(--heading-font)" }}>
          Administration
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            required
            className="w-full rounded-lg px-4 min-h-[48px] border text-base mb-4"
            style={{ background: "var(--color-bg)", color: "var(--color-foreground)", borderColor: "var(--color-border)" }}
          />
          {error && (
            <p className="text-sm mb-4" style={{ color: "#ef4444" }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-semibold min-h-[48px]"
            style={{ background: "var(--color-accent)", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Connexion..." : "Connexion"}
          </button>
        </form>
      </div>
    </main>
  );
}
