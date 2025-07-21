// Replace with your real values from Supabase → Project → Settings → API
const SUPABASE_URL = "https://kucidicpvzfbhzcfqxer.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1Y2lkaWNwdnpmYmh6Y2ZxeGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMDg2MzcsImV4cCI6MjA2ODY4NDYzN30.wnRNF2a4xbQLsMstq9hNO9lgOs_xEw3l3mzDfyI3itQ";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.getElementById("guestSearch").addEventListener("input", async (e) => {
  const query = e.target.value.trim();

  if (query.length < 2) {
    document.getElementById("groupDisplay").innerHTML = "";
    return;
  }

  // Search for guest by name
  const { data, error } = await supabase
    .from("Guest")
    .select("*")
    .ilike("fullName", `%${query}%`);

  if (error || !data || data.length === 0) {
    document.getElementById("groupDisplay").innerHTML = `<p>No guest found.</p>`;
    return;
  }

  const groupName = data[0].groupName;

  // Get all guests in the same group
  const { data: groupGuests, error: groupError } = await supabase
    .from("Guest")
    .select("*")
    .eq("groupName", groupName);

  if (groupError) {
    document.getElementById("groupDisplay").innerHTML = `<p>Could not fetch group.</p>`;
    return;
  }

  // Display checkboxes
  const guestHTML = groupGuests
    .map(
      guest => `
        <label>
          <input type="checkbox" data-id="${guest.id}" ${guest.rsvp ? "checked" : ""}>
          ${guest.fullName}
        </label><br>
      `
    )
    .join("");

  document.getElementById("groupDisplay").innerHTML = `
    <h3>Group: ${groupName}</h3>
    <form id="rsvpForm">${guestHTML}</form>
    <button id="submitRSVP" type="button">Submit RSVP</button>
  `;

  document.getElementById("submitRSVP").addEventListener("click", async (e) => {
    e.preventDefault();

    const checkboxes = document.querySelectorAll("#rsvpForm input[type='checkbox']");
    for (const checkbox of checkboxes) {
      const id = checkbox.dataset.id;
      const isAttending = checkbox.checked;

      await supabase
        .from("Guest")
        .update({ rsvp: isAttending })
        .eq("id", id);
    }

    alert("RSVP submitted successfully!");
  });
});