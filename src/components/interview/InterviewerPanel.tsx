"use client";

import { useState } from "react";
import { Sparkles, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateNextQuestion } from "@/actions/interview";

interface InterviewerPanelProps {
  jobTitle: string;
}

export function InterviewerPanel({ jobTitle }: InterviewerPanelProps) {
  const [question, setQuestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateNextQuestion(jobTitle);
      if (result.success && result.question) {
        setQuestion(result.question);
      }
    } catch (error) {
      console.error("Failed to generate question:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 w-80 space-y-4">
      <div className="bg-white/90 backdrop-blur-xl border border-[#EAEAEA] rounded-[2rem] p-6 shadow-2xl shadow-black/5 flex flex-col gap-4">
        <div className="flex items-center gap-2 px-3 py-1 bg-[#B8FF3B]/20 rounded-full w-fit border border-[#B8FF3B]/30">
          <Sparkles className="text-[#B8FF3B]" size={12} />
          <span className="text-[10px] font-black uppercase tracking-widest text-black">
            Interview Assistant
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-black text-[#111111] leading-tight italic">
            Next Technical Challenge
          </h3>
          <p className="text-xs font-medium text-[#6B6B6B]">
            Based on the <span className="text-black font-bold uppercase">{jobTitle}</span> profile.
          </p>
        </div>

        <div className="min-h-[140px] bg-[#F8F8F6] rounded-2xl p-4 border border-[#F0F0ED] relative overflow-hidden group">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10 transition-all">
              <Loader2 className="animate-spin text-[#B8FF3B]" size={24} />
            </div>
          ) : null}

          {question ? (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <MessageCircle size={16} className="text-[#A1A19D]" />
              <p className="text-sm font-bold text-[#111111] leading-relaxed">
                {question}
              </p>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-2 opacity-50">
                <Sparkles size={24} className="text-[#D1D1CB]" />
                <p className="text-[10px] font-black uppercase tracking-widest text-[#A1A19D]">Ready to generate</p>
            </div>
          )}
        </div>

        <Button 
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-[#111111] hover:bg-black text-white rounded-xl h-12 font-bold shadow-soft transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? "Generating..." : "Generate Next Question"}
        </Button>
      </div>
    </div>
  );
}
