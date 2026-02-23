import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About | Oushi Library",
    description: "About Oushi Islamic Library",
};

export default function AboutPage() {
    return (
        <main className="container container--md mx-auto px-4 py-12 md:py-20 min-h-screen">
            <div className="card p-8 md:p-12 text-center md:text-left">
                <h1 className="text-3xl md:text-5xl font-display font-bold text-[var(--color-text-primary)] mb-6">
                    About Oushi Library
                </h1>
                <div className="prose max-w-none text-[var(--color-text-secondary)] space-y-6 text-base md:text-lg leading-relaxed">
                    <p>
                        {/* TODO: Replace with actual organization information */}
                        Welcome to Oushi Library. We are dedicated to providing accessible Islamic knowledge,
                        curating a comprehensive collection of books, academic papers, and fatawa from
                        recognized scholars across the globe.
                    </p>
                    <p>
                        Our mission is to digitalize authentic Islamic literature to make it universally
                        available for researchers, students, and the general public.
                    </p>
                    <div className="bg-[var(--color-sage-50)] border-l-4 border-[var(--color-sage-400)] p-6 rounded-r-lg mt-8 text-left">
                        <h3 className="font-display font-semibold text-xl text-[var(--color-text-primary)] mb-2">Our Vision</h3>
                        <p className="text-[var(--color-text-secondary)]">
                            {/* TODO: Add vision statement */}
                            To become the leading digital repository for Islamic heritage and contemporary scholarly works.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
