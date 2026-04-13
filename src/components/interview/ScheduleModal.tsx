"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, Clock, Mail, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { scheduleMeeting } from "@/actions/meeting";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScheduleModal({ open, onOpenChange }: ScheduleModalProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const startDateTime = new Date(`${date}T${time}`);
      const result = await scheduleMeeting(startDateTime, 'interview', email || undefined);
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onOpenChange(false);
          setSuccess(false);
          setDate("");
          setTime("");
          setEmail("");
        }, 2000);
      } else {
        alert("Failed to schedule interview.");
      }
    } catch (error) {
      console.error("Scheduling error:", error);
      alert("Invalid date or time.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white rounded-[2.5rem] max-w-lg border-none p-10 shadow-2xl overflow-hidden relative">
        {success ? (
          <div className="py-10 flex flex-col items-center text-center space-y-4 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-[#B8FF3B] rounded-full flex items-center justify-center text-black shadow-gloweffect mb-4">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-3xl font-black text-[#111111]">Interview Scheduled!</h2>
            <p className="text-[#6B6B6B] font-medium max-w-xs">
              The session has been added to your calendar. You can invite your guest using the link.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader className="mb-8">
              <div className="flex items-center gap-2 px-3 py-1 bg-[#111111]/5 rounded-full w-fit mb-4">
                 <CalendarIcon size={12} className="text-[#111111]" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#111111]">Scheduler</span>
              </div>
              <DialogTitle className="text-4xl font-black text-[#111111] italic leading-tight">
                Plan Your <br /> Next Interview
              </DialogTitle>
              <DialogDescription className="text-[#6B6B6B] font-medium text-lg mt-2">
                Set a time and date for your session. It will automatically appear in your calendar.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-[#111111]">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-[#A1A19D] ml-2">Date</label>
                   <div className="relative group">
                     <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D1D1CB] group-focus-within:text-black transition-colors" size={18} />
                     <Input 
                        required
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="h-14 pl-12 rounded-2xl bg-[#F0F0ED] border-none font-bold focus-visible:ring-2 focus-visible:ring-[#B8FF3B]" 
                     />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-[#A1A19D] ml-2">Time</label>
                   <div className="relative group">
                     <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D1D1CB] group-focus-within:text-black transition-colors" size={18} />
                     <Input 
                        required
                        type="time" 
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="h-14 pl-12 rounded-2xl bg-[#F0F0ED] border-none font-bold focus-visible:ring-2 focus-visible:ring-[#B8FF3B]" 
                     />
                   </div>
                </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-[#A1A19D] ml-2">Guest Email (Optional)</label>
                 <div className="relative group text-[#111111]">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D1D1CB] group-focus-within:text-black transition-colors" size={18} />
                    <Input 
                        type="email" 
                        placeholder="candidate@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-14 pl-12 rounded-2xl bg-[#F0F0ED] border-none font-bold focus-visible:ring-2 focus-visible:ring-[#B8FF3B]" 
                    />
                 </div>
              </div>

              <div className="pt-4">
                <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-16 bg-black text-white hover:bg-gray-800 rounded-2xl text-lg font-black shadow-soft transition-all active:scale-[0.98] relative overflow-hidden"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={24} />
                    ) : (
                        "Confirm Schedule"
                    )}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
