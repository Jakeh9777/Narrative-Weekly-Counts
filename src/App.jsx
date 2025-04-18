
import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import './index.css'

const supabaseUrl = 'https://pqghusnpwyojthbrnjsh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxZ2h1c25wd3lvanRoYnJuanNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMTU2NjIsImV4cCI6MjA2MDU5MTY2Mn0.G_-UkoxNV4HfX7RHudtCQGYBtu17l5zdmZzIRL-nwh0'
const supabase = createClient(supabaseUrl, supabaseKey)

const App = () => {
  const [pin, setPin] = useState('')
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')
  const [products, setProducts] = useState([])
  const [counts, setCounts] = useState({})
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [submitMsg, setSubmitMsg] = useState('')

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'))
    if (storedUser) {
      setUser(storedUser)
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchProducts()
    }
  }, [user])

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('wholesale_account_id', user.wholesale_account_id)

    if (data) {
      setProducts(data)
      const initialCounts = {}
      data.forEach((product) => {
        initialCounts[product.id] = ''
      })
      setCounts(initialCounts)
    }
  }

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

  const handleInputChange = (productId, value) => {
    setCounts({ ...counts, [productId]: value })
  }

  const handleSubmit = async () => {
    setSubmitMsg('')
    const inserts = Object.entries(counts)
      .filter(([_, qty]) => qty !== '')
      .map(([productId, quantity]) => ({
        product_id: productId,
        user_id: user.id,
        wholesale_account_id: user.wholesale_account_id,
        date: selectedDate,
        quantity: parseInt(quantity)
      }))

    if (inserts.length === 0) {
      setSubmitMsg('Please enter at least one product count.')
      return
    }

    const { error } = await supabase.from('product_counts').insert(inserts)
    if (error) {
      setSubmitMsg('Error saving data.')
    } else {
      setSubmitMsg('Counts submitted successfully!')
    }
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
    <div className="p-4 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Welcome, {user.name}</h2>
        <button onClick={handleLogout} className="text-red-500 underline">Logout</button>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
      </div>

      <div>
        <h3 className="font-semibold mb-2">Enter Product Counts</h3>
        {products.map((product) => (
          <div key={product.id} className="flex justify-between items-center mb-2">
            <label className="w-2/3">{product.name}</label>
            <input
              type="number"
              inputMode="numeric"
              className="border px-2 py-1 rounded w-1/3"
              value={counts[product.id] || ''}
              onChange={(e) => handleInputChange(product.id, e.target.value)}
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded"
      >
        Submit Counts
      </button>
      {submitMsg && <p className="mt-2 text-sm">{submitMsg}</p>}
    </div>
  )
}

export default App
