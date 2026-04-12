"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  LiveKitRoom, 
  VideoConference, 
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useUser } from "@clerk/nextjs";
import { endMeeting, joinMeeting } from "@/actions/meeting";

export default function MeetingPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;
  
  const { user, isLoaded } = useUser();
  const [token, setToken] = useState<string | undefined>(undefined);

  const handleDisconnect = async () => {
    await endMeeting(roomId);
    router.push("/dashboard");
  };

  useEffect(() => {
    if (!isLoaded || !user || !roomId) return;

    async function fetchToken() {
      try {
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
          // 2. Track Participant (Guest Logic handled inside action)
          await joinMeeting(roomId);
        } else {
          console.error("Failed to get token:", data.error);
        }
      } catch (e) {
        console.error("Token fetch error:", e);
      }
    }

    fetchToken();
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

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#111111] text-white gap-4">
        <div className="w-12 h-12 border-4 border-[#B8FF3B] border-t-transparent rounded-full animate-spin" />
        <p className="font-medium animate-pulse">Connecting to Room...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#0A0A0A]">
      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        onDisconnected={handleDisconnect}
        data-lk-theme="default"
        className="h-full w-full"
      >
        <VideoConference />
      </LiveKitRoom>
    </div>
  );
}