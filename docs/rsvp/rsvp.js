const scriptURL = 'https://script.google.com/macros/s/AKfycbzRAOzUQhV7VNSIM1s5UKrPyiTgbHaxoleO4VQuau0bn4nzHmOHyxZkZpkKD7opX8OvBA/exec ';

const searchInput = document.getElementById('searchInput');
const suggestions = document.getElementById('suggestions');
const guestFormContainer = document.getElementById('guestFormContainer');

searchInput.addEventListener('input', async () => {
  const inputValue = searchInput.value.trim();
  suggestions.innerHTML = '';

  if (inputValue.length < 2) return;

  try {
    const res = await fetch(`https://script.google.com/macros/s/AKfycbzRAOzUQhV7VNSIM1s5UKrPyiTgbHaxoleO4VQuau0bn4nzHmOHyxZkZpkKD7opX8OvBA/exec?action=search&name=${encodeURIComponent(inputValue)}`);
    const data = await res.json();

    data.forEach(group => {
      const li = document.createElement('li');
      li.textContent = group.group_name;
      li.addEventListener('click', () => showForm(group));
      suggestions.appendChild(li);
    });
  } catch (err) {
    console.error('Error fetching guests:', err);
  }
});

function showForm(group) {
  suggestions.innerHTML = '';
  searchInput.value = group.group_name;

  guestFormContainer.innerHTML = `
    <form id="rsvpForm">
      <div class="guest-box">
        ${group.guests.map(g => `
          <label>
            <input type="checkbox" name="attending" value="${g}" />
            ${g}
          </label>
        `).join('')}
      </div>
      <input type="hidden" name="group" value="${group.group_name}" />
      <button type="submit">Submit RSVP</button>
    </form>
  `;

  document.getElementById('rsvpForm').addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const attending = Array.from(form.querySelectorAll('input[name="attending"]:checked')).map(cb => cb.value);

    try {
      await fetch(scriptURL, {
        method: 'POST',
        body: JSON.stringify({
          group: formData.get('group'),
          attending
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      guestFormContainer.innerHTML = `<p>Thank you for your RSVP!</p>`;
    } catch (err) {
      guestFormContainer.innerHTML = `<p style="color:red;">Failed to submit RSVP. Please try again later.</p>`;
    }
  });
}