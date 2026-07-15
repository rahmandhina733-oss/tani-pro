import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "TaniPro — Platform Logistik Agrikultur B2B",
  description: "Platform logistik pertanian B2B terdepan di Indonesia",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          background:
            "radial-gradient(ellipse at top right, #0f2a1a 0%, #0B1410 40%, #000000 100%)",
          color: "#f8fafc",
          fontFamily:
            "'Inter', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        {children}
      </body>
    </html>
  );
}
