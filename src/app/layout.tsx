import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Modern Chat App",
  description: "A professional real-time chat application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden h-screen bg-gray-50 dark:bg-black`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          storageKey="chat-theme"
        >
          <Providers>
            <div className="flex h-full w-full max-w-[1600px] mx-auto bg-white dark:bg-gray-900 shadow-2xl overflow-hidden relative">
              <div className="flex w-full h-full">
                <Sidebar />
                <main className="flex-1 flex flex-col min-w-0 bg-gray-50 dark:bg-gray-950 relative z-10">
                  {children}
                </main>
              </div>
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
