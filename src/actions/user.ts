"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { user as userTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function syncUser() {
  try {
    const user = await currentUser();

    if (!user) {
      return null;
    }

    const email = user.emailAddresses[0]?.emailAddress;
    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "User";
    const imageUrl = user.imageUrl;

    // 1. Check for 'Ghost' users by email first
    // This handles users migrating from a previous auth system with a different ID
    const userByEmail = await db.query.user.findFirst({
      where: eq(userTable.email, email),
    });

    if (userByEmail) {
      // If we found a user with this email but a different ID, we 'migrate' them to Clerk
      // We update their primary key ID. This works because we added onUpdate: 'cascade' to related tables.
      if (userByEmail.id !== user.id) {
        const [updatedUser] = await db.update(userTable)
          .set({
            id: user.id, 
            name,
            image: imageUrl,
            updatedAt: new Date(),
          })
          .where(eq(userTable.email, email))
          .returning();
        return updatedUser;
      }
    }

    // 2. Standard Atomic Upsert
    // Handles ID-based conflicts and ensures name/image/email stay in sync for existing Clerk users.
    const [syncedUser] = await db
      .insert(userTable)
      .values({
        id: user.id,
        name,
        email,
        image: imageUrl,
      })
      .onConflictDoUpdate({
        target: userTable.id,
        set: {
          name,
          email,
          image: imageUrl,
          updatedAt: new Date(),
        },
      })
      .returning();

    return syncedUser;

  } catch (error) {
    console.error("Error syncing user to DB:", error);
    return null;
  }
}
