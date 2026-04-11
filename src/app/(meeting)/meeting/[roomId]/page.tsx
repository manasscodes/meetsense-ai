"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  LiveKitRoom, 
  VideoConference, 
} from "@livekit/components-react";
import "@livekit/components-styles";
import { authClient } from "@/lib/auth-client";
import { AIAssistant } from "@/components/meeting/AIAssistant";

export default function MeetingPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;
  
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const [token, setToken] = useState<string | undefined>(undefined);
  const [isAIOpen, setIsAIOpen] = useState(false);

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
    <div className="h-full w-full relative">
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

        {/* Floating AI Toggle Button */}
        {!isAIOpen && (
          <button
            onClick={() => setIsAIOpen(true)}
            className="fixed top-24 right-6 z-[60] flex items-center gap-2 bg-[#111111]/80 backdrop-blur-md text-white border border-[#333333] hover:bg-[#222222] hover:border-[#B8FF3B] px-4 py-2.5 rounded-full transition-all shadow-lg group"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B8FF3B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-12 transition-transform">
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
            </svg>
            <span className="font-semibold text-sm tracking-wide">Ask AI</span>
          </button>
        )}

        {/* AI Assistant Panel */}
        <AIAssistant 
          isOpen={isAIOpen} 
          onClose={() => setIsAIOpen(false)} 
        />
      </LiveKitRoom>
    </div>
  );
}