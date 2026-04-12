import { getMeetingHistory } from "@/actions/meeting";
import { MeetingsList } from "./MeetingsList";

export default async function MeetingsHistoryPage() {
  const meetings = await getMeetingHistory();

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] p-8 md:p-12">
      <div className="w-full max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-[#111111] tracking-tight mb-3 italic">
            Meeting History
          </h1>
          <p className="text-[#6B6B6B] text-lg font-medium">
            Review your past sessions, insights, and AI summaries.
          </p>
        </div>

        <MeetingsList meetings={meetings as any} />
      </div>
    </div>
  );
}
