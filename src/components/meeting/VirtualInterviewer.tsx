"use client";

import React, { useEffect, useState, useRef } from 'react';

interface VirtualInterviewerProps {
  message?: string;
}

export function VirtualInterviewer({ message }: VirtualInterviewerProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  useEffect(() => {
    if (!message || !synthRef.current) return;

    // Small delay to ensure synthesis is ready or to handle quick re-triggers
    const timeoutId = setTimeout(() => {
      if (!synthRef.current) return;
      
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(message);
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      // Try to get a high-quality English voice
      const voices = synthRef.current.getVoices();
      const preferredVoice = voices.find(v => 
        (v.name.includes('Google') || v.name.includes('Premium')) && v.lang.startsWith('en')
      ) || voices.find(v => v.lang.startsWith('en'));
      
      if (preferredVoice) utterance.voice = preferredVoice;
      utterance.rate = 0.95; // Slightly slower for clarity
      utterance.pitch = 1.0;

      synthRef.current.speak(utterance);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [message]);

  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[500px] w-full max-w-4xl mx-auto">
      <div className={`relative transition-all duration-700 ease-out ${
        isSpeaking ? 'scale-110' : 'scale-100'
      }`}>
        {/* Outer Glow Ring */}
        <div className={`absolute -inset-4 rounded-full blur-2xl transition-opacity duration-700 ${
          isSpeaking ? 'bg-[#B8FF3B]/30 opacity-100' : 'bg-transparent opacity-0'
        }`} />

        {/* Avatar Container */}
        <div className={`relative w-72 h-72 rounded-full overflow-hidden border-4 transition-colors duration-700 ${
          isSpeaking ? 'border-[#B8FF3B] shadow-[0_0_60px_rgba(184,255,59,0.4)]' : 'border-white/10 shadow-2xl'
        } ${!isSpeaking && 'animate-breathing text-white/20'}`}>
          
          <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1000" 
            alt="Interviewer Avatar"
            className="w-full h-full object-cover filter brightness-[0.9] contrast-[1.1]"
          />

          {/* Talking Overlay Pulse */}
          {isSpeaking && (
            <div className="absolute inset-0 bg-[#B8FF3B]/5 animate-pulse mix-blend-overlay" />
          )}
        </div>

        {/* Status Indicator */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#111111] border border-white/10 rounded-full flex items-center gap-2 shadow-2xl">
          <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-[#B8FF3B] animate-pulse' : 'bg-gray-500'}`} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
            {isSpeaking ? 'Speaking' : 'Listening'}
          </span>
        </div>
      </div>

      {/* Message Text (Subtitle style) */}
      <div className="mt-16 w-full max-w-2xl px-6">
        <div className={`p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-500 transform ${
          message ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <p className="text-xl font-medium text-white/90 leading-relaxed text-center">
            {message || "Preparing interview context..."}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes breathing {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(255,255,255,0.05); }
          50% { transform: scale(1.03); box-shadow: 0 0 40px rgba(255,255,255,0.1); }
        }
        .animate-breathing {
          animation: breathing 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
