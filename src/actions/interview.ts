"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function generateNextQuestion(jobTitle: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `You are an expert technical interviewer. The candidate is interviewing for a ${jobTitle} position. 
    Generate ONE difficult technical interview question that specifically tests deep practical knowledge or problem-solving skills for this role.
    Do not include any introductory text, just the question.`;

    const result = await model.generateContent(prompt);
    const question = result.response.text();

    return { success: true, question: question.trim() };
  } catch (error) {
    console.error("Error generating question:", error);
    return { success: false, error: "Failed to generate question" };
  }
}
