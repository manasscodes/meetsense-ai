import { getFeedbackHistory } from "@/actions/meeting";
import { MeetingsList } from "../meetings/MeetingsList";
import { MessageSquareText } from "lucide-react";

export default async function FeedbackPage() {
  const feedback = await getFeedbackHistory();

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#B8FF3B]/10 rounded-full text-[10px] font-black uppercase tracking-widest text-[#B8FF3B] border border-[#B8FF3B]/20">
          Interview Intelligence
        </div>
        <h1 className="text-5xl font-black text-[#111111] italic tracking-tight">
          Feedback History
        </h1>
        <p className="text-[#6B6B6B] font-medium text-lg max-w-2xl">
          Review your performance scores and technical feedback from past interview sessions.
        </p>
      </div>

      {feedback.length > 0 ? (
        <MeetingsList meetings={feedback} />
      ) : (
        <div className="bg-white p-20 rounded-[2.5rem] border border-[#EAEAEA] shadow-soft text-center space-y-4">
          <MessageSquareText className="mx-auto text-[#D1D1CB]" size={48} />
          <h3 className="text-xl font-black text-[#111111]">No interview feedback yet</h3>
          <p className="text-[#6B6B6B] font-medium max-w-sm mx-auto">
             Complete an interview session to see your AI-generated technical feedback here.
          </p>
        </div>
      )}
    </div>
  );
}
