document.addEventListener('DOMContentLoaded', async () => {
    const url = 'https://bcv-api.vanalva.com/';
    console.log('✅ inicio.js loaded – fetching from:', url);
  
    const displayError = (message) => {
      document.querySelectorAll('[data-bcv]').forEach(el => {
        el.textContent = message;
      });
    };
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error('❌ Server error:', response.statusText);
        displayError('Server Error');
        return;
      }
  
      const responseText = await response.text();
      const json = JSON.parse(responseText);
  
      if (json.success && json.data) {
        const data = json.data;
        const format = val => `Bs. ${Number(String(val).replace(',', '.')).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
  
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
            el.textContent = format(value);
          }
        });
      } else {
        console.error('❌ JSON error or missing data');
        displayError('Data Error');
      }
    } catch (error) {
      console.error('❌ Fetch failed:', error);
      displayError('Connection Error');
    }
  });
  