'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, GraduationCap, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfile } from "@/actions/profile";

export default function OnboardingPage() {
  const router = useRouter();
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
      router.push("/dashboard");
    } else {
      alert("Failed to save profile. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F6F3] flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-[#EAEAEA] p-10 md:p-14">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-[#B8FF3B] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-gloweffect">
            <span className="font-black text-2xl text-black">M</span>
          </div>
          <h1 className="text-3xl font-black text-[#111111] mb-3 tracking-tight">
            How do you want to use MeetSense?
          </h1>
          <p className="text-[#6B6B6B] font-medium">
            Customize your experience to get the most out of our AI.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Role Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <RoleCard 
              active={role === "interviewer"}
              onClick={() => setRole("interviewer")}
              icon={<Briefcase size={28} />}
              title="Interviewer"
              description="I want to conduct interviews."
            />
            <RoleCard 
              active={role === "interviewee"}
              onClick={() => setRole("interviewee")}
              icon={<GraduationCap size={28} />}
              title="Interviewee"
              description="I want to practice interviews."
            />
          </div>

          {/* Profile Details (Animated entry) */}
          {role && (
            <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[#6B6B6B] ml-1">Job Title</label>
                <Input 
                   value={jobTitle}
                   onChange={(e) => setJobTitle(e.target.value)}
                   placeholder={role === 'interviewer' ? "e.g. Senior Software Engineer" : "e.g. Frontend Intern"}
                   className="h-14 rounded-2xl bg-[#F0F0ED] border-none focus-visible:ring-2 focus-visible:ring-[#B8FF3B] text-base font-medium"
                   required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[#6B6B6B] ml-1">Experience Level</label>
                <select 
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full h-14 rounded-2xl bg-[#F0F0ED] border-none focus:ring-2 focus:ring-[#B8FF3B] px-4 text-base font-medium appearance-none cursor-pointer"
                  required
                >
                  <option value="" disabled>Select your experience</option>
                  <option value="Fresher">Fresher / Student</option>
                  <option value="1-3 Years">1-3 Years</option>
                  <option value="3-5 Years">3-5 Years</option>
                  <option value="5+ Years">5+ Years</option>
                </select>
              </div>

              <Button 
                type="submit"
                disabled={loading}
                className="w-full h-16 bg-black text-white hover:bg-gray-800 rounded-2xl text-lg font-black transition-all flex items-center justify-center gap-2 group"
              >
                {loading ? "Saving Profile..." : "Get Started"}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

function RoleCard({ active, onClick, icon, title, description }: { 
  active: boolean, 
  onClick: () => void, 
  icon: React.ReactNode, 
  title: string, 
  description: string 
}) {
  return (
    <div 
      onClick={onClick}
      className={`relative p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 group ${
        active 
          ? "border-[#B8FF3B] bg-[#B8FF3B]/5 shadow-lg" 
          : "border-[#EAEAEA] bg-white hover:border-[#B8FF3B]/50 hover:bg-[#F0F0ED]/50"
      }`}
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
        active ? "bg-[#B8FF3B] text-black" : "bg-[#F0F0ED] text-[#6B6B6B] group-hover:bg-[#B8FF3B]/20 group-hover:text-black"
      }`}>
        {icon}
      </div>
      <h3 className="text-lg font-black text-[#111111] mb-1">{title}</h3>
      <p className="text-sm font-medium text-[#6B6B6B] leading-tight">{description}</p>
      
      {active && (
        <div className="absolute top-4 right-4 w-6 h-6 bg-[#B8FF3B] rounded-full flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-black rounded-full" />
        </div>
      )}
    </div>
  );
}
