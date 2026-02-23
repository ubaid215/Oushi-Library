// app/(public)/layout.tsx
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
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
    </>
  );
}