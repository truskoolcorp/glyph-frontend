const loader = document.getElementById('loader');
const toast = document.getElementById('toast');
const dropdown = document.getElementById('endpoint');
const output = document.getElementById('output');
const metrics = document.getElementById('metrics');
const history = document.getElementById('history');

const callHistory = [];

function showLoader() {
  loader.style.display = 'block';
}

function hideLoader() {
  loader.style.display = 'none';
}

function showToast(message, isError = false) {
  toast.textContent = message;
  toast.style.backgroundColor = isError ? '#f44336' : '#00bcd4';
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}

function updateMetrics(success) {
  const lastSync = new Date().toLocaleString();
  metrics.innerHTML = `
    <h3>Metrics</h3>
    <p><strong>Last Sync:</strong> ${lastSync}</p>
    <p><strong>Status:</strong> <span class="badge ${success ? 'success' : 'fail'}">${success ? 'Success' : 'Fail'}</span></p>
  `;
}

function updateHistory(endpoint, success) {
  callHistory.unshift({ endpoint, time: new Date().toLocaleTimeString(), success });
  if (callHistory.length > 5) callHistory.pop();
  history.innerHTML = '<h3>Call History</h3>' + callHistory.map(h => `
    <p>${h.time} - <strong>${h.endpoint}</strong> - <span class="badge ${h.success ? 'success' : 'fail'}">${h.success ? 'Success' : 'Fail'}</span></p>
  `).join('');
}

function fetchData() {
  const endpoint = dropdown.value;
  const url = `https://glyph-api.onrender.com${endpoint}`;
  showLoader();
  fetch(url, {
    headers: {
      'x-user-key': 'GLYPH_DASH_USER'
    }
  })
  .then(res => {
    if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
    return res.json();
  })
  .then(data => {
    output.textContent = JSON.stringify(data, null, 2);
    updateMetrics(true);
    updateHistory(endpoint, true);
    showToast("Synced successfully!");
  })
  .catch(err => {
    output.textContent = '';
    updateMetrics(false);
    updateHistory(endpoint, false);
    showToast("Failed to fetch data", true);
    console.error(err);
  })
  .finally(() => {
    hideLoader();
  });
}

function fetchAirtable() {
  showLoader();
  fetch("https://glyph-api.onrender.com/fetch_airtable", {
    headers: {
      'x-user-key': 'GLYPH_DASH_USER'
    }
  })
  .then(res => {
    if (!res.ok) throw new Error("Failed to fetch Airtable records");
    return res.json();
  })
  .then(data => {
    output.textContent = JSON.stringify(data, null, 2);
    updateMetrics(true);
    updateHistory("fetch_airtable", true);
    showToast("Airtable synced!");
  })
  .catch(err => {
    output.textContent = '';
    updateMetrics(false);
    updateHistory("fetch_airtable", false);
    showToast("Airtable fetch failed", true);
    console.error(err);
  })
  .finally(() => {
    hideLoader();
  });
}
