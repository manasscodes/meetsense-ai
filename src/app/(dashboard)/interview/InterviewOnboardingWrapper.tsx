'use client';

import { useRouter } from "next/navigation";
import { InterviewOnboarding } from "./InterviewOnboarding";

export function InterviewOnboardingWrapper() {
  const router = useRouter();

  return (
    <InterviewOnboarding onComplete={() => router.refresh()} />
  );
}
