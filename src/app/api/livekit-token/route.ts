import { NextRequest, NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import { jwtDecode } from "jwt-decode";
import { auth } from "@/lib/auth"; // Import your auth instance

export async function POST(req: NextRequest) {
  // Add these 3 lines temporarily
console.log("DEBUG KEY:", process.env.LIVEKIT_API_KEY);
console.log("DEBUG SECRET:", process.env.LIVEKIT_API_SECRET ? "FOUND" : "MISSING");
console.log("DEBUG URL:", process.env.NEXT_PUBLIC_LIVEKIT_URL);
  try {
    // 1. Get the session to ensure user is logged in
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse room name from request
    const { roomName } = await req.json();

    if (!roomName) {
      return NextResponse.json({ error: "Room name is required" }, { status: 400 });
    }

    // 3. Create the Access Token
    // CRITICAL FIX: Use session.user.id as 'identity' to guarantee uniqueness.
    // Use session.user.name as 'name' for display purposes.
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      throw new Error("LiveKit API Key or Secret missing");
    }

    const token = new AccessToken(apiKey, apiSecret, {
      identity: session.user.id, // Unique ID (fixes the collision bug)
      name: session.user.name || "User", // Display Name
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
    const decoded = jwtDecode(tokenValue);
    console.log("DEBUG TOKEN PAYLOAD:", JSON.stringify(decoded, null, 2));

    return NextResponse.json({ token: tokenValue });

  } catch (error) {
    console.error("Error generating LiveKit token:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}