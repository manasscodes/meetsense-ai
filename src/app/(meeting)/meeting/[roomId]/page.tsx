"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  LiveKitRoom,
  VideoConference,
  useLocalParticipant,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useUser } from "@clerk/nextjs";
import { endMeeting, joinMeeting, getMeeting, saveTranscript } from "@/actions/meeting";
import { getUserProfile } from "@/actions/profile";
import { generateMeetingSummary } from "@/actions/ai";
import { useTranscription } from "@/hooks/useTranscription";
import { InterviewerPanel } from "@/components/interview/InterviewerPanel";

export default function MeetingPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;

  const { user, isLoaded } = useUser();
  const [token, setToken] = useState<string | undefined>(undefined);
  const [role, setRole] = useState<'host' | 'guest' | null>(null);
  const [meetingType, setMeetingType] = useState<string | null>(null);
  const [jobTitle, setJobTitle] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !user || !roomId) return;

    async function initializeSession() {
      try {
        // 1. Fetch meeting and profile
        const [meeting, profile] = await Promise.all([
          getMeeting(roomId),
          getUserProfile()
        ]);

        if (meeting) {
          setRole(meeting.hostId === user?.id ? 'host' : 'guest');
          setMeetingType(meeting.type);
        }

        if (profile) {
          setJobTitle(profile.jobTitle);
        }

        // 2. Fetch Token
        const resp = await fetch("/api/livekit-token", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomName: roomId,
          }),
        });

        const data = await resp.json();
        if (data.token) {
          setToken(data.token);
          // 3. Track Participant in background
          joinMeeting(roomId).catch(console.error);
        } else {
          console.error("Failed to get token:", data.error);
        }
      } catch (e) {
        console.error("Initialization error:", e);
      }
    }

    initializeSession();
  }, [roomId, user, isLoaded]);

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#111111] text-white">
        Loading Session...
      </div>
    );
  }

  if (!user) {
    router.push("/sign-in");
    return null;
  }

  if (!token || !role) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#111111] text-white gap-4">
        <div className="w-12 h-12 border-4 border-[#B8FF3B] border-t-transparent rounded-full animate-spin" />
        <p className="font-medium animate-pulse">Connecting to Room...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#0A0A0A]">
      <TranscriptionWrapper 
        roomId={roomId} 
        role={role} 
        token={token} 
        isInterview={meetingType === 'interview'}
        jobTitle={jobTitle}
      />
    </div>
  );
}

function TranscriptionWrapper({ 
  roomId, 
  role, 
  token, 
  isInterview,
  jobTitle 
}: { 
  roomId: string; 
  role: 'host' | 'guest'; 
  token: string;
  isInterview: boolean;
  jobTitle: string | null;
}) {
  const router = useRouter();
  const { transcript, startRecording, stopRecording } = useTranscription();

  const handleDisconnect = async () => {
    // 1. Redirect immediately
    router.push("/dashboard");

    // 2. Process data in background
    stopRecording();
    
    if (transcript.trim()) {
      await saveTranscript(roomId, transcript, role);
    }

    await endMeeting(roomId);
    await generateMeetingSummary(roomId);
  };

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      onDisconnected={handleDisconnect}
      data-lk-theme="default"
      className="h-full w-full"
    >
      <MeetingContent onToggleTranscription={(active) => active ? startRecording() : stopRecording()} />
      
      {/* Interviewer Panel: Only for Host AND Interview Meeting */}
      {isInterview && role === 'host' && jobTitle && (
        <InterviewerPanel jobTitle={jobTitle} />
      )}
    </LiveKitRoom>
  );
}

function MeetingContent({ onToggleTranscription }: { onToggleTranscription: (active: boolean) => void }) {
  const { isMicrophoneEnabled } = useLocalParticipant();

  // Watch mic status
  useEffect(() => {
    onToggleTranscription(isMicrophoneEnabled);
  }, [isMicrophoneEnabled, onToggleTranscription]);

  return (
    <VideoConference />
  );
}