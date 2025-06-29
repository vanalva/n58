document.addEventListener('DOMContentLoaded', async () => {
  const url = 'https://bcv-api.vanalva.com/';

  const displayError = (message) => {
    document.querySelectorAll('[data-bcv]').forEach(el => {
      el.textContent = message;
    });
  };

  try {
    const response = await fetch(url);
    if (!response.ok) {
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
      displayError('Data Error');
    }
  } catch (error) {
    displayError('Connection Error');
  }

  let isScrollBlocked = false;

  const isMobile = () => window.innerWidth <= 767;

  function blockScroll() {
    if (isScrollBlocked) return;
    document.body.style.overflow = "hidden";
    isScrollBlocked = true;
  }

  function allowScroll() {
    if (!isScrollBlocked) return;
    document.body.style.overflow = "";
    isScrollBlocked = false;
  }

  document.addEventListener("click", function (e) {
    const el = e.target.closest("[chatbot-no-scroll]");
    if (!el) return;

    const action = el.getAttribute("chatbot-no-scroll");

    if (action === "open" && isMobile()) {
      blockScroll();
    }

    if (action === "close") {
      allowScroll();
    }
  });

  window.addEventListener("resize", () => {
    if (!isMobile()) {
      allowScroll();
    }
  });

  const fixedButtons = document.querySelector(".fixed-buttons");

  if (!fixedButtons) return;

  const isDesktop = () => window.innerWidth >= 992;
  let wasDragged = false;

  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  if (isDesktop()) {
    Draggable.create(fixedButtons, {
      type: "x,y",
      bounds: "body",
      edgeResistance: 0.65,
      onDragStart: function() {
        wasDragged = true;
      },
      onDrag: function() {
        const rect = this.target.getBoundingClientRect();
        if (rect.right < 0 || rect.bottom < 0 || rect.left > window.innerWidth || rect.top > window.innerHeight) {
          gsap.set(this.target, { x: 0, y: 0 });
        }
      }
    });

    window.addEventListener("scroll", debounce(function() {
      if (wasDragged) {
        gsap.set(fixedButtons, { clearProps: "x,y" });
        wasDragged = false;
      }
    }, 100));
  }
});

