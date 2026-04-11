"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { profile } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: {
  role: "interviewee" | "interviewer";
  jobTitle: string;
  experience: string;
  preferredLanguage: string;
  domain?: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  try {
    // Generate a simple ID for the profile row
    const profileId = crypto.randomUUID();

    // Upsert logic: insert if not exists, update if it does
    // We target userId since we added a unique constraint to it
    await db.insert(profile)
      .values({
        id: profileId,
        userId: userId,
        role: formData.role,
        jobTitle: formData.jobTitle,
        experience: formData.experience,
        preferredLanguage: formData.preferredLanguage,
        domain: formData.domain || "",
      })
      .onConflictDoUpdate({
        target: profile.userId,
        set: {
          role: formData.role,
          jobTitle: formData.jobTitle,
          experience: formData.experience,
          preferredLanguage: formData.preferredLanguage,
          domain: formData.domain || "",
        },
      });

    revalidatePath("/dashboard");
    revalidatePath("/onboarding");
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: "Failed to update profile. Please try again." };
  }

  redirect("/dashboard");
}
