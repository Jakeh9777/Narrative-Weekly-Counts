
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Supabase credentials
const supabaseUrl = 'https://pqghusnpwyojthbrnjsh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxZ2h1c25wd3lvanRoYnJuanNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMTU2NjIsImV4cCI6MjA2MDU5MTY2Mn0.G_-UkoxNV4HfX7RHudtCQGYBtu17l5zdmZzIRL-nwh0'
const supabase = createClient(supabaseUrl, supabaseKey)

const WHOLESALE_ACCOUNT_ID = 'bbbac543-ae61-4529-a0fe-fafae541328d' // Narrative Coffee Roasters
const USER_NAME = 'Jake' // replace dynamically later if needed

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('productForm')
  const dateInput = document.getElementById('dateInput')
  const usernameDisplay = document.getElementById('usernameDisplay')
  usernameDisplay.textContent = USER_NAME

  const today = new Date().toISOString().split('T')[0]
  dateInput.value = today

  // Load products from Supabase
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('wholesale_account_id', WHOLESALE_ACCOUNT_ID)

  if (error) {
    alert('Failed to load products.')
    return
  }

  products.forEach(p => {
    const div = document.createElement('div')
    div.innerHTML = `<label>${p.name}<input type="number" min="0" name="${p.id}" /></label>`
    form.appendChild(div)
  })

  document.getElementById('submitBtn').addEventListener('click', async () => {
    const data = new FormData(form)
    const entries = []
    const selectedDate = dateInput.value

    for (let [productId, value] of data.entries()) {
      entries.push({
        wholesale_account_id: WHOLESALE_ACCOUNT_ID,
        product_id: productId,
        count_date: selectedDate,
        count: parseInt(value || 0, 10)
      })
    }

    const { error: insertError } = await supabase.from('product_counts').insert(entries)

    if (insertError) {
      alert('Error saving counts.')
      console.error(insertError)
    } else {
      alert('Counts saved!')
    }
  })
})
