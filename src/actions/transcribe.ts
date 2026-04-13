"use server";

import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function transcribeChunk(formData: FormData) {
  try {
    const file = formData.get("audio") as File;
    
    if (!file || file.size === 0) {
      return { text: "" };
    }

    const transcription = await groq.audio.transcriptions.create({
      file,
      model: "whisper-large-v3-turbo",
      response_format: "json",
    });

    return { text: transcription.text || "" };
  } catch (error) {
    console.error("transcribeChunk Error:", error);
    // Don't throw here to avoid crashing the client-side loop, just return empty
    return { text: "", error: "Transcription failed" };
  }
}
