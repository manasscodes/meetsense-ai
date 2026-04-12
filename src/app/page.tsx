import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { 
  ArrowRight, 
  Mic, 
  FileText, 
  Languages, 
  Users, 
  BarChart3, 
  Search,
  CheckCircle2,
  Video,
  Play
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        {/* HERO SECTION */}
        <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto text-center relative">
            {/* Background Decorative Blurs */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] -z-10" />
            
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-100 shadow-sm mb-8">
                <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">The Future of Meeting AI</span>
              </span>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] text-foreground mb-8">
                Smarter Meetings.<br />
                <span className="text-gray-400">Better Interviews.</span><br />
                Powered by AI.
              </h1>
              
              <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-500 font-medium leading-relaxed mb-12">
                MeetSense AI transforms your meetings and interview preparation with real-time transcription, 
                AI-generated summaries, bilingual captions, and intelligent mock interview feedback—all in one platform.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/sign-up"
                  className="w-full sm:w-auto bg-accent hover:bg-[#A3E635] text-black font-black px-10 py-5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-gloweffect group"
                >
                  Get Started Free
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="w-full sm:w-auto bg-white hover:bg-gray-50 text-foreground border border-gray-200 font-bold px-10 py-5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <Play size={18} fill="currentColor" />
                  Watch Demo
                </Link>
              </div>
            </div>

            {/* Dashboard Mockup Preview */}
            <div className="mt-20 relative animate-in fade-in zoom-in-95 duration-1000 delay-300">
              <div className="bg-white rounded-[2rem] border-[12px] border-white shadow-[0_50px_100px_rgba(0,0,0,0.1)] overflow-hidden aspect-[16/10] max-w-5xl mx-auto group">
                <div className="w-full h-full bg-gray-50 flex items-center justify-center relative">
                   {/* Layout Placeholder UI */}
                   <div className="absolute inset-0 p-8 flex flex-col gap-6 opacity-40 group-hover:opacity-60 transition-opacity">
                      <div className="h-12 w-full bg-gray-200 rounded-xl" />
                      <div className="flex gap-6 flex-1">
                        <div className="flex-1 bg-gray-200 rounded-[2rem] relative overflow-hidden">
                           <div className="absolute bottom-6 left-6 right-6 h-12 bg-black/50 backdrop-blur rounded-2xl" />
                        </div>
                        <div className="w-80 bg-white rounded-[2rem] border border-gray-200" />
                      </div>
                   </div>
                   {/* Centered Overlay */}
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-accent text-black px-6 py-3 rounded-full font-black text-sm shadow-xl flex items-center gap-3">
                        <Video size={20} />
                        Live Meeting Experience
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">Designed for Modern Collaboration</h2>
              <p className="text-gray-500 font-medium text-lg">Powerful features built for students, professionals, and teams.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Mic className="text-accent" />}
                title="Real-Time Transcription"
                content="Capture every conversation instantly with live AI-powered meeting transcription."
              />
              <FeatureCard 
                icon={<FileText className="text-accent" />}
                title="AI Meeting Summaries"
                content="Automatically generate concise summaries with key discussion points and action items."
              />
              <FeatureCard 
                icon={<Languages className="text-accent" />}
                title="English ↔ Hindi Auto Captions"
                content="Support bilingual communication with intelligent live caption translation."
              />
              <FeatureCard 
                icon={<Users className="text-accent" />}
                title="Mock Interview Simulator"
                content="Practice role-based technical and behavioral interviews powered by AI."
              />
              <FeatureCard 
                icon={<BarChart3 className="text-accent" />}
                title="Instant AI Feedback Reports"
                content="Receive detailed scoring and actionable suggestions after every mock interview."
              />
              <FeatureCard 
                icon={<Search className="text-accent" />}
                title="Searchable Meeting Archives"
                content="Revisit any meeting instantly with searchable transcripts and summaries."
              />
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-24 px-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <span className="text-accent font-black text-xs uppercase tracking-[0.3em] mb-4 block">Process</span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight">How MeetSense Works</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <Step 
                num="01" 
                title="Start a Session" 
                content="Launch a meeting or mock interview in seconds." 
              />
              <Step 
                num="02" 
                title="Process in Real Time" 
                content="MeetSense transcribes, captions, and analyzes every interaction live." 
              />
              <Step 
                num="03" 
                title="Apply Insights" 
                content="Receive summaries, interview scores, and performance analytics instantly." 
              />
              <Step 
                num="04" 
                title="Improve Continuously" 
                content="Use AI-generated feedback to enhance your communication skills." 
              />
            </div>
          </div>
        </section>

        {/* USE CASES SECTION */}
        <section id="use-cases" className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-20">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">Built for Every Scenario</h2>
                <p className="text-gray-500 font-medium text-lg leading-relaxed">
                  From final year projects to professional interview prep, MeetSense adapts to your workflow.
                </p>
              </div>
              <Link href="/sign-up" className="text-foreground font-black flex items-center gap-2 group border-b-2 border-accent pb-1">
                Explore More Use Cases <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <UseCaseCard title="Academic Collaboration" content="Help student teams document project discussions and decisions automatically." />
              <UseCaseCard title="Faculty Mentoring" content="Enable smarter office hours with AI-generated notes and bilingual support." />
              <UseCaseCard title="Placement Preparation" content="Practice mock interviews with detailed AI evaluation before real placements." />
              <UseCaseCard title="Startup Team Meetings" content="Keep client and internal meetings searchable and organized effortlessly." />
              <UseCaseCard title="Training Workshops" content="Scale candidate assessments with objective AI-powered evaluation." />
              <UseCaseCard title="Interview Practice" content="Professional-grade real-time feedback on technical and behavioral skills." />
            </div>
          </div>
        </section>

        {/* WHY MEETSENSE SECTION */}
        <section className="py-24 px-6 bg-[#111111] text-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-8">
                Built for Students, Teams, 
                and Future Professionals
              </h2>
              <div className="space-y-6">
                <WhyPoint text="No setup complexity — Go live in one click" />
                <WhyPoint text="No subscription barriers — Free for education" />
                <WhyPoint text="Designed for educational and startup use" />
                <WhyPoint text="AI-powered productivity in one platform" />
                <WhyPoint text="Production-grade final year engineering project" />
              </div>
            </div>
            
            <div className="bg-accent/5 border border-white/5 p-12 rounded-[3rem] relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-40 h-40 bg-accent/20 rounded-full blur-[60px] group-hover:blur-[80px] transition-all" />
               <div className="relative z-10">
                  <span className="text-accent font-black text-xs uppercase tracking-widest block mb-6">Developer Vision</span>
                  <p className="text-2xl font-bold leading-relaxed mb-10 text-gray-300">
                    "MeetSense AI was born from the need to make professional AI tools accessible for effective team learning."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-black text-accent border border-white/10">MK</div>
                    <div>
                      <h4 className="font-bold">Manas Kolaskar</h4>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Founder & Developer</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="py-24 md:py-40 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8">
              Experience the Future of Smart Meetings
            </h2>
            <p className="text-xl text-gray-500 font-medium mb-12">
              Join MeetSense AI and transform how you collaborate, prepare, and improve.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/sign-up"
                className="w-full sm:w-auto bg-accent hover:bg-[#A3E635] text-black font-black px-12 py-5 rounded-2xl transition-all shadow-gloweffect active:scale-95"
              >
                Get Started Free
              </Link>
              <Link
                href="#how-it-works"
                className="w-full sm:w-auto bg-white border border-gray-200 text-foreground font-black px-12 py-5 rounded-2xl transition-all hover:bg-gray-50"
              >
                Explore Demo
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/* Sub-components */

