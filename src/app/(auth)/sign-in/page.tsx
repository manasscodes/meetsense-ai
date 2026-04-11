"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/dashboard",
      });

      if (error) {
        setError(error.message ?? "An unexpected error occurred.");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo / Brand */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#B8FF3B] mb-4 shadow-gloweffect">
          <span className="text-2xl font-black text-[#111111]">M</span>
        </div>
        <h1 className="text-3xl font-bold text-[#111111] tracking-tight">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-[#6B6B6B]">
          Sign in to your MeetSense account
        </p>
      </div>

      {/* Card */}
      <div
        className="bg-white rounded-3xl p-8 border border-solid border-[#E0E0E0] shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error Banner */}
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#111111]"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl bg-white border border-[#E0E0E0] px-4 py-3 text-sm text-[#111111] placeholder-[#9B9B9B] outline-none transition-all duration-200 focus:border-[#B8FF3B] focus:ring-2 focus:ring-[#B8FF3B]/30"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#111111]"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-[#6B6B6B] hover:text-[#111111] transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl bg-white border border-[#E0E0E0] px-4 py-3 text-sm text-[#111111] placeholder-[#9B9B9B] outline-none transition-all duration-200 focus:border-[#B8FF3B] focus:ring-2 focus:ring-[#B8FF3B]/30"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl py-3 px-6 text-sm font-semibold text-[#111111] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            style={{
              backgroundColor: isLoading ? "#c8ff6b" : "#B8FF3B",
            }}
            onMouseEnter={(e) => {
              if (!isLoading)
                e.currentTarget.style.backgroundColor = "#A3F52B";
            }}
            onMouseLeave={(e) => {
              if (!isLoading)
                e.currentTarget.style.backgroundColor = "#B8FF3B";
            }}
          >
            {isLoading ? (
              <>
                {/* Spinner */}
                <svg
                  className="animate-spin h-4 w-4 text-[#111111]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>

      {/* Footer Link */}
      <p className="mt-6 text-center text-sm text-[#6B6B6B]">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="font-semibold text-[#111111] underline underline-offset-2 hover:text-[#B8FF3B] transition-colors"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
