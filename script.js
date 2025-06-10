const loader = document.getElementById('loader');
const toast = document.getElementById('toast');
const dropdown = document.getElementById('airtableRecords');
const statsDiv = document.getElementById('recordStats');

function showLoader() {
  loader.style.display = 'block';
}
function hideLoader() {
  loader.style.display = 'none';
}

function showToast(message, type = 'success') {
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 4000);
}

function fetchAirtable() {
  showLoader();
  fetch('https://glyph-api.onrender.com/fetch_airtable')
    .then(res => res.json())
    .then(data => {
      dropdown.innerHTML = ''; // Clear dropdown
      statsDiv.innerHTML = '';

      if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
        statsDiv.innerHTML = '<p>No data found.</p>';
        showToast('No records returned', 'fail');
        hideLoader();
        return;
      }

      const entries = Object.entries(data);
      dropdown.innerHTML = entries.map(([key]) =>
        `<option value="${key}">${key}</option>`
      ).join('');

      statsDiv.innerHTML = `
        <h3>Preview</h3>
        <ul>
          ${entries.map(([key, val]) => {
            const count = Array.isArray(val) ? val.length : 0;
            return `<li><strong>${key}:</strong> ${count} rows</li>`;
          }).join('')}
        </ul>
      `;

      showToast('Fetched Airtable data!');
      hideLoader();
    })
    .catch(err => {
      console.error(err);
      showToast('Failed to fetch Airtable', 'fail');
      hideLoader();
    });
}

function syncSelected() {
  const selected = dropdown.value;
  showLoader();
  fetch(`https://glyph-api.onrender.com/sync_codex`)
    .then(res => res.json())
    .then(data => {
      showToast(`Synced ${selected}!`);
      hideLoader();
    })
    .catch(err => {
      console.error(err);
      showToast('Sync failed', 'fail');
      hideLoader();
    });
}

function checkCORS() {
  fetch('https://glyph-api.onrender.com/ping', {
    method: 'OPTIONS',
    mode: 'cors'
  })
  .then(() => {
    document.getElementById('corsStatus').innerHTML =
      '<h3>CORS Check</h3><p class="badge success">CORS: OK</p>';
  })
  .catch(() => {
    document.getElementById('corsStatus').innerHTML =
      '<h3>CORS Check</h3><p class="badge fail">CORS: Blocked</p>';
  });
}

document.getElementById('fetchBtn')?.addEventListener('click', fetchAirtable);
document.getElementById('syncBtn')?.addEventListener('click', syncSelected);

checkCORS();
