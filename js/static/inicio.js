<script defer>
document.addEventListener('DOMContentLoaded', async () => {
    const url = 'https://your-domain.com/path/to/your/script.php';
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
            console.error('SCRIPT_ERROR: The server responded with a non-successful status.');
            displayError('Server Error');
            return;
        }
        
        const responseText = await response.text();
        console.log('SCRIPT: Raw text from server:', responseText);

        const json = JSON.parse(responseText);

        if (json.success && json.data) {
            console.log('SCRIPT: JSON is valid and success is true. Updating elements.');
            const data = json.data;

            // ✅ START OF CHANGED SECTION 1
            // The format function now accepts a 'currencyKey' to determine the correct prefix.
            const format = (val, currencyKey) => {
                let prefix = 'Bs. '; // Default prefix for values like 'compra' and 'venta'
                if (currencyKey === 'dolar') {
                    prefix = 'Bs / USD ';
                } else if (currencyKey === 'euro') {
                    prefix = 'Bs / EUR ';
                }

                const formattedNumber = Number(String(val).replace(',', '.')).toLocaleString('es-VE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 4
                });

                return prefix + formattedNumber;
            };
            // ✅ END OF CHANGED SECTION 1
            
            document.querySelectorAll('[data-bcv]').forEach(el => {
                const key = el.dataset.bcv.toLowerCase();
                const value = data[key];

                if (!value) {
                    el.textContent = '—';
                } else if (key === 'fecha') {
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
                            el.textContent = value;
                        }
                    } catch (e) {
                         el.textContent = value;
                    }
                } else {
                    // ✅ START OF CHANGED SECTION 2
                    // We now pass the 'key' (e.g., 'dolar', 'euro') to the format function.
                    el.textContent = format(value, key);
                    // ✅ END OF CHANGED SECTION 2
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