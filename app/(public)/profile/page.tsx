import type { Metadata } from "next";
import Link from "next/link";
import { User, Settings, LogOut } from "lucide-react";

export const metadata: Metadata = {
    title: "Profile | Oushi Library",
};

export default function ProfilePage() {
    return (
        <main className="container container--lg mx-auto px-4 py-12 min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
                {/* Sidebar */}
                <aside className="card p-4 flex flex-col gap-2 h-fit">
                    <Link href="/dashboard" className="btn btn--ghost justify-start"><User size={16} className="mr-2" /> Overview</Link>
                    <Link href="/profile" className="btn btn--secondary justify-start"><Settings size={16} className="mr-2" /> Profile</Link>
                    <hr className="my-2" />
                    <button className="btn btn--ghost justify-start text-[var(--color-terracotta-400)]"><LogOut size={16} className="mr-2" /> Logout</button>
                </aside>

                {/* Content */}
                <div className="flex flex-col gap-6">
                    <div className="card p-6 md:p-8">
                        <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)] mb-6">Profile Settings</h1>

                        <form className="space-y-6 max-w-2xl">
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-20 h-20 rounded-full bg-[var(--color-dusty-200)] flex items-center justify-center text-2xl font-bold text-[var(--color-dusty-600)]">
                                    JD
                                </div>
                                <button type="button" className="btn btn--secondary btn--sm">Change Avatar</button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="form-label">First Name</label>
                                    <input type="text" className="input" defaultValue="John" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Last Name</label>
                                    <input type="text" className="input" defaultValue="Doe" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input type="email" className="input" defaultValue="john.doe@example.com" disabled />
                                <p className="form-hint">Email cannot be changed.</p>
                            </div>

                            <div className="pt-4 border-t border-[var(--color-border-subtle)]">
                                <button type="button" className="btn btn--primary px-8">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
