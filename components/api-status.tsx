"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, AlertCircle, Loader2, TestTube } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ApiStatus {
  status: "checking" | "connected" | "error" | "not-configured"
  message: string
  lastChecked?: Date
}

export default function ApiStatus() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    status: "checking",
    message: "Checking API connection...",
  })
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    checkApiStatus()
  }, [])

  const checkApiStatus = async () => {
    try {
      const response = await fetch("/api/health-check")

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        setApiStatus({
          status: "error",
          message: "API returned non-JSON response",
          lastChecked: new Date(),
        })
        return
      }

      const data = await response.json()

      if (response.ok && data.status === "ok") {
        setApiStatus({
          status: "connected",
          message: "API credentials configured and ready",
          lastChecked: new Date(),
        })
      } else {
        setApiStatus({
          status: "error",
          message: data.error || "API connection failed",
          lastChecked: new Date(),
        })
      }
    } catch (error) {
      setApiStatus({
        status: "not-configured",
        message: "API not configured. Please check environment variables.",
        lastChecked: new Date(),
      })
    }
  }

  const testApi = async () => {
    setTesting(true)
    try {
      const response = await fetch("/api/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Test User",
          email_id: "test@example.com",
          idea: "A simple test idea for API debugging",
        }),
      })

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text()
        console.log("Non-JSON Response:", textResponse)
        alert(`API test failed: Received HTML/text response instead of JSON. Check console for details.`)
        return
      }

      const data = await response.json()
      console.log("API Test Results:", data)

      if (response.ok) {
        alert("API test successful! Check console for details.")
      } else {
        alert(`API test failed: ${data.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Test failed:", error)
      alert(`API test failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setTesting(false)
    }
  }

  const getStatusIcon = () => {
    switch (apiStatus.status) {
      case "checking":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "not-configured":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusColor = () => {
    switch (apiStatus.status) {
      case "checking":
        return "bg-blue-100 text-blue-800"
      case "connected":
        return "bg-green-100 text-green-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "not-configured":
        return "bg-yellow-100 text-yellow-800"
    }
  }

  // Only show in development mode
  if (process.env.NODE_ENV === "production") {
    return null
  }

  return (
    <Card className="mb-6 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span>API Status</span>
            <Badge className={getStatusColor()}>{apiStatus.status.replace("-", " ").toUpperCase()}</Badge>
          </div>
          {apiStatus.status === "connected" && (
            <Button
              onClick={testApi}
              disabled={testing}
              size="sm"
              variant="outline"
              className="flex items-center space-x-1"
            >
              {testing ? <Loader2 className="h-3 w-3 animate-spin" /> : <TestTube className="h-3 w-3" />}
              <span>{testing ? "Testing..." : "Test API"}</span>
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-gray-600">{apiStatus.message}</p>
        {apiStatus.lastChecked && (
          <p className="text-xs text-gray-400 mt-1">Last checked: {apiStatus.lastChecked.toLocaleTimeString()}</p>
        )}
        {apiStatus.status === "not-configured" && (
          <div className="mt-3 p-3 bg-yellow-50 rounded-md">
            <p className="text-sm text-yellow-800 font-medium">Setup Required:</p>
            <ol className="text-sm text-yellow-700 mt-1 list-decimal list-inside space-y-1">
              <li>Add your Lyzr Studio API key to environment variables</li>
              <li>Add your Lyzr Studio Agent ID to environment variables</li>
              <li>Set LYZR_API_KEY and LYZR_AGENT_ID in your .env.local file</li>
              <li>Restart your development server</li>
            </ol>
          </div>
        )}
        {apiStatus.status === "error" && (
          <div className="mt-3 p-3 bg-red-50 rounded-md">
            <p className="text-sm text-red-800 font-medium">Troubleshooting:</p>
            <ul className="text-sm text-red-700 mt-1 list-disc list-inside space-y-1">
              <li>Check that environment variables are set correctly</li>
              <li>Verify API key and Agent ID are valid</li>
              <li>Check server logs for detailed error messages</li>
              <li>Ensure the API endpoint URL is correct</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
