"use client";

import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-black font-black text-xs">M</span>
              </div>
              <span className="text-xl font-black tracking-tighter text-foreground">
                MeetSense <span className="text-accent underline decoration-2 underline-offset-4">AI</span>
              </span>
            </Link>
            <p className="text-gray-500 max-w-sm leading-relaxed font-medium">
              Transforming collaboration with real-time AI transcription, 
              intelligent summaries, and bilingual communication support.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-gray-400 mb-6">Navigation</h4>
            <ul className="space-y-4">
              <li><Link href="#features" className="text-sm font-bold text-gray-600 hover:text-accent transition-colors">Features</Link></li>
              <li><Link href="#how-it-works" className="text-sm font-bold text-gray-600 hover:text-accent transition-colors">How It Works</Link></li>
              <li><Link href="#use-cases" className="text-sm font-bold text-gray-600 hover:text-accent transition-colors">Use Cases</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-gray-400 mb-6">Contact</h4>
            <ul className="space-y-4">
              <li><a href="mailto:hello@meetsense.ai" className="text-sm font-bold text-gray-600 hover:text-accent transition-colors">hello@meetsense.ai</a></li>
              <li><p className="text-sm font-bold text-gray-600">Pune, India</p></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Built by <span className="text-foreground">Manas Kolaskar</span> — Final Year Project 2026
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
