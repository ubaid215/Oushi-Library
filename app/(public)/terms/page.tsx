import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | Oushi Library",
};

export default function TermsPage() {
    return (
        <main className="container container--md mx-auto px-4 py-12 md:py-20 min-h-screen">
            <div className="card p-8 md:p-12">
                <h1 className="text-3xl md:text-5xl font-display font-bold text-[var(--color-text-primary)] mb-4">
                    Terms of Service
                </h1>
                <p className="text-sm text-[var(--color-text-tertiary)] mb-8">Last Updated: October 2023</p>

                <div className="prose max-w-none text-[var(--color-text-secondary)] space-y-6">
                    <p>
                        Please read these Terms of Service carefully before using the Oushi Library website.
                    </p>

                    <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mt-8 mb-4">1. Acceptance of Terms</h2>
                    <p>
                        By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.
                    </p>

                    <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mt-8 mb-4">2. Use of Content</h2>
                    <p>
                        All content provided on this website is for informational and educational purposes only. The books and fatawa remain the intellectual property of their respective authors and publishers. You may not distribute, modify, transmit, reuse, or use the content for commercial purposes without written permission.
                    </p>

                    <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mt-8 mb-4">3. Accounts</h2>
                    <p>
                        When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms.
                    </p>
                </div>
            </div>
        </main>
    );
}
