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
  
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchToken() {
      try {
        if (!session) return;

        const resp = await fetch("/api/livekit-token", {
          method: "POST",
          body: JSON.stringify({
            roomName: roomId,
            participantName: session.user.name,
          }),
        });
        
        const data = await resp.json();
        
        if (data.token) {
          setToken(data.token);
        } else {
          setError(data.error || "Failed to fetch token");
        }
      } catch (e) {
        console.error("Token fetch error:", e);
        setError("An unexpected error occurred");
      }
    }

    if (roomId && session) {
      fetchToken();
    }
  }, [roomId, session]);

  if (isSessionPending) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white gap-4">
        <div className="w-12 h-12 border-4 border-[#B8FF3B] border-t-transparent rounded-full animate-spin" />
        <p className="font-medium animate-pulse">Verifying session...</p>
      </div>
    );
  }

  if (!session) {
    router.push("/sign-in");
    return null;
  }

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
