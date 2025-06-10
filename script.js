function fetchAirtable() {
  const statsDiv = document.getElementById("recordStats");
  const dropdown = document.getElementById("airtableRecords");

  showLoader();
  statsDiv.innerHTML = "⏳ Loading…";
  dropdown.innerHTML = "";

  fetch("https://glyph-api.onrender.com/fetch_airtable")
    .then((res) => {
      if (!res.ok) throw new Error("API error");
      return res.json();
    })
    .then((data) => {
      console.log("✅ Airtable data received:", data);

      if (!data || Object.keys(data).length === 0) {
        statsDiv.innerHTML = "⚠️ No data found.";
        return;
      }

      statsDiv.innerHTML = `<h3>Preview</h3><ul>${Object.entries(data)
        .map(([key, val]) => `<li><b>${key}</b>: ${val.length || 0} rows</li>`)
        .join("")}</ul>`;

      Object.entries(data).forEach(([key, val]) => {
        const opt = document.createElement("option");
        opt.value = key;
        opt.textContent = `${key} (${val.length || 0})`;
        dropdown.appendChild(opt);
      });

      showToast("Records loaded!");
    })
    .catch((err) => {
      console.error("❌ Fetch error:", err);
      statsDiv.innerHTML = "❌ Failed to load data.";
      showToast("Error loading Airtable data", true);
    })
    .finally(() => {
      hideLoader();
    });
}
