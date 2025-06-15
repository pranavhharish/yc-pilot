"use client"

import { useState } from "react"
import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import ValidationForm from "@/components/validation-form"
import StructuredResultsDisplay from "@/components/structured-results-display"
import Footer from "@/components/footer"
import { withRetry, ValidationApiError, getErrorMessage } from "@/lib/api-client"
import ApiStatus from "@/components/api-status"

export interface FormData {
  name: string
  email: string
  idea: string
}

export interface SimpleValidationResult {
  response: string
}

export default function Home() {
  const [results, setResults] = useState<SimpleValidationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFormSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError(null)
    setResults(null)

    try {
      const result = await withRetry(async () => {
        const response = await fetch("/api/validate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email_id: formData.email,
            idea: formData.idea,
          }),
        })

        // Check if response is JSON
        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          const textResponse = await response.text()
          console.error("Non-JSON Response:", textResponse)
          throw new Error("Server returned HTML instead of JSON. Check server logs.")
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new ValidationApiError(errorData.error || "Failed to validate startup idea", response.status)
        }

        return await response.json()
      })

      setResults(result)
    } catch (err) {
      const errorMessage = getErrorMessage(err)
      setError(errorMessage)

      if (process.env.NODE_ENV === "development") {
        console.error("Validation error:", err)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setResults(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <HeroSection />
        <div className="max-w-4xl mx-auto mt-12">
          <ApiStatus />
          {!results && <ValidationForm onSubmit={handleFormSubmit} isLoading={isLoading} error={error} />}
          {results && <StructuredResultsDisplay results={results} onReset={handleReset} />}
        </div>
      </main>
      <Footer />
    </div>
  )
}
