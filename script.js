
const SUPABASE_URL = "https://pqghusnpwyojthbrnjsh.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxZ2h1c25wd3lvanRoYnJuanNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMTU2NjIsImV4cCI6MjA2MDU5MTY2Mn0.G_-UkoxNV4HfX7RHudtCQGYBtu17l5zdmZzIRL-nwh0";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function loginWithPin(pinInput) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('pin', pinInput)
    .single();

  if (error || !data) {
    alert("Invalid PIN");
    return null;
  }

  const user = {
    id: data.id,
    name: data.name,
    role: data.role
  };

  localStorage.setItem("loggedInUser", JSON.stringify(user));
  document.getElementById("loginOverlay").style.display = "none";
  document.body.classList.add("logged-in");

  if (user.role === "admin") {
    document.getElementById("settingsIcon").style.display = "block";
  }

  return user;
}

function handleLogin() {
  const pin = document.getElementById("pinInput").value.trim();
  if (pin) {
    loginWithPin(pin);
  }
}
