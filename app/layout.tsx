import type { Metadata, Viewport } from "next";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    template: "%s | Oushi Admin",
    default: "Oushi Admin",
  },
  description: "Islamic Books & Fatawa Library Management System",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Cormorant Garamond for the Oushi wordmark */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* Fixed top navbar */}
        <Navbar />

        {/* Page content — offset by navbar height */}
        <div
          style={{
            minHeight: "100vh",
            paddingTop: "var(--navbar-h, 60px)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
        </div>

        {/* Toast notifications */}
        <Toaster
          position="bottom-right"
          gutter={12}
          containerStyle={{ bottom: 24, right: 24 }}
          toastOptions={{
            duration: 4000,
            style: {
              background: "#0e0c09",
              color: "rgba(245,237,224,0.9)",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "0.825rem",
              borderRadius: "10px",
              padding: "12px 16px",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(196,157,84,0.2)",
              maxWidth: "380px",
              border: "1px solid rgba(196,157,84,0.15)",
            },
            success: {
              iconTheme: {
                primary: "#6a8f6a",
                secondary: "white",
              },
            },
            error: {
              iconTheme: {
                primary: "#c4594a",
                secondary: "white",
              },
            },
          }}
        />
      </body>
    </html>
  );
}