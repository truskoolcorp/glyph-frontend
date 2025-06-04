const fetchBtn = document.getElementById('fetchBtn');
const dropdown = document.getElementById('airtableRecords');
const syncBtn = document.getElementById('syncBtn');
const loader = document.getElementById('loader');
const toast = document.getElementById('toast');

// Toast logic
function showToast(message, success = true) {
  toast.textContent = message;
  toast.className = `toast ${success ? 'success' : 'error'}`;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
    toast.className = 'toast';
  }, 3000);
}

// Loader toggle
function setLoading(visible) {
  loader.style.display = visible ? 'block' : 'none';
  syncBtn.disabled = visible;
}

// Fetch records
fetchBtn.addEventListener('click', () => {
  setLoading(true);
  fetch('https://glyph-api.onrender.com/fetch_airtable')
    .then(res => res.json())
    .then(data => {
      dropdown.innerHTML = ''; // Clear old options
      if (!Array.isArray(data)) throw new Error('Invalid response');
      data.forEach((record, idx) => {
        const option = document.createElement('option');
        option.value = JSON.stringify(record.fields);
        option.textContent = record.fields?.Name || `Record ${idx + 1}`;
        dropdown.appendChild(option);
      });
      showToast('Records loaded.');
    })
    .catch(err => {
      console.error(err);
      showToast('Failed to fetch records.', false);
    })
    .finally(() => setLoading(false));
});

// Sync record
syncBtn.addEventListener('click', () => {
  const fields = dropdown.value;
  if (!fields) return showToast('No record selected.', false);

  setLoading(true);
  fetch('https://glyph-api.onrender.com/sync_airtable', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: JSON.parse(fields) }),
  })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      showToast('Sync successful.');
    })
    .catch(err => {
      console.error(err);
      showToast('Sync failed.', false);
    })
    .finally(() => setLoading(false));
});
