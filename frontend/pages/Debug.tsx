import React, { useState, useEffect } from 'react'

const DebugPage: React.FC = () => {
  const [token, setToken] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setToken(localStorage.getItem('authToken') || 'NO TOKEN')
  }, [])

  const testApi = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('authToken')
      console.log('Token:', token)
      console.log('Header:', `Bearer ${token}`)
      
      const resp = await fetch('http://127.0.0.1:8000/api/users/dashboard/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      const data = await resp.json()
      console.log('Response:', data)
      setResponse(JSON.stringify(data, null, 2))
    } catch (err) {
      setResponse(JSON.stringify(err, null, 2))
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Debug Page</h1>
      <p>Token in localStorage: {token.substring(0, 50)}...</p>
      <button onClick={testApi} disabled={loading}>
        {loading ? 'Testing...' : 'Test API'}
      </button>
      <pre>{response}</pre>
    </div>
  )
}

export default DebugPage
