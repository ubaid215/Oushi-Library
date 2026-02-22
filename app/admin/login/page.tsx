"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, BookOpen, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      toast.error("Invalid email or password");
    } else {
      toast.success("Welcome back!");
      window.location.href = "/admin";
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/admin" });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(160deg, var(--color-parchment-50) 60%, var(--color-dusty-50))",
        padding: "var(--space-6)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, var(--color-dusty-100), transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-80px",
          left: "-80px",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, var(--color-parchment-200), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: 420,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "var(--space-10)" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "var(--radius-xl)",
              background: "linear-gradient(135deg, var(--color-dusty-400), var(--color-dusty-600))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto var(--space-4)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <BookOpen size={26} color="white" />
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-3xl)",
              fontWeight: 700,
              color: "var(--color-text-primary)",
              letterSpacing: "var(--tracking-tight)",
            }}
          >
            Oushi Books
          </h1>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-tertiary)", marginTop: "var(--space-1)" }}>
            Admin Dashboard
          </p>
        </div>

        {/* Card */}
        <div
          className="card"
          style={{ boxShadow: "var(--shadow-xl)" }}
        >
          <div className="card__body" style={{ padding: "var(--space-8)" }}>
            {/* Error */}
            {error && (
              <div className="alert alert--error" style={{ marginBottom: "var(--space-5)" }}>
                <div className="alert__content">
                  <p style={{ fontSize: "var(--text-sm)" }}>
                    {error === "not_authorized"
                      ? "Your Google account is not authorized. Contact the Super Admin."
                      : "Authentication failed. Please try again."}
                  </p>
                </div>
              </div>
            )}

            {/* Google */}
            <button
              onClick={handleGoogle}
              disabled={googleLoading}
              className="btn btn--secondary btn--full"
              style={{ marginBottom: "var(--space-6)", gap: "var(--space-3)" }}
            >
              {googleLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              Continue with Google
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-4)",
                marginBottom: "var(--space-6)",
              }}
            >
              <div style={{ flex: 1, height: 1, background: "var(--color-border-subtle)" }} />
              <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", fontWeight: 500 }}>
                or sign in with email
              </span>
              <div style={{ flex: 1, height: 1, background: "var(--color-border-subtle)" }} />
            </div>

            {/* Credentials form */}
            <form onSubmit={handleCredentials} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="admin@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input input--icon-right"
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="input-icon input-icon--right"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn--primary btn--full"
                style={{ marginTop: "var(--space-2)" }}
              >
                {loading ? <Loader2 size={15} className="animate-spin" /> : null}
                Sign In
              </button>
            </form>
          </div>
        </div>

        <p
          style={{
            textAlign: "center",
            fontSize: "var(--text-xs)",
            color: "var(--color-text-tertiary)",
            marginTop: "var(--space-6)",
          }}
        >
          Access restricted to authorized administrators only.
        </p>
      </div>
    </div>
  );
}
