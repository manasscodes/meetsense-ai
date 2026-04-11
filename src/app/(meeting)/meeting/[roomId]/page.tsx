"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  LiveKitRoom, 
  VideoConference, 
} from "@livekit/components-react";
import "@livekit/components-styles";
import { authClient } from "@/lib/auth-client";

export default function MeetingPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;
  
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!session || !roomId) return;

    async function fetchToken() {
      try {
        const resp = await fetch("/api/livekit-token", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' }, // IMPORTANT: Added headers
          body: JSON.stringify({
            roomName: roomId,
            participantName: session.user.name,
          }),
        });
        
        const data = await resp.json();
        if (data.token) {
          setToken(data.token);
        } else {
          console.error("Failed to get token:", data.error);
        }
      } catch (e) {
        console.error("Token fetch error:", e);
      }
    }

    fetchToken();
  }, [roomId, session]);

  // 1. Wait for Session
  if (isSessionPending) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#111111] text-white">
        Loading Session...
      </div>
    );
  }

  // 2. Redirect if not logged in
  if (!session) {
    router.push("/sign-in");
    return null;
  }

  // 3. CRITICAL: Wait for Token before rendering Room
  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#111111] text-white gap-4">
        <div className="w-12 h-12 border-4 border-[#B8FF3B] border-t-transparent rounded-full animate-spin" />
        <p className="font-medium animate-pulse">Connecting to Room...</p>
      </div>
    );
  }

  // 4. Render Room
  return (
    <div className="h-full w-full">
      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        onDisconnected={() => router.push("/dashboard")}
        data-lk-theme="default"
        className="h-screen w-screen"
      >
        <VideoConference />
      </LiveKitRoom>
    </div>
  );
}