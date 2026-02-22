import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProfileForm from "@/components/admin/ProfileForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.email) return null;

  const user = await prisma.adminUser.findUnique({
    where: { email: session.user.email },
    select: { id: true, name: true, email: true, image: true, role: true, createdAt: true },
  });

  if (!user) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
      <div className="page-header">
        <p className="page-header__eyebrow">Account</p>
        <h1 className="page-header__title">Your Profile</h1>
        <p className="page-header__subtitle">Update your personal information and password.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "var(--space-6)", alignItems: "start" }}>
        {/* Profile Card */}
        <div className="card" style={{ textAlign: "center" }}>
          <div className="card__body" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-4)" }}>
            <div
              className="avatar avatar--2xl"
              style={{
                background: user.image ? "transparent" : "linear-gradient(135deg, var(--color-dusty-300), var(--color-dusty-500))",
              }}
            >
              {user.image ? (
                <img src={user.image} alt={user.name ?? ""} />
              ) : (
                <span style={{ fontSize: "var(--text-3xl)", color: "white", fontFamily: "var(--font-display)" }}>
                  {(user.name ?? user.email ?? "A").charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", fontWeight: 600, color: "var(--color-text-primary)" }}>
                {user.name ?? "Admin"}
              </p>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-tertiary)" }}>{user.email}</p>
            </div>
            <span className="badge badge--primary">
              {user.role.replace("_", " ")}
            </span>
            <div
              style={{
                width: "100%",
                padding: "var(--space-4)",
                background: "var(--color-parchment-50)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-border-subtle)",
                textAlign: "left",
              }}
            >
              <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", marginBottom: "var(--space-1)" }}>Member since</p>
              <p style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text-primary)" }}>
                {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
