import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | Oushi Library",
};

export default function PrivacyPolicyPage() {
    return (
        <main className="container container--md mx-auto px-4 py-12 md:py-20 min-h-screen">
            <div className="card p-8 md:p-12">
                <h1 className="text-3xl md:text-5xl font-display font-bold text-[var(--color-text-primary)] mb-4">
                    Privacy Policy
                </h1>
                <p className="text-sm text-[var(--color-text-tertiary)] mb-8">Last Updated: October 2023</p>

                <div className="prose max-w-none text-[var(--color-text-secondary)] space-y-6">
                    <p>
                        Welcome to Oushi Library. We respect your privacy and are committed to protecting your personal data.
                    </p>

                    <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mt-8 mb-4">1. Information We Collect</h2>
                    <p>
                        We only collect information about you if we have a reason to do so, for example, to provide our Services, to communicate with you, or to make our Services better.
                    </p>

                    <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mt-8 mb-4">2. How We Use Information</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>To provide our Services</li>
                        <li>To fix problems with our Services</li>
                        <li>To personalize your experience</li>
                        <li>To communicate with you</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mt-8 mb-4">3. Security</h2>
                    <p>
                        While no online service is 100% secure, we work very hard to protect information about you against unauthorized access, use, alteration, or destruction.
                    </p>
                </div>
            </div>
        </main>
    );
}
