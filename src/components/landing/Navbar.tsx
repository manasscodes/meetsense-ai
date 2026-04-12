"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md py-3 shadow-sm border-b border-gray-100"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform">
            <span className="text-black font-black text-xs">M</span>
          </div>
          <span className="text-xl font-black tracking-tighter text-foreground">
            MeetSense <span className="">AI</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-bold text-gray-500 hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm font-bold text-gray-500 hover:text-foreground transition-colors">
            How It Works
          </Link>
          <Link href="#use-cases" className="text-sm font-bold text-gray-500 hover:text-foreground transition-colors">
            Use Cases
          </Link>
          <Link href="#contact" className="text-sm font-bold text-gray-500 hover:text-foreground transition-colors">
            Contact
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/sign-in"
            className="text-sm font-bold text-gray-500 hover:text-foreground transition-all px-4 py-2 rounded-full hover:bg-gray-100"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="bg-accent hover:bg-[#A3E635] text-black text-sm font-black px-6 py-2.5 rounded-full transition-all shadow-gloweffect active:scale-95"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-6 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
          <Link 
            href="#features" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-lg font-bold text-gray-600"
          >
            Features
          </Link>
          <Link 
            href="#how-it-works" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-lg font-bold text-gray-600"
          >
            How It Works
          </Link>
          <Link 
            href="#use-cases" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-lg font-bold text-gray-600"
          >
            Use Cases
          </Link>
          <Link 
            href="/sign-in"
            className="text-lg font-bold text-gray-600 pt-4 border-t border-gray-100"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="bg-accent text-black text-center text-lg font-black py-4 rounded-xl shadow-lg"
          >
            Sign Up Free
          </Link>
        </div>
      )}
    </nav>
  );
}
