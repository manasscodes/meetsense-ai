"use client";

import React, { useMemo, useState, useEffect } from 'react';

interface LiveCaptionsProps {
  transcript: string;
  isListening: boolean;
  targetLanguage?: 'off' | 'en' | 'hi';
}

export function LiveCaptions({ transcript, isListening, targetLanguage = 'en' }: LiveCaptionsProps) {
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  // Logic: Get the most recent chunk for display
  const rawDisplayText = useMemo(() => {
    if (!transcript) return "";
    
    const maxLength = 160;
    if (transcript.length <= maxLength) return transcript;
    
    // Find the last space to avoid cutting words
    const trimmed = transcript.slice(-maxLength);
    const firstSpace = trimmed.indexOf(" ");
    return "..." + trimmed.slice(firstSpace);
  }, [transcript]);

  // Handle Translation for Hindi
  useEffect(() => {
    if (targetLanguage === 'hi' && rawDisplayText && rawDisplayText !== "...") {
      const translateText = async () => {
        setIsTranslating(true);
        try {
          const res = await fetch('/api/ai-agent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              prompt: `Translate the following meeting transcription to Hindi accurately. Provide only the translated text, no explanations: "${rawDisplayText}"`,
              context: "" // We don't need full context for simple captions
            })
          });
          const data = await res.json();
          if (data.response) {
            setTranslatedText(data.response);
          }
        } catch (err) {
          console.error("Translation error:", err);
        } finally {
          setIsTranslating(false);
        }
      };

      // Debounce to prevent excessive API calls during rapid transcription
      const timer = setTimeout(translateText, 600);
      return () => clearTimeout(timer);
    } else {
      setTranslatedText("");
    }
  }, [rawDisplayText, targetLanguage]);

  if (targetLanguage === 'off' || !isListening || !rawDisplayText) return null;

  // Decide what to display
  const displayContent = targetLanguage === 'hi' 
    ? (translatedText || "अनुवाद कर रहा हूँ...") // "Translating..." in Hindi
    : rawDisplayText;

  return (
    <div className="fixed bottom-36 left-1/2 -translate-x-1/2 z-[55] w-full max-w-2xl px-6 pointer-events-none">
      <div className="bg-black/70 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-in slide-in-from-bottom-4 fade-in duration-500">
        <p className="text-white text-xl md:text-2xl font-bold text-center leading-snug tracking-tight drop-shadow-sm">
          {displayContent}
        </p>
        
        {/* Subtle translation indicator */}
        {isTranslating && targetLanguage === 'hi' && (
          <div className="absolute top-2 right-4 flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-[#B8FF3B] animate-ping" />
            <span className="text-[8px] text-white/40 font-bold uppercase tracking-widest">AI</span>
          </div>
        )}
      </div>
    </div>
  );
}
