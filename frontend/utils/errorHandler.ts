export interface ApiError {
  message: string
  code: string
  status: number
}

// Parse API error response
export const parseApiError = (error: any): ApiError => {
  if (error.response?.data?.message) {
    return {
      message: error.response.data.message,
      code: error.response.data.code || 'UNKNOWN_ERROR',
      status: error.response.status || 500,
    }
  }

  if (error.message) {
    return {
      message: error.message,
      code: 'REQUEST_ERROR',
      status: error.status || 500,
    }
  }

  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
    status: 500,
  }
}

// Get user-friendly error message
export const getErrorMessage = (error: any): string => {
  const parsedError = parseApiError(error)

  const errorMessages: Record<number, string> = {
    400: 'Invalid request. Please check your input.',
    401: 'Unauthorized. Please log in again.',
    403: 'You do not have permission to perform this action.',
    404: 'Resource not found.',
    409: 'This resource already exists.',
    422: 'Invalid data provided.',
    500: 'Server error. Please try again later.',
    503: 'Service unavailable. Please try again later.',
  }

  return errorMessages[parsedError.status] || parsedError.message || 'An error occurred'
}

// Log error for debugging
export const logError = (context: string, error: any): void => {
  const parsedError = parseApiError(error)
  console.error(`[${context}]`, {
    message: parsedError.message,
    code: parsedError.code,
    status: parsedError.status,
  })
}

// Retry logic for failed requests
export const retryRequest = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> => {
  let lastError: any

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (attempt < maxAttempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)))
      }
    }
  }

  throw lastError
}
