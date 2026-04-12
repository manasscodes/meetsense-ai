import { getUserProfile } from "@/actions/profile";
import { InterviewClient } from "./InterviewClient";
import { InterviewOnboardingWrapper } from "./InterviewOnboardingWrapper";

export default async function InterviewPage() {
  const profile = await getUserProfile();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-8 md:p-12">
      <div className="w-full max-w-5xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-[#111111] tracking-tight mb-3 italic">
            {profile ? 'Meetsense Interviews' : 'Unlock Interview Tools'}
          </h1>
          <p className="text-[#6B6B6B] text-lg font-medium">
            {profile 
              ? `Manage your mock sessions as an ${profile.role}.` 
              : 'Complete your profile to access specialized interview and AI feedback features.'}
          </p>
        </div>

        {profile ? (
          <InterviewClient role={profile.role as any} />
        ) : (
          <InterviewOnboardingWrapper />
        )}
      </div>
    </div>
  );
}
