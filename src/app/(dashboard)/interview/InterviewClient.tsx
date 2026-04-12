'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Video, UserPlus, Copy, ArrowRight, Play, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteProfile } from "@/actions/profile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface DashboardClientProps {
  role: 'interviewer' | 'interviewee';
}

export function InterviewClient({ role }: DashboardClientProps) {
  const router = useRouter();
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");
  const [joinValue, setJoinValue] = useState("");

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 12);
  };

  const handleStartMeeting = () => {
    const roomId = generateRoomId();
    const link = `${window.location.origin}/meeting/${roomId}`;
    setMeetingLink(link);
    setShowMeetingModal(true);
  };

  const handleJoinMeeting = () => {
    if (joinValue) {
      if (joinValue.startsWith('http')) {
        router.push(joinValue);
      } else {
        router.push(`/meeting/${joinValue}`);
      }
    }
  };

  const handleResetRole = async () => {
    if (confirm("Are you sure you want to change your role? This will reset your interview profile.")) {
      const result = await deleteProfile();
      if (result.success) {
        router.refresh();
      } else {
        alert("Failed to reset role.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button 
          onClick={handleResetRole}
          className="flex items-center gap-2 text-[#6B6B6B] hover:text-black transition-colors text-sm font-bold bg-[#F0F0ED] px-4 py-2 rounded-xl"
        >
          <RefreshCw size={14} />
          Change Role
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Role-Based Primary Action */}
      {role === 'interviewer' ? (
        <section className="bg-white p-10 rounded-[2.5rem] border border-[#EAEAEA] shadow-soft flex flex-col justify-between group hover:border-[#B8FF3B] transition-all">
          <div>
            <div className="w-16 h-16 bg-[#B8FF3B] rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Video className="text-black" size={32} />
            </div>
            <h2 className="text-3xl font-black text-[#111111] mb-4">Start an Interview</h2>
            <p className="text-[#6B6B6B] font-medium text-lg leading-relaxed mb-10">
              Create a high-quality video room instantly. Share the generated link with your candidates to begin.
            </p>
          </div>
          <Button 
            onClick={handleStartMeeting}
            className="w-full h-16 bg-black text-white hover:bg-gray-800 rounded-2xl text-lg font-black flex items-center justify-center gap-3 transition-all"
          >
            Start New Meeting
            <ArrowRight size={20} />
          </Button>
        </section>
      ) : (
        <section className="bg-white p-10 rounded-[2.5rem] border border-[#EAEAEA] shadow-soft flex flex-col justify-between group hover:border-[#B8FF3B] transition-all">
          <div>
            <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mb-8 text-accent group-hover:scale-110 transition-transform">
              <UserPlus size={32} />
            </div>
            <h2 className="text-3xl font-black text-[#111111] mb-4">Join an Interview</h2>
            <p className="text-[#6B6B6B] font-medium text-lg leading-relaxed mb-10">
              Enter the meeting ID or full link provided by your interviewer to join the session.
            </p>
          </div>
          <div className="space-y-4">
            <Input 
              value={joinValue}
              onChange={(e) => setJoinValue(e.target.value)}
              placeholder="Enter meeting ID or link" 
              className="h-16 rounded-2xl bg-[#F0F0ED] border-none text-lg font-medium"
            />
            <Button 
              onClick={handleJoinMeeting}
              disabled={!joinValue}
              className="w-full h-16 bg-black text-white hover:bg-gray-800 rounded-2xl text-lg font-black flex items-center justify-center gap-3 transition-all"
            >
              Join Room
              <Play size={20} fill="currentColor" />
            </Button>
          </div>
        </section>
      )}

      {/* Secondary Quick Info Card */}
      <section className="bg-[#111111] p-10 rounded-[2.5rem] text-white flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 rounded-full blur-[80px]" />
        <h3 className="text-2xl font-black mb-6 relative z-10">AI Prep Tips</h3>
        <ul className="space-y-4 relative z-10">
          <li className="flex items-start gap-3">
             <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-1">
                <div className="w-2 h-2 bg-accent rounded-full" />
             </div>
             <p className="text-gray-400 font-medium">Ensure you have a stable internet connection and good lighting.</p>
          </li>
          <li className="flex items-start gap-3">
             <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-1">
                <div className="w-2 h-2 bg-accent rounded-full" />
             </div>
             <p className="text-gray-400 font-medium">Test your microphone and camera before starting the session.</p>
          </li>
          <li className="flex items-start gap-3">
             <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-1">
                <div className="w-2 h-2 bg-accent rounded-full" />
             </div>
             <p className="text-gray-400 font-medium">Our AI will track your confidence levels and provide a score.</p>
          </li>
        </ul>
      </section>

      {/* Meeting Link Modal */}
      <Dialog open={showMeetingModal} onOpenChange={setShowMeetingModal}>
        <DialogContent className="bg-white rounded-[2rem] max-w-lg border-none p-10">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-black text-[#111111]">Interview Room Ready!</DialogTitle>
            <DialogDescription className="text-[#6B6B6B] font-medium text-base">
              Share this identifier with your interviewee. They can join using the link or the ID.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-[#F0F0ED] rounded-2xl">
              <Input readOnly value={meetingLink} className="bg-transparent border-none text-sm font-bold truncate focus-visible:ring-0" />
              <Button 
                size="sm" 
                className="bg-black text-white hover:bg-gray-800 rounded-xl px-4"
                onClick={() => {
                  navigator.clipboard.writeText(meetingLink);
                }}
              >
                <Copy size={16} />
              </Button>
            </div>

            <Button 
              onClick={() => router.push(meetingLink)}
              className="w-full h-16 bg-[#B8FF3B] text-black hover:bg-[#a3e635] rounded-2xl text-lg font-black shadow-gloweffect"
            >
              Enter Interview Room
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  </div>
);
}
