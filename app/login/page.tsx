import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
    title: "Login | Oushi Library",
};

export default function LoginPage() {
    return (
        <main className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-background)]">
            <div className="card p-8 max-w-sm w-full mx-auto">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-dusty-400)] to-[var(--color-dusty-600)] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                        <BookOpen size={24} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)]">Welcome Back</h1>
                    <p className="text-[var(--color-text-secondary)] text-sm mt-1">Sign in to your account</p>
                </div>

                <form className="space-y-4">
                    <div className="form-group">
                        <label className="form-label form-label--required">Email Address</label>
                        <input type="email" className="input" placeholder="you@domain.com" required />
                    </div>
                    <div className="form-group">
                        <div className="flex justify-between items-center mb-1">
                            <label className="form-label mb-0 form-label--required">Password</label>
                            <Link href="#" className="text-xs text-[var(--color-dusty-500)] hover:underline">Forgot password?</Link>
                        </div>
                        <input type="password" className="input" placeholder="••••••••" required />
                    </div>

                    <button type="submit" className="btn btn--primary w-full mt-6">
                        Sign In
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-[var(--color-dusty-500)] font-medium hover:underline">
                        Register here
                    </Link>
                </div>
            </div>
        </main>
    );
}
