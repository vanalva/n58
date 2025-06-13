// BCV API Integration for Homepage
console.log('✅ inicio.js loaded');

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🔄 Initializing BCV integration...');
    
    // Configuration
    const API_URL = 'https://bcv-api.vanalva.com/';
    const BCV_ELEMENTS = document.querySelectorAll('[data-bcv]');
    
    // Early return if no BCV elements found
    if (!BCV_ELEMENTS.length) {
        console.log('ℹ️ No BCV elements found on page');
        return;
    }

    // Helper Functions
    const displayError = (message) => {
        BCV_ELEMENTS.forEach(el => {
            el.textContent = message;
        });
    };

    const formatCurrency = (value) => {
        return `Bs. ${Number(String(value).replace(',', '.'))
            .toLocaleString('es-VE', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 4 
            })}`;
    };

    const formatDate = (dateStr) => {
        const monthMap = {
            'enero': '01', 'febrero': '02', 'marzo': '03', 
            'abril': '04', 'mayo': '05', 'junio': '06',
            'julio': '07', 'agosto': '08', 'septiembre': '09', 
            'octubre': '10', 'noviembre': '11', 'diciembre': '12'
        };

        try {
            // Try both date formats: "1 de enero de 2024" or "1 enero 2024"
            const parts = dateStr.match(/(\d{1,2})\s+de\s+([a-zA-Z]+)\s+de\s+(\d{4})/i) || 
                         dateStr.match(/(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})/i);
            
            if (parts) {
                const day = parts[1].padStart(2, '0');
                const month = monthMap[parts[2].toLowerCase()];
                const year = parts[3].slice(-2);
                return `${day}/${month}/${year}`;
            }
            return dateStr; // Fallback to original if format is unexpected
        } catch (e) {
            console.warn('⚠️ Date formatting failed:', e);
            return dateStr; // Fallback on any error
        }
    };

    // Main API Integration
    try {
        console.log('📡 Fetching BCV data...');
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success || !data.data) {
            throw new Error('Invalid API response format');
        }

        // Update DOM elements
        BCV_ELEMENTS.forEach(el => {
            const key = el.dataset.bcv.toLowerCase();
            const value = data.data[key];

            if (!value) {
                el.textContent = '—';
                return;
            }

            el.textContent = key === 'fecha' ? formatDate(value) : formatCurrency(value);
        });

        console.log('✅ BCV data updated successfully');

    } catch (error) {
        console.error('❌ BCV integration failed:', error);
        displayError('Error de conexión');
    }
});
</script>