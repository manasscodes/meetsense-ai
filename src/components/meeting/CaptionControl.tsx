"use client";

import React, { useState, useRef, useEffect } from 'react';

interface CaptionControlProps {
  language: 'off' | 'en' | 'hi';
  onLanguageChange: (lang: 'off' | 'en' | 'hi') => void;
}

export function CaptionControl({ language, onLanguageChange }: CaptionControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = language !== 'off';

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[60]" ref={dropdownRef}>
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-44 bg-[#111111]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-[0_10px_40px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-bottom-2 duration-200">
           <div className="px-3 py-2 mb-1">
             <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Captions</p>
           </div>
           
           <div className="space-y-1">
             <button
               onClick={() => { onLanguageChange('off'); setIsOpen(false); }}
               className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                 language === 'off' 
                 ? 'bg-white/10 text-white' 
                 : 'text-gray-400 hover:bg-white/5 hover:text-white'
               }`}
             >
               Off
             </button>
             <button
               onClick={() => { onLanguageChange('en'); setIsOpen(false); }}
               className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                 language === 'en' 
                 ? 'bg-[#B8FF3B] text-black' 
                 : 'text-gray-400 hover:bg-white/5 hover:text-white'
               }`}
             >
               English
             </button>
             <button
               onClick={() => { onLanguageChange('hi'); setIsOpen(false); }}
               className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                 language === 'hi' 
                 ? 'bg-[#B8FF3B] text-black' 
                 : 'text-gray-400 hover:bg-white/5 hover:text-white'
               }`}
             >
               Hindi
             </button>
           </div>
        </div>
      )}

      {/* Main CC Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 border ${
          isActive 
          ? 'bg-[#B8FF3B] border-transparent text-black shadow-[0_0_25px_rgba(184,255,59,0.35)]' 
          : 'bg-[#111111]/90 border-white/10 text-gray-400 hover:text-white hover:border-white/30'
        }`}
      >
        <span className="text-sm font-black tracking-tighter leading-none">CC</span>
        
        {/* Active Underline Indicator */}
        {isActive && (
          <div className="absolute -bottom-1.5 w-4 h-1 bg-[#B8FF3B] rounded-full shadow-[0_0_10px_rgba(184,255,59,0.8)]" />
        )}

        {/* Tooltip on Hover */}
        {!isOpen && (
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase whitespace-nowrap">
            Captions ({language === 'off' ? 'Off' : language})
          </span>
        )}
      </button>
    </div>
  );
}
