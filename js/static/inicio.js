<script defer>
document.addEventListener('DOMContentLoaded', async () => {
    // I'm using the more detailed script from our previous conversation
    const url = 'https://bcv-api.vanalva.com/';
    console.log('SCRIPT: Starting. Attempting to fetch from:', url);

    const displayError = (message) => {
        document.querySelectorAll('[data-bcv]').forEach(el => {
            el.textContent = message;
        });
    };

    try {
        const response = await fetch(url);
        console.log('SCRIPT: Received a response from the server.');
        console.log('SCRIPT: Status Code:', response.status, response.statusText);

        if (!response.ok) {
            console.error('SCRIPT_ERROR: The server responded with a non-successful status (like 404 or 500).');
            displayError('Server Error');
            return;
        }
        
        const responseText = await response.text();
        console.log('SCRIPT: Raw text from server:', responseText);

        const json = JSON.parse(responseText);

        if (json.success && json.data) {
            console.log('SCRIPT: JSON is valid and success is true. Updating elements.');
            const data = json.data;
            const format = val => `Bs. ${Number(String(val).replace(',', '.')).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
            
            document.querySelectorAll('[data-bcv]').forEach(el => {
                const key = el.dataset.bcv.toLowerCase();
                const value = data[key];

                if (!value) {
                    el.textContent = '—';
                } else if (key === 'fecha') {
                    // ✅ START OF CHANGED SECTION
                    // This block will now try to reformat the date string
                    try {
                        const monthMap = {
                            'enero': '01', 'febrero': '02', 'marzo': '03', 'abril': '04', 'mayo': '05', 'junio': '06',
                            'julio': '07', 'agosto': '08', 'septiembre': '09', 'octubre': '10', 'noviembre': '11', 'diciembre': '12'
                        };
                        const parts = value.match(/(\d{1,2})\s+de\s+([a-zA-Z]+)\s+de\s+(\d{4})/i) || value.match(/(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})/i);
                        
                        if (parts) {
                            const day = parts[1].padStart(2, '0');
                            const month = monthMap[parts[2].toLowerCase()];
                            const year = parts[3].slice(-2);
                            el.textContent = `${day}/${month}/${year}`;
                        } else {
                            el.textContent = value; // Fallback to original if format is unexpected
                        }
                    } catch (e) {
                         el.textContent = value; // Fallback on any error
                    }
                    // ✅ END OF CHANGED SECTION

                } else {
                    el.textContent = format(value);
                }
            });

        } else {
            console.error('SCRIPT_ERROR: JSON was parsed, but "success" was false or "data" was missing.');
            displayError('Data Error');
        }

    } catch (error) {
        console.error('SCRIPT_ERROR: The fetch failed completely. This is very likely a CORS or network error.', error);
        displayError('Connection Error');
    }
});
</script>