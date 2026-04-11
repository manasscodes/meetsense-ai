"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "@/actions/profile";
import { User, Briefcase, GraduationCap, Languages, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [role, setRole] = useState<"interviewee" | "interviewer">("interviewee");
  const [jobTitle, setJobTitle] = useState("");
  const [experience, setExperience] = useState("Fresher");
  const [language, setLanguage] = useState("English");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await updateProfile({
        role,
        jobTitle,
        experience,
        preferredLanguage: language,
      });

      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F6F3] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-[#111111] tracking-tight mb-2">
            Complete Your Profile
          </h1>
          <p className="text-[#6B6B6B] font-medium">
            Help us personalize your interview experience
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 border border-solid border-[#E0E0E0] shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Role Selection (Radio Cards) */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-[#111111]">
                What is your primary role?
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole("interviewee")}
                  className={cn(
                    "relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 text-center",
                    role === "interviewee"
                      ? "border-[#B8FF3B] bg-[#B8FF3B]/5 ring-1 ring-[#B8FF3B]"
                      : "border-[#E0E0E0] bg-white hover:border-[#B8FF3B]/50"
                  )}
                >
                  <User className={cn("w-6 h-6", role === "interviewee" ? "text-[#111111]" : "text-[#6B6B6B]")} />
                  <span className="text-sm font-bold text-[#111111]">Interviewee</span>
                  {role === "interviewee" && (
                     <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#B8FF3B] flex items-center justify-center">
                        <Check className="w-3 h-3 text-[#111111]" />
                     </div>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setRole("interviewer")}
                  className={cn(
                    "relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 text-center",
                    role === "interviewer"
                      ? "border-[#B8FF3B] bg-[#B8FF3B]/5 ring-1 ring-[#B8FF3B]"
                      : "border-[#E0E0E0] bg-white hover:border-[#B8FF3B]/50"
                  )}
                >
                  <Briefcase className={cn("w-6 h-6", role === "interviewer" ? "text-[#111111]" : "text-[#6B6B6B]")} />
                  <span className="text-sm font-bold text-[#111111]">Interviewer</span>
                  {role === "interviewer" && (
                     <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#B8FF3B] flex items-center justify-center">
                        <Check className="w-3 h-3 text-[#111111]" />
                     </div>
                  )}
                </button>
              </div>
            </div>

            {/* Job Title */}
            <div className="space-y-2">
              <label htmlFor="jobTitle" className="block text-sm font-bold text-[#111111]">
                Job Title
              </label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B]" />
                <input
                  id="jobTitle"
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Software Engineer"
                  className="w-full rounded-2xl bg-white border border-[#E0E0E0] pl-11 pr-4 py-3.5 text-sm text-[#111111] placeholder-[#9B9B9B] outline-none transition-all duration-200 focus:border-[#B8FF3B] focus:ring-4 focus:ring-[#B8FF3B]/10"
                />
              </div>
            </div>

            {/* Experience & Language */}
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label htmlFor="experience" className="block text-sm font-bold text-[#111111]">
                    Experience
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B]" />
                    <select
                      id="experience"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full appearance-none rounded-2xl bg-white border border-[#E0E0E0] pl-11 pr-4 py-3.5 text-sm text-[#111111] outline-none transition-all duration-200 focus:border-[#B8FF3B] focus:ring-4 focus:ring-[#B8FF3B]/10"
                    >
                      <option>Fresher</option>
                      <option>1-3 Years</option>
                      <option>3-5 Years</option>
                      <option>5+ Years</option>
                    </select>
                  </div>
               </div>
               <div className="space-y-2">
                  <label htmlFor="language" className="block text-sm font-bold text-[#111111]">
                    Language
                  </label>
                  <div className="relative">
                    <Languages className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B]" />
                    <select
                      id="language"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full appearance-none rounded-2xl bg-white border border-[#E0E0E0] pl-11 pr-4 py-3.5 text-sm text-[#111111] outline-none transition-all duration-200 focus:border-[#B8FF3B] focus:ring-4 focus:ring-[#B8FF3B]/10"
                    >
                      <option>English</option>
                      <option>Hindi</option>
                    </select>
                  </div>
               </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-2xl py-4 px-6 text-base font-bold text-[#111111] bg-[#B8FF3B] hover:bg-[#A3F52B] hover:shadow-gloweffect disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 mt-4 active:scale-95"
            >
              {isPending ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-[#111111]" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                "Save & Continue"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
