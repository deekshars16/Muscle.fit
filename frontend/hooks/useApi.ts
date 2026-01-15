import { useState, useCallback, useRef, useEffect } from 'react'
import { getErrorMessage, logError } from '../utils/errorHandler'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export const useApi = <T,>(
  apiCall: () => Promise<T>,
  immediate: boolean = true
) => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const isMountedRef = useRef(true)

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null })
    try {
      const result = await apiCall()
      if (isMountedRef.current) {
        setState({ data: result, loading: false, error: null })
      }
      return result
    } catch (error) {
      logError('useApi', error)
      const errorMessage = getErrorMessage(error)
      if (isMountedRef.current) {
        setState({ data: null, loading: false, error: errorMessage })
      }
      throw error
    }
  }, [apiCall])

  useEffect(() => {
    if (immediate) {
      execute()
    }

    return () => {
      isMountedRef.current = false
    }
  }, [execute, immediate])

  const retry = useCallback(() => {
    execute()
  }, [execute])

  return {
    ...state,
    execute,
    retry,
  }
}
