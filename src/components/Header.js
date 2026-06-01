"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { FaCoins, FaBars, FaTimes, FaVideo, FaWallet, FaImages } from "react-icons/fa";
import { SiVercel } from "react-icons/si";

export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[150] w-full border-b border-[#2c2e3e] bg-[#0b0c10]/80 backdrop-blur-md text-[#c5c6c7]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand logo and Name */}
        <Link href="/" className="flex items-center space-x-3 group hover:opacity-95 transition">
          <div className="w-10 h-10 rounded bg-gradient-to-tr from-[#66fcf1] to-[#8b5cf6] flex items-center justify-center text-[#0b0c10] font-black text-xl shadow-md group-hover:scale-105 transition-transform duration-200">
            R
          </div>
          <div>
            <span className="font-extrabold text-white text-base tracking-wider block">
              ReLive AI
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className={`text-sm font-semibold transition-colors duration-200 ${
              pathname === "/" ? "text-[#66fcf1]" : "text-[#c5c6c7] hover:text-white"
            }`}
          >
            Studio Workspace
          </Link>
          <Link
            href="/gallery"
            className={`text-sm font-semibold transition-colors duration-200 ${
              pathname === "/gallery" ? "text-[#66fcf1]" : "text-[#c5c6c7] hover:text-white"
            }`}
          >
            Showcase Gallery
          </Link>
          <Link
            href="/pricing"
            className={`text-sm font-semibold transition-colors duration-200 ${
              pathname === "/pricing" ? "text-[#66fcf1]" : "text-[#c5c6c7] hover:text-white"
            }`}
          >
            Credits & Pricing
          </Link>
        </nav>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Vercel Deploy Button */}
          <a
            href="https://vercel.com/new/clone?repository-url=https://github.com/SamurAIGPT/relive-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 text-xs text-white bg-[#1f2833] hover:bg-black/40 border border-[#2c2e3e] px-3.5 py-1.5 rounded-full transition-all duration-200 font-semibold shadow-sm cursor-pointer"
          >
            <SiVercel className="text-white w-3 h-3 animate-pulse" />
            <span>Deploy</span>
          </a>

          {status === "authenticated" ? (
            <>
              {/* Credits Badge */}
              <div className="glass px-3.5 py-1.5 rounded-full border border-[#2c2e3e] flex items-center space-x-2 text-xs font-semibold text-zinc-300">
                <FaCoins className="text-[#66fcf1]" />
                <span>Credits:</span>
                <span className="font-extrabold text-[#66fcf1]">
                  {session.user.credits ?? 0}
                </span>
              </div>

              {/* User Avatar & Sign Out */}
              <div className="flex items-center space-x-3">
                {session.user.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="w-6 h-6 rounded-full border border-[#66fcf1]/30"
                  />
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-xs hover:underline text-[#c5c6c7]/70 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="bg-gradient-to-r from-[#66fcf1] to-[#00d2c4] text-[#0b0c10] hover:shadow-[0_0_15px_rgba(102,252,241,0.4)] px-4.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Hamburger Toggle Trigger */}
        <div className="flex md:hidden items-center space-x-3">
          {status === "authenticated" && (
            <div className="flex items-center space-x-1 rounded-full border border-[#2c2e3e] bg-[#12131a] px-3 py-1 text-xs font-semibold text-[#66fcf1] shadow-inner">
              <FaCoins className="text-[10px]" />
              <span className="font-bold">{session.user.credits ?? 0}</span>
            </div>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-[#c5c6c7] hover:bg-[#1f2833] hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Absolute Dropdown Overlay Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 z-[200] border-b border-[#2c2e3e] bg-[#0b0c10]/95 backdrop-blur-xl px-6 py-6 flex flex-col space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 shadow-2xl">
          <nav className="flex flex-col space-y-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center space-x-2.5 rounded-xl p-3 text-sm font-semibold transition-all hover:bg-white/5 hover:text-white ${
                pathname === "/" ? "text-[#66fcf1]" : "text-[#c5c6c7]"
              }`}
            >
              <FaVideo className="h-4 w-4" />
              <span>Studio Workspace</span>
            </Link>
            <Link
              href="/gallery"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center space-x-2.5 rounded-xl p-3 text-sm font-semibold transition-all hover:bg-white/5 hover:text-white ${
                pathname === "/gallery" ? "text-[#66fcf1]" : "text-[#c5c6c7]"
              }`}
            >
              <FaImages className="h-4 w-4" />
              <span>Showcase Gallery</span>
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center space-x-2.5 rounded-xl p-3 text-sm font-semibold transition-all hover:bg-white/5 hover:text-white ${
                pathname === "/pricing" ? "text-[#66fcf1]" : "text-[#c5c6c7]"
              }`}
            >
              <FaWallet className="h-4 w-4" />
              <span>Credits & Pricing</span>
            </Link>

            <div className="my-2 border-t border-[#2c2e3e]"></div>

            {status === "authenticated" ? (
              <div className="flex flex-col space-y-3 pt-2">
                <div className="flex items-center space-x-3 py-2 border-b border-white/5">
                  {session.user.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-6 h-6 rounded-full border border-[#66fcf1]/30"
                    />
                  )}
                  <span className="text-xs text-white/70 truncate">{session.user.email}</span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="w-full rounded-xl bg-white/5 hover:bg-red-500/10 hover:text-red-400 py-3 text-center text-sm font-bold text-[#c5c6c7] transition-all cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signIn("google");
                }}
                className="w-full rounded-xl bg-gradient-to-r from-[#66fcf1] to-[#00d2c4] text-[#0b0c10] hover:shadow-[0_0_15px_rgba(102,252,241,0.4)] py-3 text-center text-sm font-bold transition-all cursor-pointer"
              >
                Sign In with Google
              </button>
            )}

            {/* Vercel Deploy in Mobile Menu */}
            <div className="pt-4 border-t border-white/5">
              <a
                href="https://vercel.com/new/clone?repository-url=https://github.com/SamurAIGPT/relive-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 text-xs text-white bg-[#1f2833] hover:bg-black/40 border border-[#2c2e3e] py-2.5 rounded-full transition-all cursor-pointer font-semibold shadow-sm w-full"
              >
                <SiVercel className="text-white w-3 h-3" />
                <span>Deploy on Vercel</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
