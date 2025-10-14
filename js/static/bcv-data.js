// BCV Data - Auto-updated by Zapier
const bcvData = {
    dolar: "197,2456",
    euro: "228,0909", 
    compra: "195,50",
    venta: "199,00",
    fecha: "14/10/25",
    lastUpdated: "2025-10-14T15:30:00Z"
};

function formatValue(value, key) {
    if (!value) return '—';
    
    if (key === 'fecha') {
        return value;
    } else {
        const numValue = Number(String(value).replace(',', '.'));
        return `Bs. ${numValue.toLocaleString('es-VE', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 4 
        })}`;
    }
}

function updateBCVDisplay() {
    document.querySelectorAll('[data-bcv]').forEach(el => {
        const key = el.dataset.bcv.toLowerCase();
        const value = bcvData[key];
        el.textContent = formatValue(value, key);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', updateBCVDisplay);
