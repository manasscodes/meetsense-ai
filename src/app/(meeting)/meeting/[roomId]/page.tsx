"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { 
  LiveKitRoom, 
  VideoConference, 
  useLocalParticipant,
  useRoomContext,
  VideoTrack,
  ControlBar,
} from "@livekit/components-react";
import { DataPacket_Kind, Track } from "livekit-client"; 

import "@livekit/components-styles";
import { authClient } from "@/lib/auth-client";
import { AIAssistant } from "@/components/meeting/AIAssistant";
import { VirtualInterviewer } from "@/components/meeting/VirtualInterviewer";
import { LiveCaptions } from "@/components/meeting/LiveCaptions";
import { CaptionControl } from "@/components/meeting/CaptionControl";
import { useTranscription } from "@/hooks/useTranscription";

export default function MeetingPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = params.roomId as string;

  const mode = searchParams.get('mode');
  const role = searchParams.get('role');
  const domain = searchParams.get('domain');
  const experience = searchParams.get('experience');
  
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const [token, setToken] = useState<string | undefined>(undefined);
  const [isAIOpen, setIsAIOpen] = useState(mode === 'interview');
  const [captionLanguage, setCaptionLanguage] = useState<'off' | 'en' | 'hi'>('off');

  useEffect(() => {
    if (!session || !roomId) return;

    async function fetchToken() {
      try {
        const resp = await fetch("/api/livekit-token", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomName: roomId,
            participantName: session?.user?.name,
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

  if (isSessionPending) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#111111] text-white">
        Loading Session...
      </div>
    );
  }

  if (!session) {
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
        <MeetingContent 
          isAIOpen={isAIOpen}
          setIsAIOpen={setIsAIOpen}
          captionLanguage={captionLanguage}
          setCaptionLanguage={setCaptionLanguage}
          mode={mode}
          role={role}
          domain={domain}
          experience={experience}
        />
      </LiveKitRoom>
    </div>
  );
}

function MeetingContent({ 
  isAIOpen, 
  setIsAIOpen, 
  captionLanguage,
  setCaptionLanguage,
  mode,
  role,
  domain,
  experience
}: any) {
  const { isMicrophoneEnabled, localParticipant } = useLocalParticipant();
  const room = useRoomContext();
  const [latestAIMessage, setLatestAIMessage] = useState<string>("");
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  // 1. Transcription Logic with Sync Callback
  const { 
    transcript, 
    isListening, 
    startListening, 
    stopListening,
    addTranscript
  } = useTranscription((text) => {
    console.log("SENDING: Transcript chunk", text);
    try {
      if (room?.localParticipant) {
        const payload = encoder.encode(JSON.stringify({ text }));
        room.localParticipant.publishData(payload, DataPacket_Kind.RELIABLE, [], 'transcript');
      }
    } catch (err) {
      console.error("Manual data publish error:", err);
    }
  });

  // 2. Manual Data Listener for Remote Transcripts
  useEffect(() => {
    if (!room) return;

    const handleData = (payload: Uint8Array, participant: any, kind: any, topic?: string) => {
      // FIX: Added Debug Log
      console.log("RECEIVED EVENT: Topic:", topic); 
      
      if (topic !== 'transcript') return;
      
      try {
        const decoded = decoder.decode(payload);
        console.log("RECEIVED DATA:", decoded);
        const data = JSON.parse(decoded);
        if (data.text) {
          addTranscript(data.text);
        }
      } catch (e) {
        console.error("Data decode error:", e);
      }
    };

    // CRITICAL FIX: Use camelCase 'dataReceived'
    room.on('dataReceived', handleData);
    
    return () => {
      room.off('dataReceived', handleData);
    };
  }, [room, addTranscript]);
  
  // Auto-Start Transcription for Interview
  useEffect(() => {
    if (mode === 'interview') {
      console.log("Interview Mode: Auto-starting transcription...");
      startListening();
    }
  }, [mode, startListening]);

  // Sync Transcription with Mic Mute
  useEffect(() => {
    if (!isMicrophoneEnabled && isListening) {
      console.log("Mic Muted: Stopping Transcription...");
      stopListening();
    }
  }, [isMicrophoneEnabled, isListening, stopListening]);

  const handleLanguageChange = (lang: 'off' | 'en' | 'hi') => {
    setCaptionLanguage(lang);
    if (lang === 'off') {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <>
      <div className="flex-1 relative w-full h-full min-h-screen bg-[#0A0A0A] overflow-hidden">
        {mode === 'interview' ? (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Virtual Interviewer Avatar */}
            <VirtualInterviewer message={latestAIMessage} />
            
            {/* Local Participant PiP */}
            <div className="absolute top-6 right-6 w-56 aspect-video rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl z-20 bg-black">
              {localParticipant && (
                <VideoTrack 
                  trackRef={{ participant: localParticipant, source: Track.Source.Camera }} 
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded text-[10px] font-bold text-white uppercase tracking-wider">
                You
              </div>

              {/* Listening Indicator */}
              {isListening && (
                <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg border border-red-500/20 shadow-lg animate-in fade-in zoom-in duration-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-fast shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                  <span className="text-[9px] font-black text-red-500 uppercase tracking-[0.1em]">Listening</span>
                </div>
              )}
            </div>

            {/* Floating Controls */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[100]">
              <ControlBar 
                variation="minimal" 
                controls={{ chat: false, settings: false, leave: true, screenShare: false }} 
              />
            </div>
          </div>
        ) : (
          <VideoConference />
        )}
      </div>

      {/* Live Captions Overlay */}
      <LiveCaptions 
        transcript={transcript} 
        isListening={isListening} 
        targetLanguage={captionLanguage}
      />

      {/* Caption Control Bar */}
      <CaptionControl 
        language={captionLanguage}
        onLanguageChange={handleLanguageChange}
      />

      {/* Floating AI Toggle Button (only for non-interview or as extra) */}
      {!isAIOpen && mode !== 'interview' && (
        <button
          onClick={() => setIsAIOpen(true)}
          className="fixed top-24 right-6 z-[60] flex items-center gap-2 bg-[#111111]/80 backdrop-blur-md text-white border border-[#333333] hover:bg-[#222222] hover:border-[#B8FF3B] px-4 py-2.5 rounded-full transition-all shadow-lg group"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B8FF3B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-12 transition-transform">
            <path d="M9.937 15.5A 2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
          </svg>
          <span className="font-semibold text-sm tracking-wide">Ask AI</span>
        </button>
      )}

      {/* AI Assistant Logic (Hidden in interview mode UI but running in background) */}
      <div className={mode === 'interview' ? 'hidden' : ''}>
        <AIAssistant 
          isOpen={isAIOpen} 
          onClose={() => setIsAIOpen(false)} 
          transcript={transcript}
          isListening={isListening}
          startListening={startListening}
          stopListening={stopListening}
          mode={mode}
          role={role}
          domain={domain}
          experience={experience}
          onResponse={setLatestAIMessage}
        />
      </div>

      {/* background instance for interview mode to keep logic running */}
      {mode === 'interview' && (
        <AIAssistant 
          isOpen={true} // Must be open for interview logic to trigger initial message
          onClose={() => {}} 
          transcript={transcript}
          isListening={isListening}
          startListening={startListening}
          stopListening={stopListening}
          mode={mode}
          role={role}
          domain={domain}
          experience={experience}
          onResponse={setLatestAIMessage}
        />
      )}
      <style jsx>{`
        @keyframes pulse-fast {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }
        .animate-pulse-fast {
          animation: pulse-fast 1s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}