// Setup Supabase
const { createClient } = supabase;
const SUPABASE_URL = "https://kucidicpvzfbhzcfqxer.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1Y2lkaWNwdnpmYmh6Y2ZxeGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMDg2MzcsImV4cCI6MjA2ODY4NDYzN30.wnRNF2a4xbQLsMstq9hNO9lgOs_xEw3l3mzDfyI3itQ";

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// DOM Elements
const guestSearch = document.getElementById("guestSearch");
const guestResults = document.getElementById("guestResults");

// Search handler
guestSearch.addEventListener("input", async (e) => {
  const query = e.target.value.trim();

  if (query.length < 2) {
    guestResults.innerHTML = "";
    return;
  }

  try {
    const { data, error } = await supabaseClient
      .from("Guest") // ✅ Use your actual table name here (case sensitive)
      .select("*")
      .ilike("full_name", `%${query}%`); // ✅ Use your correct column name

    if (error) throw error;

    if (!data || data.length === 0) {
      guestResults.innerHTML = "<p>No matching guests found.</p>";
      return;
    }

    // Show the list of matched guests
    guestResults.innerHTML = data
      .map((guest) => `<p>${guest.full_name} (${guest.group_name})</p>`)
      .join("");

  } catch (err) {
    console.error("Search failed:", err);
    guestResults.innerHTML = "<p>Error searching guests.</p>";
  }
});