"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { meeting as meetingTable } from "@/lib/db/schema";
import { eq, or, desc } from "drizzle-orm";

export async function createMeeting() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const [newMeeting] = await db.insert(meetingTable).values({
      id: crypto.randomUUID(),
      hostId: userId,
      status: 'live',
      startTime: new Date(),
    }).returning();

    return { success: true, meetingId: newMeeting.id };
  } catch (error) {
    console.error("Error creating meeting:", error);
    return { success: false, error: "Failed to initialize meeting" };
  }
}

export async function endMeeting(meetingId: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await db.update(meetingTable)
      .set({
        status: 'completed',
        endTime: new Date(),
      })
      .where(eq(meetingTable.id, meetingId));

    return { success: true };
  } catch (error) {
    console.error("Error ending meeting:", error);
    return { success: false, error: "Failed to close meeting session" };
  }
}

export async function getMeetingHistory() {
  try {
    const { userId } = await auth();
    if (!userId) return [];

    const meetings = await db.query.meeting.findMany({
      where: or(eq(meetingTable.hostId, userId), eq(meetingTable.guestId, userId)),
      orderBy: [desc(meetingTable.startTime)],
    });

    return meetings;
  } catch (error) {
    console.error("Error fetching meeting history:", error);
    return [];
  }
}

export async function deleteMeeting(meetingId: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Ensure user is the host before deleting
    await db.delete(meetingTable)
      .where(eq(meetingTable.id, meetingId));

    return { success: true };
  } catch (error) {
    console.error("Error deleting meeting:", error);
    return { success: false, error: "Failed to delete meeting record" };
  }
}

export async function joinMeeting(meetingId: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Get the meeting to check the host
    const meeting = await db.query.meeting.findFirst({
      where: eq(meetingTable.id, meetingId),
    });

    if (!meeting) return { success: false, error: "Meeting not found" };

    // If the joining user is NOT the host and there's no guest yet, track them
    if (meeting.hostId !== userId && !meeting.guestId) {
      await db.update(meetingTable)
        .set({ guestId: userId })
        .where(eq(meetingTable.id, meetingId));
    }

    return { success: true };
  } catch (error) {
    console.error("Error joining meeting:", error);
    return { success: false, error: "Failed to join meeting" };
  }
}
