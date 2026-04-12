import { GenericDashboardClient } from "./GenericDashboardClient";

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-8 md:p-12">
      <div className="w-full max-w-5xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-[#111111] tracking-tight mb-3">
            Simple, Powerful Meetings
          </h1>
          <p className="text-[#6B6B6B] text-lg font-medium">
            Jump into a conversation instantly or schedule a session for later.
          </p>
        </div>

        <GenericDashboardClient />
      </div>
    </div>
  );
}