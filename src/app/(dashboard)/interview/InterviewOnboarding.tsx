'use client';

import { useState } from "react";
import { Briefcase, GraduationCap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfile } from "@/actions/profile";

export function InterviewOnboarding({ onComplete }: { onComplete: () => void }) {
  const [role, setRole] = useState<"interviewer" | "interviewee" | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || !jobTitle || !experience) return;

    setLoading(true);
    const result = await updateProfile({ role, jobTitle, experience });
    setLoading(false);

    if (result.success) {
      onComplete();
    } else {
      alert("Failed to save profile. Please try again.");
    }
  };

  return (
    <div className="max-w-xl w-full mx-auto">
      <div className="bg-white rounded-[2.5rem] shadow-soft border border-[#EAEAEA] p-10 md:p-14">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-gloweffect text-black">
             <GraduationCap size={32} />
          </div>
          <h1 className="text-3xl font-black text-[#111111] mb-3 tracking-tight">
            Configure Interview Profile
          </h1>
          <p className="text-[#6B6B6B] font-medium leading-relaxed">
            Choose how you want to participate in Mock Interviews. You only need to do this once.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <RoleCard 
              active={role === "interviewer"}
              onClick={() => setRole("interviewer")}
              icon={<Briefcase size={28} />}
              title="Interviewer"
              description="I want to conduct rooms."
            />
            <RoleCard 
              active={role === "interviewee"}
              onClick={() => setRole("interviewee")}
              icon={<UserIcon size={28} />}
              title="Interviewee"
              description="I want to practice."
            />
          </div>

          {role && (
            <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[#6B6B6B] ml-1">Job Title</label>
                <Input 
                   value={jobTitle}
                   onChange={(e) => setJobTitle(e.target.value)}
                   placeholder="e.g. Software Engineer"
                   className="h-14 rounded-2xl bg-[#F0F0ED] border-none text-base font-medium"
                   required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[#6B6B6B] ml-1">Experience</label>
                <select 
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full h-14 rounded-2xl bg-[#F0F0ED] border-none px-4 text-base font-medium appearance-none"
                  required
                >
                  <option value="" disabled>Select experience</option>
                  <option value="Fresher">Fresher</option>
                  <option value="1-3 Years">1-3 Years</option>
                  <option value="3-5 Years">3-5 Years</option>
                  <option value="5+ Years">5+ Years</option>
                </select>
              </div>

              <Button 
                type="submit"
                disabled={loading}
                className="w-full h-16 bg-black text-white hover:bg-gray-800 rounded-2xl text-lg font-black flex items-center justify-center gap-2 group"
              >
                {loading ? "Saving..." : "Start Interviewing"}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

function RoleCard({ active, onClick, icon, title, description }: any) {
  return (
    <div 
      onClick={onClick}
      className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${
        active 
          ? "border-[#B8FF3B] bg-[#B8FF3B]/5" 
          : "border-[#EAEAEA] bg-white hover:border-[#B8FF3B]/30"
      }`}
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
        active ? "bg-[#B8FF3B] text-black" : "bg-[#F0F0ED] text-[#6B6B6B]"
      }`}>
        {icon}
      </div>
      <h3 className="text-lg font-black text-[#111111] mb-1">{title}</h3>
      <p className="text-sm font-medium text-[#6B6B6B]">{description}</p>
    </div>
  );
}

function UserIcon({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
