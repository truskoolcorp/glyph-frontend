
fetch('https://glyph-api.onrender.com/ping')
    .then(response => response.json())
    .then(data => {
        document.body.insertAdjacentHTML('beforeend', `<pre>${JSON.stringify(data, null, 2)}</pre>`);
    });
