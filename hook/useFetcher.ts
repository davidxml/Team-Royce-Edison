import { useCallback, useEffect, useState } from "react";

export function useFetcher<T>(
  fetchFn: () => Promise<T>,
  options?: {
    enabled?: boolean,
    initialData?: T | null
  }
) {
  const { enabled = true, initialData = null } = options || {}
  const [data, setData] = useState<T | null>(initialData)
  const [error, setError] = useState<Error | null>(null)
  const [isPending, setIspending] = useState(false)

  const run = useCallback(async () => {
    setIspending(true)
    setError(null)

    try {
      const res = await fetchFn();
      setData(res)
      return res
    } catch (err) {
      const error = err instanceof Error ? err : new Error('unknown error');
      setError(error)
      throw error
    } finally {
      setIspending(false)
    }
  }, [fetchFn])

  useEffect(() => {
    if (enabled) {
      run();
    }
  }, [enabled, run])

  return {
    data, error, isPending, refetch: run
  }
}
