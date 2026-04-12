"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { profile as profileTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function updateProfile(data: {
  role: "interviewer" | "interviewee";
  jobTitle: string;
  experience: string;
}) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    // 1. Check if profile already exists
    const existingProfile = await db.query.profile.findFirst({
      where: eq(profileTable.userId, userId),
    });

    if (existingProfile) {
      // Update existing profile
      await db.update(profileTable)
        .set({
          role: data.role,
          jobTitle: data.jobTitle,
          experience: data.experience,
        })
        .where(eq(profileTable.userId, userId));
    } else {
      // Create new profile
      await db.insert(profileTable).values({
        id: crypto.randomUUID(),
        userId,
        role: data.role,
        jobTitle: data.jobTitle,
        experience: data.experience,
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function getUserProfile() {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    const userProfile = await db.query.profile.findFirst({
      where: eq(profileTable.userId, userId),
    });

    return userProfile || null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export async function deleteProfile() {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    await db.delete(profileTable).where(eq(profileTable.userId, userId));

    return { success: true };
  } catch (error) {
    console.error("Error deleting profile:", error);
    return { success: false, error: "Failed to reset profile" };
  }
}
