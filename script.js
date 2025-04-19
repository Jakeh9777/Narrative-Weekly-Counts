
const SUPABASE_URL = 'https://pqghusnpwyojthbrnjsh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxZ2h1c25wd3lvanRoYnJuanNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMTU2NjIsImV4cCI6MjA2MDU5MTY2Mn0.G_-UkoxNV4HfX7RHudtCQGYBtu17l5zdmZzIRL-nwh0';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function loginWithPin(pin) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('pin', pin)
    .single();

  if (error || !data) {
    alert("Invalid PIN");
    return;
  }

  document.getElementById("loginOverlay").style.display = "none";
  document.getElementById("app").style.display = "block";

  if (data.role === 'admin') {
    // Show admin features
    console.log("Admin user logged in");
  } else {
    console.log("Standard user logged in");
  }
}

function handleLogin(event) {
  event.preventDefault();
  const pin = document.getElementById("pinInput").value.trim();
  if (pin) {
    loginWithPin(pin);
  }
}
