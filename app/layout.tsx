import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Edison — AI Tutoring for Nigerian Students",
  description:
    "Edison delivers affordable, AI-driven one-on-one tutoring aligned to Nigerian curricula — personalized learning, low-bandwidth support, and teacher tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en"
        style={{ scrollBehavior: "smooth" }}
      >
        <body
          className={`${bricolage.variable} antialiased flex flex-col min-h-screen`}
        >
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
