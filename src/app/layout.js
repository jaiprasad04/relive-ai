import { Inter } from "next/font/google";
import NextAuthSessionProvider from "@/components/SessionProvider";
import Header from "@/components/Header";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Relive AI - Premium Google Veo 3.1 & OpenAI Sora 2 Studio Workspace",
  description: "Dramatically bring your thoughts, memories, and start frames to life with state-of-the-art AI video models. Experience next-generation video effects, cinematic pans, and flawless detail.",
  keywords: "Google Veo 3.1, OpenAI Sora 2, AI Video Generation, Text to Video, Image to Video, Premium Workspace, SaaS Studio",
  authors: [{ name: "Relive AI team" }],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-full flex flex-col bg-[#0b0c10] text-[#c5c6c7] font-sans selection:bg-[#4e4e50] selection:text-[#66fcf1]">
        <NextAuthSessionProvider>
          <Header />
          <main className="flex-1 flex flex-col min-h-0 relative">
            {children}
          </main>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
