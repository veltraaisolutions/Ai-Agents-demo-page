import { NextResponse } from "next/server";

const RETELL_API_KEY = process.env.RETELL_API_KEY!;
const AGENT_ID = process.env.RETELL_AGENT_ID!;

export async function POST() {
  if (!RETELL_API_KEY || !AGENT_ID) {
    return NextResponse.json(
      { error: "Server configuration error: Retell secrets missing." },
      { status: 500 },
    );
  }

  try {
    const retellResponse = await fetch(
      "https://api.retellai.com/v2/create-web-call",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RETELL_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ agent_id: AGENT_ID }),
      },
    );

    const retellData = await retellResponse.json();

    if (!retellResponse.ok) {
      return NextResponse.json(
        { error: "Failed to initiate call with Retell.", details: retellData },
        { status: 500 },
      );
    }

    return NextResponse.json({
      access_token: retellData.access_token,
      call_id: retellData.call_id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 },
    );
  }
}
