import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
    title: "Register | Oushi Library",
};

export default function RegisterPage() {
    return (
        <main className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-background)] py-12">
            <div className="card p-8 max-w-md w-full mx-auto">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-sage-400)] to-[var(--color-sage-600)] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                        <BookOpen size={24} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)]">Create an Account</h1>
                    <p className="text-[var(--color-text-secondary)] text-sm mt-1">Join the Oushi Library community</p>
                </div>

                <form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="form-group">
                            <label className="form-label form-label--required">First Name</label>
                            <input type="text" className="input" placeholder="Ahmed" required />
                        </div>
                        <div className="form-group">
                            <label className="form-label form-label--required">Last Name</label>
                            <input type="text" className="input" placeholder="Khan" required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label form-label--required">Email Address</label>
                        <input type="email" className="input" placeholder="you@domain.com" required />
                    </div>
                    <div className="form-group">
                        <label className="form-label form-label--required">Password</label>
                        <input type="password" className="input" placeholder="Min. 8 characters" required />
                    </div>
                    <div className="form-group">
                        <label className="checkbox-item mt-2">
                            <input type="checkbox" required />
                            <span className="checkbox-item__label text-xs">
                                I agree to the <Link href="/terms" className="text-[var(--color-sage-600)] hover:underline">Terms</Link> and <Link href="/privacy" className="text-[var(--color-sage-600)] hover:underline">Privacy Policy</Link>
                            </span>
                        </label>
                    </div>

                    <button type="submit" className="btn btn--primary bg-[var(--color-sage-500)] hover:bg-[var(--color-sage-600)] border-none w-full mt-6">
                        Create Account
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
                    Already have an account?{" "}
                    <Link href="/login" className="text-[var(--color-sage-600)] font-medium hover:underline">
                        Sign In
                    </Link>
                </div>
            </div>
        </main>
    );
}
