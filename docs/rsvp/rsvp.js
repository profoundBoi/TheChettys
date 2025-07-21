// FIX: Destructure Supabase from the global 'supabase' object
const { createClient } = supabase;

const SUPABASE_URL = "https://kucidicpvzfbhzcfqxer.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

const client = createClient(SUPABASE_URL, SUPABASE_KEY); //  Now using 'client'

// DOM and RSVP logic
document.addEventListener("DOMContentLoaded", () => {
  const guestSearch = document.getElementById("guestSearch");
  const groupDisplay = document.getElementById("groupDisplay");

  guestSearch.addEventListener("input", async (e) => {
    const query = e.target.value.trim();

    if (query.length < 2) {
      groupDisplay.innerHTML = "";
      return;
    }

    const { data: guestData, error } = await client
      .from("Guest")
      .select("*")
      .ilike("fullName", `%${query}%`);

    if (error || !guestData || guestData.length === 0) {
      groupDisplay.innerHTML = `<p>No guest found.</p>`;
      return;
    }

    const groupName = guestData[0].groupName;

    const { data: groupGuests, error: groupError } = await client
      .from("Guest")
      .select("*")
      .eq("groupName", groupName);

    if (groupError) {
      groupDisplay.innerHTML = `<p>Could not fetch group.</p>`;
      return;
    }

    const guestHTML = groupGuests
      .map(
        guest => `
        <label>
          <input type="checkbox" data-id="${guest.id}" ${guest.rsvp ? "checked" : ""}>
          ${guest.fullName}
        </label><br>`
      )
      .join("");

    groupDisplay.innerHTML = `
      <h3>Group: ${groupName}</h3>
      <form id="rsvpForm">${guestHTML}</form>
      <button id="submitRSVP" type="button">Submit RSVP</button>
    `;

    document.getElementById("submitRSVP").addEventListener("click", async () => {
      const checkboxes = document.querySelectorAll("#rsvpForm input[type='checkbox']");

      for (const checkbox of checkboxes) {
        const id = checkbox.dataset.id;
        const isAttending = checkbox.checked;

        await client
          .from("Guest")
          .update({ rsvp: isAttending })
          .eq("id", id);
      }

      alert("RSVP submitted successfully!");
    });
  });
});