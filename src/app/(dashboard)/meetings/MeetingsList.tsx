'use client';

import { useState } from "react";
import { Calendar, Clock, Trash2, ExternalLink, Activity, CheckCircle2, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { deleteMeeting } from "@/actions/meeting";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Meeting {
  id: string;
  startTime: Date;
  endTime: Date | null;
  status: 'scheduled' | 'live' | 'completed';
  type: string;
  summary: string | null;
}

export function MeetingsList({ meetings: initialMeetings }: { meetings: Meeting[] }) {
  const [meetings, setMeetings] = useState(initialMeetings);
  const router = useRouter();

  const calculateDuration = (start: Date, end: Date | null) => {
    if (!end) return "Ongoing";
    const durationMs = new Date(end).getTime() - new Date(start).getTime();
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const extractScore = (summary: string | null) => {
    if (!summary) return null;
    const match = summary.match(/Overall Score:\s*(\d+)/i);
    return match ? match[1] : null;
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this meeting record?")) {
      const result = await deleteMeeting(id);
      if (result.success) {
        setMeetings(meetings.filter(m => m.id !== id));
      } else {
        alert("Failed to delete record.");
      }
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {meetings.length === 0 ? (
        <div className="bg-white p-20 rounded-[2.5rem] border border-[#EAEAEA] shadow-soft text-center">
          <Calendar className="mx-auto text-[#D1D1CB] mb-4" size={48} />
          <h3 className="text-xl font-black text-[#111111]">No meetings found</h3>
          <p className="text-[#6B6B6B] font-medium mt-2">Start your first session from the dashboard!</p>
        </div>
      ) : (
        meetings.map((meeting) => {
          const score = extractScore(meeting.summary);
          const isInterview = meeting.type === 'interview';

          return (
            <Link 
              key={meeting.id}
              href={`/meetings/${meeting.id}`}
              className="bg-white p-8 rounded-[2rem] border border-[#EAEAEA] shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#B8FF3B]/50 transition-all hover:shadow-lg hover:shadow-[#B8FF3B]/5 group relative cursor-pointer"
            >
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                  meeting.status === 'completed' ? 'bg-[#F0F0ED] text-[#6B6B6B]' : 'bg-[#B8FF3B] text-black shadow-gloweffect'
                }`}>
                  {meeting.status === 'completed' ? <CheckCircle2 size={24} /> : <Activity className="animate-pulse" size={24} />}
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-[#111111] flex items-center gap-2">
                    {isInterview ? "Interview Session" : "Normal Meeting"}
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-bold ${
                      meeting.status === 'completed' ? 'bg-[#F0F0ED] text-[#6B6B6B]' : 'bg-[#B8FF3B] text-black'
                    }`}>
                      {meeting.status}
                    </span>
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm font-medium text-[#6B6B6B]">
                    <span className="flex items-center gap-1.5 border-r border-[#EAEAEA] pr-4">
                      <Calendar size={14} />
                      {format(new Date(meeting.startTime), "MMM do, yyyy · HH:mm")}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {calculateDuration(meeting.startTime, meeting.endTime)}
                    </span>
                  </div>
                </div>
              </div>

              {isInterview && score && meeting.status === 'completed' && (
                <div className="flex flex-col items-center justify-center px-6 border-x border-[#F0F0ED]">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A1A19D] mb-1">Score</span>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-4xl font-black text-[#111111] tracking-tighter">{score}</span>
                    <span className="text-xs font-bold text-[#A1A19D]">/100</span>
                  </div>
                </div>
              )}

              <div className="bg-[#F8F8F6] p-4 rounded-xl flex-1 md:max-w-sm border border-[#F0F0ED] max-h-32 overflow-y-auto custom-scrollbar relative">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#A1A19D] block mb-1">AI Insights</span>
                <p className="text-xs font-medium text-[#6B6B6B] leading-relaxed whitespace-pre-line">
                  {meeting.summary ? (
                    isInterview ? meeting.summary.split('\n').filter(l => !l.includes('Overall Score')).join('\n').trim() : meeting.summary
                  ) : (
                    meeting.status === 'completed' ? "Processing summary..." : "Summary will appear after session."
                  )}
                </p>
                {isInterview && score && (
                  <TrendingUp className="absolute top-4 right-4 text-[#B8FF3B]" size={16} />
                )}
              </div>

              <div className="flex items-center gap-3">
                <Button 
                  variant="secondary"
                  size="sm"
                  className="rounded-xl h-10 px-4 font-bold gap-2 text-[#6B6B6B]"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    router.push(`/meeting/${meeting.id}`);
                  }}
                >
                  Rejoin <ExternalLink size={14} />
                </Button>
                <Button 
                  variant="ghost"
                  size="sm"
                  className="rounded-xl h-10 w-10 p-0 text-[#6B6B6B] hover:text-red-500 hover:bg-red-50 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleDelete(meeting.id);
                  }}
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            </Link>
          );
        })
      )}
    </div>
  );
}
