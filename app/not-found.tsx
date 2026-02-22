import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--color-background)]">
            <div className="card p-10 max-w-md w-full text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-[var(--color-terracotta-50)] text-[var(--color-terracotta-500)] rounded-full flex items-center justify-center mb-6">
                    <AlertTriangle size={32} />
                </div>
                <h1 className="text-4xl font-display font-bold text-[var(--color-text-primary)] mb-2">404</h1>
                <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Page Not Found</h2>
                <p className="text-[var(--color-text-secondary)] mb-8">
                    Sorry, we couldn't find the page you're looking for. It might have been moved or removed.
                </p>
                <Link href="/" className="btn btn--primary w-full justify-center">
                    Return Home
                </Link>
            </div>
        </main>
    );
}
