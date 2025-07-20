document.addEventListener("DOMContentLoaded", () => {
  const guestFormContainer = document.getElementById("guestFormContainer");

  guestFormContainer.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    // Convert formData to URL-encoded string
    const encodedData = new URLSearchParams(formData).toString();

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbzRAOzUQhV7VNSIM1s5UKrPyiTgbHaxoleO4VQuau0bn4nzHmOHyxZkZpkKD7opX8OvBA/exec", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // Important!
        },
        body: encodedData
      });

      const result = await response.json();

      if (result.status === "success") {
        alert("RSVP submitted successfully!");
      } else {
        alert("There was an error: " + result.message);
      }

    } catch (error) {
      console.error("Fetch error:", error);
      alert("Something went wrong while submitting your RSVP.");
    }
  });
});