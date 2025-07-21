const { createClient } = supabase;
const SUPABASE_URL = "https://kucidicpvzfbhzcfqxer.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1Y2lkaWNwdnpmYmh6Y2ZxeGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMDg2MzcsImV4cCI6MjA2ODY4NDYzN30.wnRNF2a4xbQLsMstq9hNO9lgOs_xEw3l3mzDfyI3itQ"; // Replace with your actual key

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// DOM Elements
const guestSearch = document.getElementById("guestSearch");
const guestResults = document.getElementById("guestResults");

// Helper: render guests with RSVP checkboxes
function renderGuests(data) {
  guestResults.innerHTML = data
    .map(guest => `
      <div class="guest-entry" data-id="${guest.id}">
        <p><strong>${guest.full_name}</strong> (${guest.group_name})</p>
        <label>
          <input type="checkbox" class="rsvp-checkbox" ${guest.RSVP ? "checked" : ""} />
          Attending
        </label>
      </div>
    `).join("");

  // Add listeners for the new checkboxes
  document.querySelectorAll(".rsvp-checkbox").forEach(checkbox => {
    checkbox.addEventListener("change", async (e) => {
      const guestDiv = e.target.closest(".guest-entry");
      const guestId = guestDiv.getAttribute("data-id");
      const isAttending = e.target.checked;

      try {
        const { error } = await supabaseClient
          .from("Guest")
          .update({ RSVP: isAttending })
          .eq("id", guestId);

        if (error) throw error;

        alert(`RSVP updated to ${isAttending ? "Attending" : "Not Attending"}`);
      } catch (err) {
        console.error("Failed to update RSVP:", err);
        alert("Error updating RSVP, please try again.");
        // Revert checkbox state if error
        e.target.checked = !isAttending;
      }
    });
  });
}

// Search handler
guestSearch.addEventListener("input", async (e) => {
  const query = e.target.value.trim();

  if (query.length < 2) {
    guestResults.innerHTML = "";
    return;
  }

  try {
    const { data, error } = await supabaseClient
      .from("Guest")
      .select("id, full_name, group_name, RSVP")
      .ilike("full_name", `%${query}%`);

    if (error) throw error;

    if (!data || data.length === 0) {
      guestResults.innerHTML = "<p>No matching guests found.</p>";
      return;
    }

    renderGuests(data);

  } catch (err) {
    console.error("Search failed:", err);
    guestResults.innerHTML = "<p>Error searching guests.</p>";
  }
});