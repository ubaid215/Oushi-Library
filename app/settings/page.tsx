import type { Metadata } from "next";
import Link from "next/link";
import { User, Bell, Shield, Settings as SettingsIcon } from "lucide-react";

export const metadata: Metadata = {
    title: "Settings | Oushi Library",
};

export default function UserSettingsPage() {
    return (
        <main className="container container--lg mx-auto px-4 py-12 min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
                {/* Sidebar */}
                <aside className="card p-4 flex flex-col gap-2 h-fit">
                    <Link href="/profile" className="btn btn--ghost justify-start"><User size={16} className="mr-2" /> Profile</Link>
                    <Link href="/settings" className="btn btn--secondary justify-start"><SettingsIcon size={16} className="mr-2" /> Preferences</Link>
                    <Link href="/security" className="btn btn--ghost justify-start"><Shield size={16} className="mr-2" /> Security</Link>
                </aside>

                {/* Content */}
                <div className="flex flex-col gap-6">
                    <div className="card p-6 md:p-8">
                        <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)] mb-6">Preferences</h1>

                        <form className="space-y-6 max-w-2xl">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border-subtle)] pb-2">Notifications</h3>

                                <label className="flex items-center justify-between p-3 border border-[var(--color-border-subtle)] rounded-lg cursor-pointer hover:bg-[var(--color-surface-raised)] transition-colors">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-[var(--color-text-primary)]">Email Updates</span>
                                        <span className="text-xs text-[var(--color-text-secondary)]">Receive emails about new books and fatawa.</span>
                                    </div>
                                    <input type="checkbox" className="w-5 h-5 accent-[var(--color-dusty-500)]" defaultChecked />
                                </label>

                                <label className="flex items-center justify-between p-3 border border-[var(--color-border-subtle)] rounded-lg cursor-pointer hover:bg-[var(--color-surface-raised)] transition-colors">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-[var(--color-text-primary)]">Reading Reminders</span>
                                        <span className="text-xs text-[var(--color-text-secondary)]">Weekly digests of your reading list.</span>
                                    </div>
                                    <input type="checkbox" className="w-5 h-5 accent-[var(--color-dusty-500)]" />
                                </label>
                            </div>

                            <div className="pt-4 border-t border-[var(--color-border-subtle)]">
                                <button type="button" className="btn btn--primary px-8">Save Preferences</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
