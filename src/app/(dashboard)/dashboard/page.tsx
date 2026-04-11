import { StartMeetingButton } from "@/components/StartMeetingButton";

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
        <StartMeetingButton />
        
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
