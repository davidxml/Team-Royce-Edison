import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import "./globals.css";

const poppins = Poppins({ weight: ["400", "700"], subsets: ["latin"] });

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
      <html lang="en">
        <body
          className={`${poppins.className} antialiased flex flex-col min-h-screen`}
        >
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
