import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import AppSessionProvider from "@/components/session-provider";
import ToasterProvider from "@/components/toaster-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Blaze System — Gerencie sua torcida no Discord",
  description:
    "Plataforma de gerenciamento de bots Discord com automação completa para torcidas e comunidades.",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        <AppSessionProvider>
          <ToasterProvider />
          {children}
        </AppSessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
