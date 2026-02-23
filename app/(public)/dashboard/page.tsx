import type { Metadata } from "next";
import Link from "next/link";
import { User, Library, Settings, LogOut } from "lucide-react";

export const metadata: Metadata = {
    title: "My Dashboard | Oushi Library",
};

export default function UserDashboard() {
    return (
        <main className="container container--lg mx-auto px-4 py-12 min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
                {/* Sidebar Sidebar */}
                <aside className="card p-4 flex flex-col gap-2 h-fit">
                    <Link href="/dashboard" className="btn btn--secondary justify-start"><User size={16} className="mr-2" /> Overview</Link>
                    <Link href="/profile" className="btn btn--ghost justify-start"><Settings size={16} className="mr-2" /> Profile</Link>
                    <hr className="my-2" />
                    <button className="btn btn--ghost justify-start text-[var(--color-terracotta-400)]"><LogOut size={16} className="mr-2" /> Logout</button>
                </aside>

                {/* Content */}
                <div className="flex flex-col gap-6">
                    <div className="card p-6">
                        <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)] mb-2">Welcome Back!</h1>
                        <p className="text-[var(--color-text-secondary)]">Manage your reading lists and saved fatawa here.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="card p-6 text-center">
                            <div className="text-3xl font-display font-bold text-[var(--color-dusty-600)] mb-1">12</div>
                            <div className="text-sm text-[var(--color-text-secondary)]">Saved Books</div>
                        </div>
                        <div className="card p-6 text-center">
                            <div className="text-3xl font-display font-bold text-[var(--color-sage-600)] mb-1">5</div>
                            <div className="text-sm text-[var(--color-text-secondary)]">Reading Later</div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <h2 className="text-xl font-semibold mb-4 text-[var(--color-text-primary)]">Recently Saved</h2>
                        <div className="empty-state py-8">
                            <Library size={32} className="opacity-20 mb-3 mx-auto" />
                            <p className="text-[var(--color-text-secondary)]">You haven't saved any books yet.</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
