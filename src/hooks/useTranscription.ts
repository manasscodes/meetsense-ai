"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export function useTranscription(onTranscriptChunk?: (text: string) => void) {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const addTranscript = useCallback((text: string) => {
    if (!text.trim()) return;
    setTranscript((prev) => prev + (prev ? " " : "") + text.trim());
  }, []);

  const sendAudioToServer = async (blob: Blob) => {
    if (blob.size < 1000) return; // Skip very small chunks

    const formData = new FormData();
    formData.append("file", blob);

    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.text && data.text.trim()) {
        const text = data.text.trim();
        addTranscript(text);
        if (onTranscriptChunk) {
          onTranscriptChunk(text);
        }
      }
    } catch (error) {
      console.error("Transcription error:", error);
    }
  };

  const captureChunk = useCallback(() => {
    if (!streamRef.current || !isListening) return;

    try {
      const recorder = new MediaRecorder(streamRef.current);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        if (chunks.length > 0) {
          const blob = new Blob(chunks, { type: "audio/webm" });
          sendAudioToServer(blob);
        }
        
        // Loop: Start next chunk if still listening
        if (isListening) {
          timeoutRef.current = setTimeout(captureChunk, 200); 
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;

      // Record for 2 seconds
      setTimeout(() => {
        if (recorder.state === "recording") {
          recorder.stop();
        }
      }, 2000);

    } catch (err) {
      console.error("MediaRecorder start error:", err);
      setIsListening(false);
    }
  }, [isListening]);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setIsListening(true);
      setTranscript(""); // Clear transcript on start
    } catch (error) {
      console.error("Microphone access denied:", error);
    }
  };

  const stopListening = useCallback(() => {
    setIsListening(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isListening) {
      captureChunk();
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isListening, captureChunk]);

  return { transcript, isListening, startListening, stopListening, addTranscript };
}