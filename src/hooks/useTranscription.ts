"use client";

import { useState, useRef, useCallback } from "react";
import { transcribeChunk } from "@/actions/transcribe";

export function useTranscription() {
  const [transcript, setTranscript] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    // If already recording, don't start again
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") 
        ? "audio/webm;codecs=opus" 
        : "audio/webm";

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          const blob = new Blob([event.data], { type: "audio/webm" });
          
          // Skip if chunk is too small (silence or empty)
          if (blob.size < 1000) return;

          const formData = new FormData();
          const file = new File([blob], "audio.webm", { type: "audio/webm" });
          formData.append("audio", file);

          try {
            const response = await transcribeChunk(formData);
            if (response.text) {
              setTranscript((prev) => (prev ? prev + " " + response.text : response.text));
            }
          } catch (error) {
            console.error("Transcription chunk error:", error);
          }
        }
      };

      // Record in 5-second intervals
      mediaRecorder.start(5000);
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
  }, []);

  return { transcript, startRecording, stopRecording };
}