function FeatureCard({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) {
  return (
    <div className="p-8 bg-white border border-gray-100 rounded-2xl shadow-soft hover:shadow-xl hover:border-accent/30 transition-all duration-300 group">
      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-black mb-3 text-foreground">{title}</h3>
      <p className="text-gray-500 font-medium leading-relaxed">{content}</p>
    </div>
  );
}

function Step({ num, title, content }: { num: string, title: string, content: string }) {
  return (
    <div className="relative">
      <div className="text-6xl font-black text-gray-100 mb-6">{num}</div>
      <h3 className="text-xl font-black mb-3">{title}</h3>
      <p className="text-gray-500 font-medium leading-relaxed">{content}</p>
    </div>
  );
}

function UseCaseCard({ title, content }: { title: string, content: string }) {
  return (
    <div className="p-8 bg-white border border-gray-100 rounded-2xl flex flex-col justify-between hover:border-foreground/10 transition-colors">
      <div>
        <h3 className="text-lg font-black mb-3">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed font-medium">{content}</p>
      </div>
    </div>
  );
}

function WhyPoint({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0 group-hover:scale-125 transition-transform">
        <CheckCircle2 size={16} className="text-accent" />
      </div>
      <span className="text-lg font-bold text-gray-300 group-hover:text-white transition-colors">{text}</span>
    </div>
  );
}
