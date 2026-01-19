import React, { useState, useEffect } from 'react'
import OwnerLayout from '../../components/layout/OwnerLayout'

const SettingsTest: React.FC = () => {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('http://localhost:8000/api/gym/current/')
      .then(r => r.json())
      .then(data => {
        console.log('DATA:', data)
        setData(data)
      })
      .catch(err => {
        console.error('ERROR:', err)
        setError(err.message)
      })
  }, [])

  return (
    <OwnerLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold">Settings Test</h1>
        {error && <div className="text-red-600">Error: {error}</div>}
        {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      </div>
    </OwnerLayout>
  )
}

export default SettingsTest
