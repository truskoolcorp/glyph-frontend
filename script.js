const dropdown = document.getElementById('airtableRecords');
const syncButton = document.getElementById('syncBtn');
const toast = document.createElement('div');
toast.id = 'toast';
document.body.appendChild(toast);

function showToast(message, isSuccess = true) {
    toast.textContent = message;
    toast.style.background = isSuccess ? '#28a745' : '#dc3545';
    toast.style.color = '#fff';
    toast.style.padding = '10px';
    toast.style.position = 'fixed';
    toast.style.top = '10px';
    toast.style.right = '10px';
    toast.style.borderRadius = '5px';
    toast.style.zIndex = '1000';
    setTimeout(() => toast.remove(), 4000);
}

function setLoading(isLoading) {
    syncButton.textContent = isLoading ? 'Syncing...' : 'Sync Selected';
    syncButton.disabled = isLoading;
}

document.getElementById('fetchBtn').addEventListener('click', () => {
    dropdown.innerHTML = '<option>Loading...</option>';
    fetch('https://glyph-api.onrender.com/fetch_airtable')
        .then(res => res.json())
        .then(data => {
            dropdown.innerHTML = '';
            if (!data || !Array.isArray(data)) {
                showToast('Invalid response format', false);
                return;
            }
            data.forEach((record, i) => {
                const option = document.createElement('option');
                option.value = record.id || `rec${i}`;
                option.textContent = record.fields?.Name || `Record ${i + 1}`;
                dropdown.appendChild(option);
            });
        })
        .catch(err => {
            console.error(err);
            showToast('Failed to fetch records', false);
        });
});

syncButton.addEventListener('click', () => {
    const selected = dropdown.value;
    if (!selected) return showToast('No record selected', false);
    
    setLoading(true);
    fetch('https://glyph-api.onrender.com/sync_airtable', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ fields: { id: selected } })
    })
    .then(res => res.json())
    .then(res => {
        showToast('Sync complete!');
    })
    .catch(err => {
        console.error(err);
        showToast('Sync failed!', false);
    })
    .finally(() => setLoading(false));
});
