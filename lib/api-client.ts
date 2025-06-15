// API client utilities for better error handling and retry logic

export interface ApiError extends Error {
  status?: number
  code?: string
}

export class ValidationApiError extends Error implements ApiError {
  status?: number
  code?: string

  constructor(message: string, status?: number, code?: string) {
    super(message)
    this.name = "ValidationApiError"
    this.status = status
    this.code = code
  }
}

export const API_ERROR_MESSAGES = {
  NETWORK_ERROR: "Unable to connect to our servers. Please check your internet connection and try again.",
  RATE_LIMIT: "Too many requests. Please wait a moment before trying again.",
  VALIDATION_FAILED: "We couldn't validate your startup idea right now. Please try again later.",
  INVALID_INPUT: "Please check your input and try again.",
  SERVER_ERROR: "Our validation service is temporarily unavailable. Please try again in a few minutes.",
  AUTHENTICATION_ERROR: "There's an issue with our validation service. Please contact support if this persists.",
} as const

export function getErrorMessage(error: unknown): string {
  if (error instanceof ValidationApiError) {
    switch (error.status) {
      case 400:
        return API_ERROR_MESSAGES.INVALID_INPUT
      case 401:
        return API_ERROR_MESSAGES.AUTHENTICATION_ERROR
      case 429:
        return API_ERROR_MESSAGES.RATE_LIMIT
      case 503:
        return API_ERROR_MESSAGES.SERVER_ERROR
      default:
        return error.message || API_ERROR_MESSAGES.VALIDATION_FAILED
    }
  }

  if (error instanceof Error) {
    if (error.message.includes("fetch") || error.message.includes("network")) {
      return API_ERROR_MESSAGES.NETWORK_ERROR
    }
    return error.message
  }

  return API_ERROR_MESSAGES.VALIDATION_FAILED
}

// Retry logic for API calls
export async function withRetry<T>(fn: () => Promise<T>, maxRetries = 2, delay = 1000): Promise<T> {
  let lastError: unknown

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      // Don't retry on client errors (4xx) except for 429 (rate limit)
      if (error instanceof ValidationApiError && error.status) {
        if (error.status >= 400 && error.status < 500 && error.status !== 429) {
          throw error
        }
      }

      // Don't retry on the last attempt
      if (i === maxRetries) {
        break
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)))
    }
  }

  throw lastError
}
