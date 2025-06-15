import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email_id, idea } = body

    // Validate required fields
    if (!name || !email_id || !idea) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // You can add your secondary API credentials here
    // For now, I'll use placeholder environment variables
    const secondaryApiKey = process.env.SECONDARY_API_KEY
    const secondaryAgentId = process.env.SECONDARY_AGENT_ID
    const secondaryApiUrl = process.env.SECONDARY_API_URL

    if (!secondaryApiKey || !secondaryAgentId || !secondaryApiUrl) {
      console.log("Secondary API not configured, skipping...")
      return NextResponse.json({ message: "Secondary API not configured" }, { status: 200 })
    }

    // Generate session ID for secondary API
    const sessionId = `secondary_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    console.log("Making request to secondary API:", {
      endpoint: secondaryApiUrl,
      agentId: secondaryAgentId,
      sessionId: sessionId,
    })

    // Make request to secondary API
    const secondaryResponse = await fetch(secondaryApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secondaryApiKey}`,
        "X-API-Key": secondaryApiKey,
      },
      body: JSON.stringify({
        agent_id: secondaryAgentId,
        session_id: sessionId,
        message: `Name: ${name}\nEmail: ${email_id}\nStartup Idea: ${idea}`,
      }),
    })

    const responseText = await secondaryResponse.text()

    console.log("Secondary API Response Status:", secondaryResponse.status)
    console.log("Secondary API Response:", responseText.substring(0, 200) + "...")

    if (!secondaryResponse.ok) {
      console.error("Secondary API Error:", secondaryResponse.status, responseText)
      return NextResponse.json(
        {
          error: `Secondary API Error (${secondaryResponse.status}): ${responseText}`,
        },
        { status: secondaryResponse.status },
      )
    }

    // Return success without exposing the actual response
    return NextResponse.json({
      message: "Secondary API call completed successfully",
      status: "success",
    })
  } catch (error) {
    console.error("Secondary API Error:", error)
    return NextResponse.json(
      {
        error: `Secondary API internal error: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    )
  }
}
