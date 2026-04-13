import { getMeeting } from "@/actions/meeting";
import { format } from "date-fns";
import { 
  ChevronLeft, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  Activity,
  User as UserIcon
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Props {
  params: Promise<{
    meetingId: string;
  }>;
}

export default async function MeetingDetailsPage({ params }: Props) {
  const { meetingId } = await params;
  const meeting = await getMeeting(meetingId);

  if (!meeting) {
    redirect("/meetings");
  }

  const calculateDuration = (start: Date, end: Date | null) => {
    if (!end) return "Ongoing";
    const durationMs = new Date(end).getTime() - new Date(start).getTime();
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBF8]">
      {/* Header / Navigation */}
      <div className="p-8 pb-0">
        <Link href="/meetings">
          <Button variant="ghost" className="rounded-xl gap-2 font-bold text-[#6B6B6B] hover:text-[#111111] transition-colors">
            <ChevronLeft size={20} />
            Back to History
          </Button>
        </Link>
      </div>

      <div className="flex-1 p-8 md:p-12 flex flex-col md:flex-row gap-8 lg:gap-12 max-w-[1600px] mx-auto w-full">
        {/* Left Side: Session Metadata */}
        <aside className="w-full md:w-[400px] shrink-0 space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-[#EAEAEA] shadow-soft space-y-8">
            <div className="space-y-4">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center ${
                meeting.status === 'completed' ? 'bg-[#F0F0ED] text-[#6B6B6B]' : 'bg-[#B8FF3B] text-black shadow-gloweffect'
              }`}>
                {meeting.status === 'completed' ? <CheckCircle2 size={40} /> : <Activity size={40} className="animate-pulse" />}
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-black text-[#111111]">Session Details</h1>
                <p className="text-sm font-bold text-[#A1A19D] uppercase tracking-widest">ID: {meeting.id.slice(0, 12)}</p>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-[#F0F0ED]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#F6F6F3] rounded-xl flex items-center justify-center text-[#6B6B6B]">
                  <Calendar size={24} />
                </div>
                <div>
                  <p className="text-xs font-black text-[#A1A19D] uppercase tracking-widest">Date</p>
                  <p className="font-bold text-[#111111]">{format(new Date(meeting.startTime), "MMMM do, yyyy")}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#F6F6F3] rounded-xl flex items-center justify-center text-[#6B6B6B]">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-xs font-black text-[#A1A19D] uppercase tracking-widest">Duration</p>
                  <p className="font-bold text-[#111111]">{calculateDuration(meeting.startTime, meeting.endTime)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-[#F0F0ED]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#F6F6F3] rounded-xl flex items-center justify-center text-[#6B6B6B]">
                  <Users size={24} />
                </div>
                <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest">Participants</h3>
              </div>

              <div className="space-y-4">
                {/* Host */}
                <div className="flex items-center gap-3 p-3 bg-[#F8F8F6] rounded-2xl border border-[#F0F0ED]">
                  <div className="w-10 h-10 rounded-full bg-white border border-[#EAEAEA] flex items-center justify-center overflow-hidden">
                    {meeting.host.image ? (
                      <img src={meeting.host.image} alt={meeting.host.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon size={20} className="text-[#6B6B6B]" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#111111]">{meeting.host.name}</span>
                    <span className="text-[10px] font-black text-[#A1A19D] uppercase tracking-widest">Host</span>
                  </div>
                </div>

                {/* Guest */}
                {meeting.guest ? (
                  <div className="flex items-center gap-3 p-3 bg-[#F8F8F6] rounded-2xl border border-[#F0F0ED]">
                    <div className="w-10 h-10 rounded-full bg-white border border-[#EAEAEA] flex items-center justify-center overflow-hidden">
                      {meeting.guest.image ? (
                        <img src={meeting.guest.image} alt={meeting.guest.name} className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon size={20} className="text-[#6B6B6B]" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#111111]">{meeting.guest.name}</span>
                      <span className="text-[10px] font-black text-[#A1A19D] uppercase tracking-widest">Guest</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-[#F8F8F6]/50 rounded-2xl border border-dashed border-[#EAEAEA] text-center">
                    <span className="text-xs font-medium text-[#A1A19D] italic">Waiting for guest...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Side: AI Summary */}
        <main className="flex-1">
          <div className="bg-white p-10 md:p-16 rounded-[3rem] border border-[#EAEAEA] shadow-soft min-h-full">
            <div className="max-w-3xl mx-auto space-y-12">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#B8FF3B] rounded-full text-[10px] font-black uppercase tracking-widest text-black shadow-sm">
                  AI Intelligence Report
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-[#111111] leading-tight italic">
                  Complete Session Summary
                </h2>
              </div>

              <div className="prose prose-lg max-w-none">
                {meeting.summary ? (
                  <div className="space-y-8">
                     {/* Split by potential markdown sections or just display */}
                     <div className="text-xl leading-relaxed text-[#333333] font-medium whitespace-pre-wrap">
                        {meeting.summary}
                     </div>
                  </div>
                ) : (
                  <div className="p-12 rounded-[2rem] bg-[#F8F8F6] border border-dashed border-[#EAEAEA] text-center space-y-4">
                    <Activity className="mx-auto text-[#D1D1CB] animate-pulse" size={48} />
                    <h3 className="text-xl font-black text-[#111111]">Intelligence Report Pending</h3>
                    <p className="text-[#6B6B6B] font-medium max-w-sm mx-auto">
                      Our AI is currently analyzing your session. Insights will appear here shortly after processing.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
