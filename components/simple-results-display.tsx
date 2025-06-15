"use client"

import { useState } from "react"
import { Copy, RotateCcw, FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SimpleValidationResult } from "@/app/page"

interface SimpleResultsDisplayProps {
  results: SimpleValidationResult
  onReset: () => void
}

export default function SimpleResultsDisplay({ results, onReset }: SimpleResultsDisplayProps) {
  const [copied, setCopied] = useState(false)

  const copyResults = async () => {
    try {
      await navigator.clipboard.writeText(results.response)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy results:", err)
    }
  }

  const downloadResults = () => {
    const blob = new Blob([results.response], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `yc-pilot-analysis-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Format JSON for better readability if the response is JSON
  const formatResponse = (response: string) => {
    try {
      const parsed = JSON.parse(response)
      return JSON.stringify(parsed, null, 2)
    } catch {
      return response
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <FileText className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">YC-Pilot Analysis Complete!</h2>
            <p className="text-blue-100">Your startup validation results are ready</p>
          </div>
        </CardContent>
      </Card>

      {/* Results Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>Validation Results</span>
            </div>
            <div className="flex space-x-2">
              <Button onClick={copyResults} variant="outline" size="sm" className="flex items-center space-x-1">
                <Copy className="h-4 w-4" />
                <span>{copied ? "Copied!" : "Copy"}</span>
              </Button>
              <Button onClick={downloadResults} variant="outline" size="sm" className="flex items-center space-x-1">
                <Download className="h-4 w-4" />
                <span>Download</span>
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
              {formatResponse(results.response)}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center">
        <Button
          onClick={onReset}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Validate Another Idea</span>
        </Button>
      </div>
    </div>
  )
}
