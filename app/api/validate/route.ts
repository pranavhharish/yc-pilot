import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email_id, idea } = body

    // Validate required fields
    if (!name || !email_id || !idea) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check for required environment variables
    const apiKey = process.env.LYZR_API_KEY
    const agentId = process.env.LYZR_AGENT_ID

    if (!apiKey) {
      return NextResponse.json({ error: "LYZR_API_KEY not configured" }, { status: 500 })
    }

    if (!agentId) {
      return NextResponse.json({ error: "LYZR_AGENT_ID not configured" }, { status: 500 })
    }

    // Lyzr Studio API endpoint
    const lyzrEndpoint = process.env.LYZR_API_ENDPOINT || "https://api.lyzr.ai/v1/chat/completions"

    // Generate session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    console.log("Making request to Lyzr API:", {
      endpoint: lyzrEndpoint,
      agentId: agentId,
      sessionId: sessionId,
    })

    // Make request to Lyzr Studio API
    const lyzrResponse = await fetch(lyzrEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({
        agent_id: agentId,
        session_id: sessionId,
        message: `Name: ${name}\nEmail: ${email_id}\nStartup Idea: ${idea}`,
      }),
    })

    const responseText = await lyzrResponse.text()

    console.log("Lyzr API Response Status:", lyzrResponse.status)
    console.log("Lyzr API Response Text:", responseText.substring(0, 500) + "...")

    if (!lyzrResponse.ok) {
      console.error("Lyzr API Error:", lyzrResponse.status, responseText)
      return NextResponse.json(
        {
          error: `Lyzr API Error (${lyzrResponse.status}): ${responseText}`,
        },
        { status: lyzrResponse.status },
      )
    }

    // Try to parse as JSON, fallback to plain text
    let responseData
    try {
      responseData = JSON.parse(responseText)
    } catch (parseError) {
      console.log("Response is not JSON, treating as plain text")
      responseData = responseText
    }

    // Extract the actual response content
    let actualResponse = ""
    if (typeof responseData === "string") {
      actualResponse = responseData
    } else if (responseData.response) {
      actualResponse = responseData.response
    } else if (responseData.message) {
      actualResponse = responseData.message
    } else if (responseData.choices && responseData.choices[0]?.message?.content) {
      actualResponse = responseData.choices[0].message.content
    } else if (responseData.content) {
      actualResponse = responseData.content
    } else {
      actualResponse = responseText
    }

    return NextResponse.json({
      response: actualResponse,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      {
        error: `Internal server error: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    )
  }
}
