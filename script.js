const loader = document.getElementById('loader');
const toast = document.getElementById('toast');
const dropdown = document.getElementById('recordDropdown');

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
      dropdown.innerHTML = '';
      Object.entries(data).forEach(([key, val]) => {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = `${key}: ${val?.length || 0} records`;
        dropdown.appendChild(opt);
      });
      showToast("Fetched Airtable data", "success");
    })
    .catch(() => showToast("Error fetching records", "error"))
    .finally(hideLoader);
}

function syncAirtable() {
  const selected = dropdown.value;
  if (!selected) {
    return showToast("Select a record type to sync", "error");
  }

  showLoader();
  fetch('https://glyph-api.onrender.com/sync_airtable', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: { type: selected } })
  })
    .then(res => res.json())
    .then(() => showToast("Sync successful"))
    .catch(() => showToast("Sync failed", "error"))
    .finally(hideLoader);
}
