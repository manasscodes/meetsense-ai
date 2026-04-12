import { NextRequest, NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    // 1. Get the session to ensure user is logged in
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse room name from request
    const { roomName } = await req.json();

    if (!roomName) {
      return NextResponse.json({ error: "Room name is required" }, { status: 400 });
    }

    // 3. Create the Access Token
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      throw new Error("LiveKit API Key or Secret missing");
    }

    const token = new AccessToken(apiKey, apiSecret, {
      identity: userId,
      name: `${user.firstName} ${user.lastName}`.trim() || user.username || "User",
    });

    // 4. Add grants
    token.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    // 5. Return the JWT
    const tokenValue = await token.toJwt();

    return NextResponse.json({ token: tokenValue });

  } catch (error) {
    console.error("Error generating LiveKit token:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}