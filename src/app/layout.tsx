import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Brain, User, LayoutDashboard } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Skill Tracker",
  description: "Track your AI and development skills with Claude-powered learning paths",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-zinc-950 text-white`}>
        {/* Top navigation */}
        <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-14 items-center justify-between">
              {/* Logo */}
              <Link
                href="/"
                className="flex items-center gap-2 text-white hover:text-blue-300 transition-colors"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-sm sm:text-base">AI Skill Tracker</span>
              </Link>

              {/* Nav links */}
              <nav className="flex items-center gap-1">
                <Link
                  href="/"
                  className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                >
                  <User className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}
