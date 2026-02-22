"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Loader2, Eye, EyeOff } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

interface ProfileFormProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: string;
  };
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name ?? "", email: user.email },
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
  });

  const saveProfile = async (values: ProfileValues) => {
    setSavingProfile(true);
    try {
      const res = await fetch(`/api/admin/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to update profile");
      toast.success("Profile updated!");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async (values: PasswordValues) => {
    setSavingPassword(true);
    try {
      const res = await fetch(`/api/admin/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to change password");
      toast.success("Password changed successfully!");
      passwordForm.reset();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      {/* Profile Info */}
      <div className="card">
        <div className="card__header">
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", color: "var(--color-text-primary)" }}>
            Profile Information
          </h3>
        </div>
        <form onSubmit={profileForm.handleSubmit(saveProfile)}>
          <div className="card__body" style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
            <div className="form-group">
              <label className="form-label form-label--required">Full Name</label>
              <input
                {...profileForm.register("name")}
                className={`input ${profileForm.formState.errors.name ? "input--error" : ""}`}
              />
              {profileForm.formState.errors.name && (
                <p className="form-error">{profileForm.formState.errors.name.message}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label form-label--required">Email</label>
              <input
                {...profileForm.register("email")}
                type="email"
                className={`input ${profileForm.formState.errors.email ? "input--error" : ""}`}
              />
              {profileForm.formState.errors.email && (
                <p className="form-error">{profileForm.formState.errors.email.message}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <input
                value={user.role.replace("_", " ")}
                disabled
                className="input"
                style={{ opacity: 0.6, cursor: "not-allowed" }}
              />
              <p className="form-hint">Role can only be changed by a Super Admin.</p>
            </div>
          </div>
          <div className="card__footer">
            <button type="submit" disabled={savingProfile} className="btn btn--primary">
              {savingProfile ? <Loader2 size={14} className="animate-spin" /> : null}
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="card">
        <div className="card__header">
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", color: "var(--color-text-primary)" }}>
            Change Password
          </h3>
        </div>
        <form onSubmit={passwordForm.handleSubmit(changePassword)}>
          <div className="card__body" style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
            <div className="form-group">
              <label className="form-label form-label--required">Current Password</label>
              <div className="input-wrapper">
                <input
                  {...passwordForm.register("currentPassword")}
                  type={showCurrent ? "text" : "password"}
                  className={`input input--icon-right ${passwordForm.formState.errors.currentPassword ? "input--error" : ""}`}
                />
                <button
                  type="button"
                  className="input-icon input-icon--right"
                  onClick={() => setShowCurrent(!showCurrent)}
                  style={{ cursor: "pointer", background: "none", border: "none" }}
                >
                  {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {passwordForm.formState.errors.currentPassword && (
                <p className="form-error">{passwordForm.formState.errors.currentPassword.message}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label form-label--required">New Password</label>
              <div className="input-wrapper">
                <input
                  {...passwordForm.register("newPassword")}
                  type={showNew ? "text" : "password"}
                  className={`input input--icon-right ${passwordForm.formState.errors.newPassword ? "input--error" : ""}`}
                  placeholder="Min. 8 characters"
                />
                <button
                  type="button"
                  className="input-icon input-icon--right"
                  onClick={() => setShowNew(!showNew)}
                  style={{ cursor: "pointer", background: "none", border: "none" }}
                >
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {passwordForm.formState.errors.newPassword && (
                <p className="form-error">{passwordForm.formState.errors.newPassword.message}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label form-label--required">Confirm New Password</label>
              <input
                {...passwordForm.register("confirmPassword")}
                type="password"
                className={`input ${passwordForm.formState.errors.confirmPassword ? "input--error" : ""}`}
              />
              {passwordForm.formState.errors.confirmPassword && (
                <p className="form-error">{passwordForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
          <div className="card__footer">
            <button type="submit" disabled={savingPassword} className="btn btn--primary">
              {savingPassword ? <Loader2 size={14} className="animate-spin" /> : null}
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
