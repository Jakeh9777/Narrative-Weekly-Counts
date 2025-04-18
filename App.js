
import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pqghusnpwyojthbrnjsh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxZ2h1c25wd3lvanRoYnJuanNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMTU2NjIsImV4cCI6MjA2MDU5MTY2Mn0.G_-UkoxNV4HfX7RHudtCQGYBtu17l5zdmZzIRL-nwh0'
const supabase = createClient(supabaseUrl, supabaseKey)

const App = () => {
  const [pin, setPin] = useState('')
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'))
    if (storedUser) setUser(storedUser)
  }, [])

  const handleLogin = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('pin_code', pin)
      .single()

    if (data) {
      setUser(data)
      localStorage.setItem('user', JSON.stringify(data))
      setError('')
    } else {
      setError('Invalid PIN')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    setPin('')
  }

  if (!user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-xl font-bold mb-4">Enter PIN</h1>
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="border px-4 py-2 rounded mb-2"
        />
        <button onClick={handleLogin} className="bg-green-600 text-white px-4 py-2 rounded">
          Login
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Welcome, {user.name}</h2>
        <button onClick={handleLogout} className="text-red-500 underline">Logout</button>
      </div>
      <p>Your role: {user.is_admin ? 'Admin' : 'User'}</p>
      <p>Wholesale Account ID: {user.wholesale_account_id}</p>
    </div>
  )
}

export default App
