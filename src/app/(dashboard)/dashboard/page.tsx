import { Plus } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="h-full flex flex-col p-12">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-[#111111] tracking-tight mb-2">
          Welcome to MeetSense
        </h1>
        <p className="text-[#6B6B6B] font-medium">
          Ready for your next AI-powered interview session?
        </p>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center -mt-20">
        <div className="relative group">
          {/* Decorative glow behind button */}
          <div className="absolute -inset-4 bg-[#B8FF3B] opacity-10 blur-2xl group-hover:opacity-20 transition-opacity rounded-full" />
          
          <button className="relative flex items-center gap-4 px-10 py-5 rounded-full bg-[#B8FF3B] text-[#111111] font-bold text-lg shadow-soft hover:shadow-gloweffect hover:scale-105 active:scale-95 transition-all duration-300">
            <div className="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            Start New Meeting
          </button>
        </div>
        
        <div className="mt-8 flex gap-8">
          <div className="flex items-center gap-2 text-[#6B6B6B] text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            AI Interviewer Online
          </div>
          <div className="flex items-center gap-2 text-[#6B6B6B] text-sm font-medium">
             <span>5 slots available today</span>
          </div>
        </div>
      </div>
    </div>
  );
}
