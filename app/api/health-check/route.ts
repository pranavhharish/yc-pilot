import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.LYZR_API_KEY
    const agentId = process.env.LYZR_AGENT_ID

    if (!apiKey) {
      return NextResponse.json(
        {
          status: "error",
          error: "LYZR_API_KEY environment variable is not configured",
        },
        { status: 500 },
      )
    }

    if (!agentId) {
      return NextResponse.json(
        {
          status: "error",
          error: "LYZR_AGENT_ID environment variable is not configured",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      status: "ok",
      message: "API credentials configured",
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: "Health check failed",
      },
      { status: 500 },
    )
  }
}
