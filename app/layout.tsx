import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/themeProvider";
import { AuthProvider } from "@/components/ui/AuthProvider";
import '@/lib/orpc.server' // for pre-rendering
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";

// Rest of the code
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clair — AI-powered team communication",
  description: "Clair is a modern team communication platform with real-time messaging, channels, threads, and built-in AI tools to keep your team in sync.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)
 {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Providers>
            {children}
            </Providers>
            <Toaster closeButton position="top-center"/>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}