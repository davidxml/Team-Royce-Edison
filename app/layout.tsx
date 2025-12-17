import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";


import "./globals.css";
import { ProfileProvider } from "@/context/ProfileContext";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Edison",
  description:
    "Edison delivers affordable, AI-driven one-on-one tutoring aligned to Nigerian curricula.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: { colorPrimary: "#4854F6" },
      }}
    >
      <html lang="en" style={{ scrollBehavior: "smooth" }}>
        <body
          className={`${bricolage.variable} antialiased flex flex-col min-h-screen`}
        >
          
          <main className="flex-1">
            <ProfileProvider>{children}</ProfileProvider>
          </main>
          
        </body>
      </html>
    </ClerkProvider>
  );
}
