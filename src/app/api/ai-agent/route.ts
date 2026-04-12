import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { prompt, context, mode, role, domain, experience } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);
    
    const systemInstruction = mode === 'interview'
      ? `You are Alex, an expert Senior Technical Interviewer for a ${role} position in the ${domain} domain. The candidate is a ${experience}. Ask concise, relevant questions one by one. Wait for the candidate's answer. Do not talk over them.`
      : "You are a helpful meeting assistant. You can summarize, translate between English and Hindi, and explain technical concepts.";

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: systemInstruction,
    });

    let finalPrompt = context 
      ? `Meeting Transcript so far: \n${context}\n\nUser Question: ${prompt}` 
      : prompt;

    if (mode === 'interview' && prompt.startsWith("Start the interview")) {
      finalPrompt = `Introduce yourself as Alex, an expert Senior Technical Interviewer, and start the interview for the role of ${role} in the ${domain} domain for a candidate with ${experience} experience by asking the first technical question. Make the introduction feel natural and professional.`;
    }
    
    const result = await model.generateContent(finalPrompt);


    const response = await result.response;
    const text = response.text();
    
    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
