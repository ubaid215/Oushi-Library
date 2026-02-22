import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <main className="min-h-[50vh] flex flex-col items-center justify-center p-8 bg-[var(--color-background)]">
            <Loader2 size={48} className="animate-spin text-[var(--color-dusty-400)] mb-4" />
            <p className="text-[var(--color-text-secondary)] font-medium animate-pulse">Loading content...</p>
        </main>
    );
}
