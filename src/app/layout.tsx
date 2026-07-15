import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";


const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "TaniPro — B2B Agricultural Logistics Platform",
    template: "%s | TaniPro",
  },
  description:
    "Indonesia's premier B2B agricultural logistics platform. Connecting farmers, buyers, and logistics in one intelligent ecosystem.",
  keywords: ["agricultural", "logistics", "B2B", "petani", "pembeli", "agritech", "Indonesia"],
  authors: [{ name: "TaniPro Team" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#10b981",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
