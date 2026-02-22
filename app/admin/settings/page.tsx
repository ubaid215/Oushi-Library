"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Loader2, Globe, Palette, Upload, BarChart3 } from "lucide-react";

const defaultSettings = {
  siteName: "Oushi",
  siteDescription: "Islamic Books & Fatawa Library",
  siteUrl: "",
  primaryColor: "#6e639e",
  maxPdfSizeMb: 50,
  maxImageSizeMb: 5,
  googleAnalyticsId: "",
  enableTracking: true,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "appearance" | "upload" | "analytics">("general");

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Settings saved!");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const update = (key: keyof typeof settings, value: string | number | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: "general" as const, label: "General", icon: <Globe size={15} /> },
    { id: "appearance" as const, label: "Appearance", icon: <Palette size={15} /> },
    { id: "upload" as const, label: "Upload", icon: <Upload size={15} /> },
    { id: "analytics" as const, label: "Analytics", icon: <BarChart3 size={15} /> },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div className="page-header--with-action page-header">
        <div>
          <p className="page-header__eyebrow">System</p>
          <h1 className="page-header__title">Settings</h1>
          <p className="page-header__subtitle">Configure your Oushi admin dashboard.</p>
        </div>
        <button onClick={save} disabled={saving} className="btn btn--primary">
          {saving ? <Loader2 size={14} className="animate-spin" /> : null}
          Save Settings
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab ${activeTab === tab.id ? "tab--active" : ""}`}
            style={{ border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "var(--space-2)" }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* General */}
      {activeTab === "general" && (
        <div className="card">
          <div className="card__header">
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", color: "var(--color-text-primary)" }}>
              General Settings
            </h3>
          </div>
          <div className="card__body" style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
            <div className="form-group">
              <label className="form-label">Site Name</label>
              <input
                value={settings.siteName}
                onChange={(e) => update("siteName", e.target.value)}
                className="input"
                placeholder="Bibliotheca"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Site Description</label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => update("siteDescription", e.target.value)}
                className="textarea"
                rows={3}
                placeholder="Brief description of your library..."
              />
            </div>
            <div className="form-group">
              <label className="form-label">Site URL</label>
              <input
                value={settings.siteUrl}
                onChange={(e) => update("siteUrl", e.target.value)}
                className="input"
                placeholder="https://yourdomain.com"
                type="url"
              />
            </div>
          </div>
        </div>
      )}

      {/* Appearance */}
      {activeTab === "appearance" && (
        <div className="card">
          <div className="card__header">
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", color: "var(--color-text-primary)" }}>
              Appearance
            </h3>
          </div>
          <div className="card__body" style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
            <div className="form-group">
              <label className="form-label">Primary Color</label>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => update("primaryColor", e.target.value)}
                  style={{ width: 48, height: 40, borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", cursor: "pointer" }}
                />
                <input
                  value={settings.primaryColor}
                  onChange={(e) => update("primaryColor", e.target.value)}
                  className="input"
                  placeholder="#6e639e"
                  style={{ flex: 1 }}
                />
              </div>
            </div>

            <div
              style={{
                padding: "var(--space-5)",
                background: "var(--color-parchment-50)",
                borderRadius: "var(--radius-xl)",
                border: "1px solid var(--color-border-subtle)",
              }}
            >
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginBottom: "var(--space-3)" }}>
                Preview
              </p>
              <button
                style={{
                  background: settings.primaryColor,
                  color: "white",
                  border: "none",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-2-5) var(--space-5)",
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Sample Button
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload */}
      {activeTab === "upload" && (
        <div className="card">
          <div className="card__header">
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", color: "var(--color-text-primary)" }}>
              Upload Settings
            </h3>
          </div>
          <div className="card__body" style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
            <div
              style={{
                padding: "var(--space-4)",
                background: "var(--color-info-subtle)",
                borderRadius: "var(--radius-xl)",
                border: "1px solid var(--color-info-border)",
              }}
            >
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-dusty-700, var(--color-dusty-600))", fontWeight: 600, marginBottom: "var(--space-1)" }}>
                Cloudinary Free Tier
              </p>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--color-dusty-600)" }}>
                PDFs are automatically compressed using pdf-lib before upload. The compressed file must be under 10MB for Cloudinary free tier. Files up to 50MB can be uploaded (they'll be compressed down).
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Max PDF Size Before Compression (MB)</label>
              <input
                type="number"
                value={settings.maxPdfSizeMb}
                onChange={(e) => update("maxPdfSizeMb", parseInt(e.target.value))}
                className="input"
                min={1}
                max={100}
              />
              <p className="form-hint">PDFs larger than this will be rejected before compression attempt</p>
            </div>

            <div className="form-group">
              <label className="form-label">Max Image Size (MB)</label>
              <input
                type="number"
                value={settings.maxImageSizeMb}
                onChange={(e) => update("maxImageSizeMb", parseInt(e.target.value))}
                className="input"
                min={1}
                max={10}
              />
            </div>
          </div>
        </div>
      )}

      {/* Analytics */}
      {activeTab === "analytics" && (
        <div className="card">
          <div className="card__header">
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", color: "var(--color-text-primary)" }}>
              Analytics Settings
            </h3>
          </div>
          <div className="card__body" style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
            <div className="form-group">
              <label className="form-label">Google Analytics ID</label>
              <input
                value={settings.googleAnalyticsId}
                onChange={(e) => update("googleAnalyticsId", e.target.value)}
                className="input"
                placeholder="G-XXXXXXXXXX"
              />
            </div>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={settings.enableTracking}
                onChange={(e) => update("enableTracking", e.target.checked)}
              />
              <span className="checkbox-item__label">Enable download and view tracking</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
