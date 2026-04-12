"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function DashboardPage() {
  const router = useRouter();
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");
  
  // Interview State
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewConfig, setInterviewConfig] = useState({
    role: "Software Engineer",
    domain: "Frontend",
    experience: "Fresher"
  });

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  const handleStartMeeting = () => {
    const roomId = generateRoomId();
    const link = `${window.location.origin}/meeting/${roomId}`;
    setMeetingLink(link);
    setShowMeetingModal(true);
  };

  const handleJoinMeeting = () => {
    // Logic for joining via input (simplified for brevity)
    const input = (document.getElementById('meeting-input') as HTMLInputElement)?.value;
    if (input) {
      router.push(input);
    }
  };

  const handleStartInterview = () => {
    const roomId = generateRoomId();
    // Redirect with query params for interview mode
    const url = `/meeting/${roomId}?mode=interview&role=${encodeURIComponent(interviewConfig.role)}&domain=${interviewConfig.domain}`;
    router.push(url);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Welcome to MeetSense
        </h1>
        <p className="text-gray-500 mt-2">
          Ready for your next AI-powered interview session?
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Standard Meeting Button */}
        <Button 
          onClick={handleStartMeeting}
          className="bg-[#B8FF3B] text-black hover:bg-[#a3e635] px-8 py-6 text-lg font-semibold rounded-full shadow-lg shadow-[#B8FF3B]/20"
        >
          Start New Meeting
        </Button>

        {/* Interview Button */}
        <Button 
          onClick={() => setShowInterviewModal(true)}
          variant="outline"
          className="border-[#B8FF3B] text-black hover:bg-[#B8FF3B]/10 px-8 py-6 text-lg font-semibold rounded-full"
        >
          Start Mock Interview
        </Button>
      </div>

      {/* Join Meeting Card */}
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-soft border border-[#EAEAEA] mt-4">
        <h3 className="text-lg font-semibold mb-2">Join a Meeting</h3>
        <div className="flex gap-2">
          <Input 
            id="meeting-input"
            placeholder="Enter meeting link or code" 
            className="rounded-full bg-[#F0F0ED] border-none"
          />
          <Button onClick={handleJoinMeeting} variant="secondary" className="rounded-full">Join</Button>
        </div>
      </div>

      {/* --- Modals --- */}

      {/* Meeting Link Modal */}
      <Dialog open={showMeetingModal} onOpenChange={setShowMeetingModal}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Meeting Ready!</DialogTitle>
            <DialogDescription>
              Share this link with others to join.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <Input readOnly value={meetingLink} className="bg-[#F0F0ED]" />
            <Button 
              type="submit" 
              size="sm" 
              className="px-3 bg-[#B8FF3B] text-black hover:bg-[#a3e635]"
              onClick={() => {
                navigator.clipboard.writeText(meetingLink);
                alert("Link copied!");
              }}
            >
              Copy
            </Button>
          </div>
          <DialogFooter>
            <Button 
              onClick={() => router.push(meetingLink)}
              className="w-full bg-black text-white hover:bg-gray-800 rounded-full"
            >
              Join Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Interview Config Modal */}
      <Dialog open={showInterviewModal} onOpenChange={setShowInterviewModal}>
        <DialogContent className="bg-white max-w-md">
          <DialogHeader>
            <DialogTitle>Setup Mock Interview</DialogTitle>
            <DialogDescription>
              Configure your interview preferences.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Input 
                value={interviewConfig.role}
                onChange={(e) => setInterviewConfig({...interviewConfig, role: e.target.value})}
                placeholder="e.g., Software Engineer"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Domain</label>
              <select 
                className="w-full p-2 border rounded-lg bg-white"
                value={interviewConfig.domain}
                onChange={(e) => setInterviewConfig({...interviewConfig, domain: e.target.value})}
              >
                <option>Frontend</option>
                <option>Backend</option>
                <option>Full Stack</option>
                <option>AI/ML</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Experience</label>
              <select 
                className="w-full p-2 border rounded-lg bg-white"
                value={interviewConfig.experience}
                onChange={(e) => setInterviewConfig({...interviewConfig, experience: e.target.value})}
              >
                <option>Fresher</option>
                <option>Mid-Level</option>
                <option>Senior</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button 
              onClick={handleStartInterview}
              className="w-full bg-[#B8FF3B] text-black hover:bg-[#a3e635] rounded-full py-6"
            >
              Begin Interview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}