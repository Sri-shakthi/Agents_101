import { useEffect, useState } from 'react'
import { http } from '../services/http.js'

export function useFetch(path, options = {}) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let isMounted = true
    async function run() {
      setLoading(true)
      try {
        const res = await http({ url: path, method: options.method || 'GET', ...options })
        if (isMounted) setData(res.data)
      } catch (err) {
        if (isMounted) setError(err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    run()
    return () => { isMounted = false }
  }, [path])

  return { data, error, loading }
}


