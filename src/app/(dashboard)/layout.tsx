import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { syncUser } from "@/actions/user";
import { getUserProfile } from "@/actions/profile";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/sign-in");
  }

  // Sync user to DB
  await syncUser();

  // Pass only serializable user data to the client component
  const userData = {
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl,
  };

  return (
    <div className="flex min-h-screen bg-[#F6F6F3]">
      <Sidebar user={userData} />

      {/* Main Content */}
      <main className="flex-1 ml-[260px]">
        {children}
      </main>
    </div>
  );
}
