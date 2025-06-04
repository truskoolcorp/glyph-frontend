
// == Configuration ==
const API_BASE = "https://glyph-api.onrender.com";

// == DOM Elements ==
const loader = document.getElementById("loader");
const toast = document.getElementById("toast");
const recordDropdown = document.getElementById("recordDropdown");

// == Utility Functions ==
function showLoader(show) {
  loader.style.display = show ? "block" : "none";
}
function showToast(message, isSuccess = true) {
  toast.innerText = message;
  toast.className = isSuccess ? "toast success" : "toast error";
  toast.style.display = "block";
  setTimeout(() => (toast.style.display = "none"), 4000);
}
function displayResponse(title, data) {
  const output = document.createElement("div");
  output.innerHTML = `<h3>${title}</h3><pre>${JSON.stringify(data, null, 2)}</pre>`;
  document.body.appendChild(output);
}

// == API Calls ==
function fetchAirtable() {
  showLoader(true);
  fetch(\`\${API_BASE}/fetch_airtable\`)
    .then(res => res.json())
    .then(data => {
      showLoader(false);
      displayResponse("📋 Airtable Records", data);
      populateDropdown(data); // fill dropdown
    })
    .catch(err => {
      showLoader(false);
      showToast("Failed to fetch Airtable data", false);
      console.error(err);
    });
}

function syncAirtable() {
  const selected = recordDropdown.value;
  if (!selected) return showToast("No record selected!", false);

  const fields = { id: selected, status: "synced" }; // Example field update

  showLoader(true);
  fetch(\`\${API_BASE}/sync_airtable\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields })
  })
    .then(res => res.json())
    .then(data => {
      showLoader(false);
      displayResponse("📡 Airtable Synced", data);
      showToast("Airtable sync complete!");
    })
    .catch(err => {
      showLoader(false);
      showToast("Sync failed", false);
      console.error(err);
    });
}

function populateDropdown(data) {
  if (!Array.isArray(data)) return;
  recordDropdown.innerHTML = "";
  data.forEach((record, i) => {
    const option = document.createElement("option");
    option.value = record.id || \`record_\${i}\`;
    option.textContent = record.name || \`Record #\${i + 1}\`;
    recordDropdown.appendChild(option);
  });
}
