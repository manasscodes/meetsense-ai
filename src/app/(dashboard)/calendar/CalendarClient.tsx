"use client";

import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format, isSameDay, isWithinInterval, addMinutes, subMinutes } from "date-fns";
import { Calendar as CalendarIcon, Clock, Users, Play, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Meeting {
  id: string;
  startTime: Date;
  type: string;
  status: 'scheduled' | 'live' | 'completed';
}

export function CalendarClient({ initialMeetings }: { initialMeetings: Meeting[] }) {
  const [value, onChange] = useState<any>(new Date());
  const [meetings] = useState(initialMeetings);
  const router = useRouter();

  // Highlight days with meetings
  const tileClassName = ({ date, view }: any) => {
    if (view === 'month') {
      const hasMeeting = meetings.some(m => isSameDay(new Date(m.startTime), date));
      return hasMeeting ? "has-meeting" : null;
    }
    return null;
  };

  const selectedDateMeetings = meetings.filter(m => isSameDay(new Date(m.startTime), value));

  const canJoin = (startTime: Date) => {
    const now = new Date();
    const start = new Date(startTime);
    // Allow joining 15 mins before and until 15 mins after start time if scheduled
    return isWithinInterval(now, {
      start: subMinutes(start, 15),
      end: addMinutes(start, 60), // Allow joining up to an hour after start
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Calendar View */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-[#EAEAEA] shadow-soft overflow-hidden calendar-container">
          <Calendar 
            onChange={onChange} 
            value={value} 
            tileClassName={tileClassName}
            className="w-full border-none font-sans"
          />
        </div>

        <style jsx global>{`
          .calendar-container .react-calendar {
            width: 100%;
            border: none;
            font-family: inherit;
          }
          .calendar-container .react-calendar__navigation button {
            color: #111111;
            font-weight: 900;
            font-size: 1.25rem;
            text-transform: uppercase;
            letter-spacing: -0.02em;
          }
          .calendar-container .react-calendar__month-view__weekdays {
            font-weight: 900;
            text-transform: uppercase;
            font-size: 0.75rem;
            letter-spacing: 0.1em;
            color: #A1A19D;
            margin-bottom: 1rem;
          }
          .calendar-container .react-calendar__tile {
            padding: 1.5rem 0.5rem;
            font-weight: 700;
            border-radius: 1.25rem;
            transition: all 0.2s;
            position: relative;
          }
          .calendar-container .react-calendar__tile--now {
            background: #F0F0ED;
            color: #111111;
          }
          .calendar-container .react-calendar__tile--active {
            background: #B8FF3B !important;
            color: black !important;
            box-shadow: 0 10px 20px -5px rgba(184, 255, 59, 0.4);
          }
          .calendar-container .react-calendar__tile:hover {
            background: #F8F8F6;
          }
          .calendar-container .has-meeting::after {
            content: '';
            position: absolute;
            bottom: 6px;
            left: 50%;
            transform: translateX(-50%);
            width: 4px;
            height: 4px;
            background: #B8FF3B;
            border-radius: full;
          }
          .calendar-container .react-calendar__tile--active.has-meeting::after {
            background: black;
          }
        `}</style>
      </div>

      {/* Agenda View */}
      <div className="lg:col-span-5 space-y-8">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center">
                 <CalendarIcon size={20} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#111111] italic">{format(value, "MMMM do")}</h3>
                <p className="text-xs font-black uppercase tracking-widest text-[#A1A19D]">Agenda for Today</p>
              </div>
           </div>
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
          {selectedDateMeetings.length > 0 ? (
            selectedDateMeetings.map((meeting) => (
              <div 
                key={meeting.id}
                className="bg-white p-6 rounded-3xl border border-[#EAEAEA] shadow-soft hover:border-[#B8FF3B]/50 transition-all space-y-6"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-[#F0F0ED] rounded-full text-[#6B6B6B]">
                      {meeting.type}
                    </span>
                    <h4 className="text-lg font-black text-[#111111]">Interview Session</h4>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-[#111111]">
                    <Clock size={14} className="text-[#A1A19D]" />
                    {format(new Date(meeting.startTime), "HH:mm")}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                   <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#111111]/5 flex items-center justify-center text-[#A1A19D]">
                         <Users size={14} />
                      </div>
                      <span className="text-xs font-bold text-[#6B6B6B]">2 Participants</span>
                   </div>

                   {meeting.status === 'scheduled' && canJoin(meeting.startTime) ? (
                     <Button 
                        onClick={() => router.push(`/meeting/${meeting.id}`)}
                        className="bg-[#B8FF3B] text-black hover:bg-[#a3e635] rounded-xl font-black px-4 h-10 shadow-gloweffect gap-2"
                     >
                        Join Now
                        <Play size={14} fill="currentColor" />
                     </Button>
                   ) : meeting.status === 'completed' ? (
                     <span className="text-xs font-black uppercase tracking-widest text-[#A1A19D] flex items-center gap-1">
                        <CheckCircle2 size={14} className="text-[#B8FF3B]" />
                        Completed
                     </span>
                   ) : (
                     <span className="text-xs font-black uppercase tracking-widest text-[#A1A19D] flex items-center gap-1">
                        <AlertCircle size={14} />
                        Upcoming
                     </span>
                   )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#F8F8F6] p-12 rounded-[2.5rem] border border-dashed border-[#D1D1CB] text-center space-y-3">
               <Clock className="mx-auto text-[#D1D1CB]" size={32} />
               <p className="text-sm font-bold text-[#A1A19D]">No sessions scheduled <br /> for this date.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
