"use client";

import { useEffect } from "react";
import { AlertOctagon } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--color-background)]">
            <div className="card p-10 max-w-md w-full text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-[var(--color-terracotta-50)] text-[var(--color-terracotta-500)] rounded-full flex items-center justify-center mb-6">
                    <AlertOctagon size={32} />
                </div>
                <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)] mb-4">Something went wrong!</h1>
                <p className="text-[var(--color-text-secondary)] mb-8">
                    An unexpected error occurred. Please try again or contact support if the issue persists.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <button
                        onClick={() => reset()}
                        className="btn btn--primary flex-1 justify-center"
                    >
                        Try again
                    </button>
                    <a href="/" className="btn btn--secondary flex-1 justify-center">
                        Go Home
                    </a>
                </div>
            </div>
        </main>
    );
}
