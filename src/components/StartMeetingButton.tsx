"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function StartMeetingButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartMeeting = () => {
    setIsLoading(true);
    // Generate a random 10-character room ID
    const randomId = Math.random().toString(36).substring(2, 12);
    router.push(`/meeting/${randomId}`);
  };

  return (
    <div className="relative group">
      {/* Decorative glow behind button */}
      <div className="absolute -inset-4 bg-[#B8FF3B] opacity-10 blur-2xl group-hover:opacity-20 transition-opacity rounded-full" />
      
      <button 
        onClick={handleStartMeeting}
        disabled={isLoading}
        className="relative flex items-center gap-4 px-10 py-5 rounded-full bg-[#B8FF3B] text-[#111111] font-bold text-lg shadow-soft hover:shadow-gloweffect hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-70"
      >
        <div className="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center">
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-[#111111]" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </div>
        {isLoading ? "Preparing Room..." : "Start New Meeting"}
      </button>
    </div>
  );
}
