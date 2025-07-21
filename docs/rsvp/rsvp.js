const apiUrl = "https://script.google.com/macros/s/AKfycbxbOKYBH4WZWVMxsLtK9qdBplkY82edtlRG4o0yPtbTYCcnaGYQZlQLnAnDJvsOB-k/exec";

document.getElementById("guestSearch").addEventListener("input", async (e) => {
  const query = e.target.value.trim();

  if (query.length < 3) {
    document.getElementById("guestList").innerHTML = "";
    document.getElementById("submitBtn").style.display = "none";
    return;
  }

  try {
    const response = await fetch(`${apiUrl}?action=search&name=${encodeURIComponent(query)}`);
    const data = await response.json();

    const guestList = document.getElementById("guestList");
    guestList.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      guestList.innerHTML = "<p>No matches found.</p>";
      document.getElementById("submitBtn").style.display = "none";
      return;
    }

    data.forEach(name => {
      const label = document.createElement("label");
      label.innerHTML = `
        <input type="checkbox" name="guest" value="${name}" checked>
        ${name}
      `;
      guestList.appendChild(label);
      guestList.appendChild(document.createElement("br"));
    });

    document.getElementById("submitBtn").style.display = "block";
  } catch (err) {
    console.error("Error fetching guests:", err);
  }
});

document.getElementById("submitBtn").addEventListener("click", async () => {
  const selectedGuests = Array.from(document.querySelectorAll('input[name="guest"]:checked')).map(input => input.value);
  if (selectedGuests.length === 0) return alert("Please select at least one person attending.");

  try {
    const formData = new FormData();
    formData.append("action", "submit");
    formData.append("attending", selectedGuests.join(", "));

    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
    });

    const result = await response.text();
    alert("RSVP submitted. Thank you!");
    document.getElementById("guestList").innerHTML = "";
    document.getElementById("submitBtn").style.display = "none";
    document.getElementById("guestSearch").value = "";
  } catch (err) {
    console.error("Error submitting RSVP:", err);
    alert("Error submitting RSVP. Try again later.");
  }
});