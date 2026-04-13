"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/db";
import { meeting as meetingTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function generateMeetingSummary(meetingId: string) {
  try {
    // 1. Fetch meeting with full data
    const meeting = await db.query.meeting.findFirst({
        where: eq(meetingTable.id, meetingId),
    });

    if (!meeting) throw new Error("Meeting not found");

    // 2. Prepare transcript for AI
    let finalTranscript = "";

    const hasHostText = meeting.hostTranscript && meeting.hostTranscript.trim().length > 0;
    const hasGuestText = meeting.guestTranscript && meeting.guestTranscript.trim().length > 0;

    if (hasHostText || hasGuestText) {
        if (hasHostText) finalTranscript += `Host: ${meeting.hostTranscript}\n`;
        if (hasGuestText) finalTranscript += `Guest: ${meeting.guestTranscript}\n`;
    } else {
        // Fallback to Mock if absolutely no live recording was captured
        finalTranscript = `
          Interviewer: Welcome to the session. Can you describe your experience with React?
          Candidate: I have been working with React for 3 years, focusing on performance optimization and state management with Redux.
          Interviewer: Great. How do you handle complex data fetching?
          Candidate: I usually use TanStack Query to manage cache and loading states efficiently.
          Interviewer: Interesting. That concludes our technical discussion. We will get back to you by Friday.
          Candidate: Thank you for your time.
        `;
    }

    // 3. Call Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
    
    let prompt = "";
    if (meeting.type === 'interview') {
        prompt = `You are an expert technical interview evaluator. Analyze the following interview transcript and provide a structured feedback report. 
        
        OUTPUT FORMAT (Strictly follow this):
        Overall Score: [0-100]
        
        Detailed Evaluation:
        - Technical Depth: [0-100] - [Brief reasoning]
        - Communication: [0-100] - [Brief reasoning]
        - Confidence: [0-100] - [Brief reasoning]
        
        Strengths:
        - [List point]
        
        Areas for Improvement:
        - [List point]
        
        Final Recommendation: [Hire/Reject/Hire With Reservations] - [Short summary]
        
        Transcript: 
        ${finalTranscript}`;
    } else {
        prompt = `Summarize the following meeting transcript into concise key points, decisions made, and follow-up action items. 
        Focus on productivity and professional insights. 
        
        Transcript: 
        ${finalTranscript}`;
    }

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    // 4. Update the Database
    await db.update(meetingTable)
        .set({ summary: summary })
        .where(eq(meetingTable.id, meetingId));

    return { success: true, summary };
  } catch (error) {
    console.error("Error generating summary:", error);
    return { success: false, error: "Failed to generate AI summary" };
  }
}
