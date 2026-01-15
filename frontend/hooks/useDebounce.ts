import { useCallback, useRef } from 'react'
import { debounce } from '../utils/helpers'

interface UseDebounceOptions {
  delay: number
}

export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  options: UseDebounceOptions
) => {
  const debouncedRef = useRef(debounce(callback, options.delay))

  const cancel = useCallback(() => {
    // Can implement cancel logic if needed
  }, [])

  return {
    execute: debouncedRef.current as T,
    cancel,
  }
}
