import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import { AsyncProvider } from "@/providers/async-providers";
import "./globals.css";
import Providers from "@/providers/progress";
import { Toaster } from "sonner";

const space = Space_Grotesk({
  variable: "--font-space-sans",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ATS resume optmizer",
  description: "Optmize you resume to be job friendly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${space.className} ${spaceMono.className} antialiased`}>
        <AsyncProvider>
          <Providers>{children}</Providers>
          <Toaster position="top-right" />
        </AsyncProvider>
      </body>
    </html>
  );
}
