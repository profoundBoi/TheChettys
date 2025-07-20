const API_URL = "https://script.google.com/macros/s/AKfycbzRAOzUQhV7VNSIM1s5UKrPyiTgbHaxoleO4VQuau0bn4nzHmOHyxZkZpkKD7opX8OvBA/exec ";
let guestList = [];

const searchInput = document.getElementById("searchInput");
const suggestions = document.getElementById("suggestions");
const guestFormContainer = document.getElementById("guestFormContainer");

async function fetchGuestList() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    guestList = data.guestList || [];
  } catch (err) {
    alert("Failed to fetch guest list.");
    console.error(err);
  }
}

function createGuestForm(group) {
  guestFormContainer.innerHTML = `
    <h3>${group.groupName}</h3>
    <form id="rsvpForm">
      ${group.members.map(member => `
        <div class="member-checkbox">
          <input type="checkbox" name="attending" value="${member}" id="${member}" />
          <label for="${member}">${member}</label>
        </div>
      `).join('')}
      <button type="submit">Submit RSVP</button>
    </form>
  `;

  document.getElementById("rsvpForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const checkboxes = document.querySelectorAll('input[name="attending"]:checked');
    if (checkboxes.length === 0) {
      alert("Please select at least one person attending.");
      return;
    }
    const selected = Array.from(checkboxes).map(cb => cb.value);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ group: group.groupName, attending: selected })
      });
      const result = await res.json();
      alert("Thank you for RSVPing!");
      guestFormContainer.innerHTML = "";
      searchInput.value = "";
      suggestions.innerHTML = "";
    } catch (err) {
      alert("Failed to submit RSVP.");
      console.error(err);
    }
  });
}

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  suggestions.innerHTML = "";

  if (value.length === 0) return;

  const matches = guestList.filter(group =>
    group.members.some(name => name.toLowerCase().includes(value))
  );

  matches.forEach(group => {
    const li = document.createElement("li");
    li.textContent = group.groupName;
    li.addEventListener("click", () => {
      createGuestForm(group);
      suggestions.innerHTML = "";
    });
    suggestions.appendChild(li);
  });
});

window.onload = fetchGuestList;