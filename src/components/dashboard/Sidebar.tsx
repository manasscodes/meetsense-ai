'use client';

import Link from "next/link";
import { 
  LayoutDashboard, 
  Video, 
  User as UserIcon, 
  LogOut,
  Calendar,
  Settings,
  Award,
  MessageSquareText
} from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";

interface SidebarProps {
  user: {
    firstName?: string | null;
    lastName?: string | null;
    imageUrl?: string;
  } | null;
}

export function Sidebar({ user }: SidebarProps) {
  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Interview", icon: Award, href: "/interview" },
    { label: "Feedback", icon: MessageSquareText, href: "/feedback" },
    { label: "Meetings", icon: Video, href: "/meetings" },
    { label: "Calendar", icon: Calendar, href: "/calendar" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ];

  return (
    <aside className="w-[260px] bg-white shadow-soft flex flex-col fixed h-screen z-10">
      {/* Logo */}
      <div className="p-8 pb-4">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#B8FF3B] flex items-center justify-center shadow-gloweffect group-hover:scale-105 transition-transform">
            <span className="font-black text-lg text-[#111111]">M</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-[#111111]">MeetSense AI</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[#6B6B6B] hover:text-[#111111] hover:bg-[#F6F6F3] transition-all duration-200 group"
          >
            <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-6 border-t border-[#F0F0ED]">
        <div className="flex items-center gap-3 px-2 py-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#F0F0ED] border border-[#EAEAEA] flex items-center justify-center overflow-hidden">
             {user?.imageUrl ? (
               <img src={user.imageUrl} alt={user.firstName || "User"} className="w-full h-full object-cover" />
             ) : (
               <UserIcon className="w-5 h-5 text-[#6B6B6B]" />
             )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-[#111111] truncate">{user?.firstName} {user?.lastName}</span>
            <span className="text-xs text-[#6B6B6B] truncate font-medium">Free Plan</span>
          </div>
        </div>
        
        <SignOutButton redirectUrl="/">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#111111] hover:bg-[#F0F0ED] transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}
