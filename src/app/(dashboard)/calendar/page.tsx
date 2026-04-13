import { getCalendarMeetings } from "@/actions/meeting";
import { CalendarClient } from "./CalendarClient";
import { Calendar as CalendarIcon, CheckCircle2, CalendarClock } from "lucide-react";

export default async function CalendarPage() {
  const meetings = await getCalendarMeetings();
  
  const upcomingCount = meetings.filter(m => m.status === 'scheduled').length;
  const completedCount = meetings.filter(m => m.status === 'completed').length;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* Header Enhancement */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-6">
          <div className="w-20 h-20 bg-[#B8FF3B] rounded-full flex items-center justify-center shadow-gloweffect border-4 border-white">
            <CalendarIcon size={36} className="text-black" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-[#111111] italic tracking-tight">
              Meeting Calendar
            </h1>
            <p className="text-[#6B6B6B] font-medium text-lg max-w-xl">
              Track your upcoming interviews, manage scheduled events, and join sessions directly from your monthly view.
            </p>
          </div>
        </div>

        {/* Summary Stats Card */}
        <div className="flex items-center gap-4">
          <div className="bg-[#F0F0ED] p-6 rounded-[2rem] border border-[#EAEAEA] flex items-center gap-4 min-w-[200px]">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#111111] shadow-soft">
              <CalendarClock size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#A1A19D]">Upcoming</p>
              <p className="text-2xl font-black text-[#111111]">{upcomingCount}</p>
            </div>
          </div>

          <div className="bg-[#F0F0ED] p-6 rounded-[2rem] border border-[#EAEAEA] flex items-center gap-4 min-w-[200px]">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#B8FF3B] shadow-soft">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#A1A19D]">Completed</p>
              <p className="text-2xl font-black text-[#111111]">{completedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Container */}
      <div className="bg-white rounded-[2.5rem] border border-[#EAEAEA] shadow-soft p-10 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-[#B8FF3B]/5 rounded-full blur-[100px] -mr-32 -mt-32" />
         <CalendarClient initialMeetings={meetings as any} />
      </div>
    </div>
  );
}
