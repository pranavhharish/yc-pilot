"use client"

import type React from "react"

import { useState } from "react"
import { User, Mail, Lightbulb, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import LoadingSpinner from "@/components/loading-spinner"
import type { FormData } from "@/app/page"

interface ValidationFormProps {
  onSubmit: (data: FormData) => Promise<void>
  isLoading: boolean
  error: string | null
}

export default function ValidationForm({ onSubmit, isLoading, error }: ValidationFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    idea: "",
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.idea.trim()) {
      newErrors.idea = "Startup idea description is required"
    } else if (formData.idea.trim().length < 50) {
      newErrors.idea = "Please provide a more detailed description (at least 50 characters)"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const callSecondaryApi = async (formData: FormData) => {
    try {
      const response = await fetch("/api/secondary-validate", {
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

      // We don't need to handle the response, just log it for debugging
      if (process.env.NODE_ENV === "development") {
        const result = await response.text()
        console.log("Secondary API response:", result)
      }
    } catch (error) {
      // Silently ignore secondary API errors
      if (process.env.NODE_ENV === "development") {
        console.error("Secondary API call failed:", error)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Call both APIs simultaneously
    const promises = [
      onSubmit(formData), // Original API call
      callSecondaryApi(formData), // New secondary API call
    ]

    try {
      await Promise.all(promises)
    } catch (error) {
      // The onSubmit function will handle the main API error
      // Secondary API errors are silently ignored
      console.error("One or more API calls failed:", error)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
        <h2 className="text-2xl font-bold text-white mb-2">Validate Your Startup Idea</h2>
        <p className="text-blue-100">Get detailed feedback on your startup concept in minutes</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Your Full Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`pl-10 ${errors.name ? "border-red-300 focus:border-red-500" : ""}`}
              placeholder="Enter your full name"
              disabled={isLoading}
            />
          </div>
          {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`pl-10 ${errors.email ? "border-red-300 focus:border-red-500" : ""}`}
              placeholder="your.email@example.com"
              disabled={isLoading}
            />
          </div>
          {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="idea" className="text-sm font-medium text-gray-700">
            Describe Your Startup Idea
          </Label>
          <div className="relative">
            <Lightbulb className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Textarea
              id="idea"
              value={formData.idea}
              onChange={(e) => handleInputChange("idea", e.target.value)}
              className={`pl-10 min-h-[120px] resize-none ${errors.idea ? "border-red-300 focus:border-red-500" : ""}`}
              placeholder="Tell us about your startup concept, the problem it solves, target market, and any traction you have..."
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-between items-center">
            {errors.idea && <p className="text-red-600 text-sm">{errors.idea}</p>}
            <p className="text-gray-500 text-sm ml-auto">{formData.idea.length} characters</p>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <LoadingSpinner />
              <span>Analyzing Your Idea...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Send className="h-5 w-5" />
              <span>Validate My Startup</span>
            </div>
          )}
        </Button>

        <p className="text-center text-sm text-gray-500">Your idea will be analyzed using AI and kept confidential</p>
      </form>
    </div>
  )
}
