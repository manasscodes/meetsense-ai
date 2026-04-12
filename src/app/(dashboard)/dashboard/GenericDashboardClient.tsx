'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Video, Keyboard, ArrowRight, Play, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createMeeting } from "@/actions/meeting";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function GenericDashboardClient() {
  const router = useRouter();
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");
  const [joinValue, setJoinValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStartMeeting = async () => {
    setLoading(true);
    const result = await createMeeting();
    setLoading(false);

    if (result.success && result.meetingId) {
      const link = `${window.location.origin}/meeting/${result.meetingId}`;
      setMeetingLink(link);
      setShowMeetingModal(true);
    } else {
      alert("Failed to start meeting. Please try again.");
    }
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Start Meeting Card */}
      <section className="bg-white p-10 rounded-[2.5rem] border border-[#EAEAEA] shadow-soft flex flex-col justify-between group hover:border-[#B8FF3B] transition-all">
        <div>
          <div className="w-16 h-16 bg-[#B8FF3B] rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform text-black">
            <Video size={32} />
          </div>
          <h2 className="text-3xl font-black text-[#111111] mb-4">Host a Meeting</h2>
          <p className="text-[#6B6B6B] font-medium text-lg leading-relaxed mb-10">
            Create a private video room instantly. No setup required, just share the link.
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

      {/* Join Meeting Card */}
      <section className="bg-white p-10 rounded-[2.5rem] border border-[#EAEAEA] shadow-soft flex flex-col justify-between group hover:border-[#B8FF3B] transition-all">
        <div>
          <div className="w-16 h-16 bg-[#F0F0ED] rounded-2xl flex items-center justify-center mb-8 text-[#6B6B6B] group-hover:bg-[#B8FF3B]/20 group-hover:text-black transition-all">
            <Keyboard size={32} />
          </div>
          <h2 className="text-3xl font-black text-[#111111] mb-4">Join with Code</h2>
          <p className="text-[#6B6B6B] font-medium text-lg leading-relaxed mb-10">
            Have a meeting code or link? Enter it here to jump into the conversation.
          </p>
        </div>
        <div className="space-y-4">
          <Input 
            value={joinValue}
            onChange={(e) => setJoinValue(e.target.value)}
            placeholder="Room ID or Link" 
            className="h-16 rounded-2xl bg-[#F0F0ED] border-none text-lg font-medium focus-visible:ring-2 focus-visible:ring-[#B8FF3B]"
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

      {/* Links Modal */}
      <Dialog open={showMeetingModal} onOpenChange={setShowMeetingModal}>
        <DialogContent className="bg-white rounded-[2rem] max-w-lg border-none p-10">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-black text-[#111111]">Meeting Room Ready!</DialogTitle>
            <DialogDescription className="text-[#6B6B6B] font-medium text-base">
              Share this link with participants. Anyone with this link can join the meeting.
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
              Join Meeting Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
