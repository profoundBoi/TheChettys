const { createClient } = supabase;

const SUPABASE_URL = "https://kucidicpvzfbhzcfqxer.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1Y2lkaWNwdnpmYmh6Y2ZxeGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMDg2MzcsImV4cCI6MjA2ODY4NDYzN30.wnRNF2a4xbQLsMstq9hNO9lgOs_xEw3l3mzDfyI3itQ";

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// DOM elements
const guestSearch = document.getElementById("guestSearch");
const guestResults = document.getElementById("guestResults");

// Render guest list
function renderGuests(data) {
  guestResults.innerHTML = data
    .map((guest) => {
      const isChecked = guest.RSVP ? "checked disabled" : "";
      const showSubmit = guest.RSVP
        ? ""
        : `<button class="submit-btn" style="display:none;">Submit</button>`;

      return `
        <div class="guest-entry" data-id="${guest.id}">
          <p><strong>${guest.full_name}</strong> (${guest.group_name})</p>
          <label>
            <input type="checkbox" class="rsvp-checkbox" ${isChecked} />
            Attending
          </label>
          ${showSubmit}
        </div>
      `;
    })
    .join("");

  document.querySelectorAll(".guest-entry").forEach((entry) => {
    const checkbox = entry.querySelector(".rsvp-checkbox");
    const submitBtn = entry.querySelector(".submit-btn");

    if (!checkbox || !submitBtn) return;

    checkbox.addEventListener("change", () => {
      // Show submit button only if checked
      submitBtn.style.display = checkbox.checked ? "inline-block" : "none";
    });

    submitBtn.addEventListener("click", async () => {
      const guestId = entry.getAttribute("data-id");
      const isAttending = true;

      try {
        const { error } = await supabaseClient
          .from("Guest")
          .update({ RSVP: isAttending })
          .eq("id", guestId);

        if (error) throw error;

        // Replace UI with confirmation message
        entry.innerHTML = `
          <p><strong>✅ RSVP received for ${entry.querySelector("strong").textContent}</strong></p>
        `;
      } catch (err) {
        console.error("Failed to submit RSVP:", err);
        alert("Error submitting RSVP. Please try again.");
      }
    });
  });
}

// Guest search input handler
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