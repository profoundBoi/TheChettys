const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("resultsContainer");
const submitBtn = document.getElementById("submitBtn");

let filtered = []; // ✅ Make this accessible to both listeners

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  resultsContainer.innerHTML = "";

  if (query.length < 2) return;

  filtered = guestList.filter(group =>
    group.members.some(member => member.toLowerCase().includes(query))
  );

  filtered.forEach(group => {
    const groupDiv = document.createElement("div");
    groupDiv.classList.add("family-group");

    groupDiv.innerHTML = `
      <h3>${group.groupName}</h3>
      ${group.members.map(member => `
        <label class="attendee">
          <input type="checkbox" value="${member}" />
          ${member}
        </label>
      `).join("")}
    `;

    resultsContainer.appendChild(groupDiv);
  });
});

submitBtn.addEventListener("click", () => {
  if (filtered.length === 0) {
    alert("Please search and select your names before submitting.");
    return;
  }

  const groupName = filtered[0]?.groupName || "Unknown Group";
  const checked = Array.from(resultsContainer.querySelectorAll("input[type='checkbox']:checked"))
                       .map(input => input.value);

  if (checked.length === 0) {
    alert("Please tick who will be attending.");
    return;
  }

  fetch("https://script.google.com/macros/s/AKfycbxY_nSGXacXZqsvtBeXLGWIoJCWtFT5FBkJv48FhxFq4S9kmiv7lWf_RVe0LUbCmGq1/exec", {
    method: "POST",
    body: JSON.stringify({
      groupName: groupName,
      responses: checked.map(name => ({
        name: name,
        attending: true
      }))
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(response => response.json())
  .then(data => {
    alert("RSVP submitted! Thank you.");
    searchInput.value = "";
    resultsContainer.innerHTML = "";
  })
  .catch(error => {
    console.error("Error submitting RSVP:", error);
    alert("There was a problem. Please try again.");
  });
});