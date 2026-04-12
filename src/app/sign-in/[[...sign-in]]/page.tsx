import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F6F3]">
      <SignIn 
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        forceRedirectUrl="/dashboard"
        appearance={{
          baseTheme: undefined,
          elements: {
            card: "bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-[#EAEAEA] rounded-[1.5rem] p-8",
            headerTitle: "text-black text-2xl font-bold",
            headerSubtitle: "text-[#6B6B6B]",
            formButtonPrimary: "bg-[#111111] hover:bg-black text-white rounded-full text-sm font-medium py-3",
            formFieldInput: "bg-[#F0F0ED] border border-[#EAEAEA] rounded-lg focus:ring-[#B8FF3B]",
            footerActionText: "text-[#6B6B6B]",
            footerActionLink: "text-[#111111] hover:text-[#B8FF3B] font-medium",
            socialButtonsBlockButton: "bg-white border border-[#EAEAEA] text-black hover:bg-[#F0F0ED] rounded-full",
            dividerLine: "bg-[#EAEAEA]",
            dividerText: "text-[#6B6B6B]",
          }
        }} 
      />
    </div>
  );
}
