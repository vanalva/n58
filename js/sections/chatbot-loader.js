<script>
document.addEventListener('DOMContentLoaded', () => {
  const trigger = document.getElementById('chatbot-trigger');
  const container = document.getElementById('zapier-chatbot-placeholder');

  if (!trigger || !container) return;

  let iframeLoaded = false;

  const loadIframe = () => {
    if (iframeLoaded) return;

    const botUrl = trigger.getAttribute('data-chatbot');
    if (!botUrl) {
      console.warn('⚠️ Missing data-chatbot attribute on #chatbot-trigger');
      return;
    }

    const iframe = document.createElement('iframe');
    iframe.src = botUrl;
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.allow = 'clipboard-write *';
    iframe.style.border = 'none';
    iframe.classList.add('no-scroll-iframe');

    container.appendChild(iframe);
    iframeLoaded = true;
  };

  // 🖱️ Load immediately on user click (your original behavior)
  trigger.addEventListener('click', loadIframe);

  // 🧠 Also load automatically after idle or timeout (non-blocking)
  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadIframe, { timeout: 4000 });
  } else {
    setTimeout(loadIframe, 4000);
  }
});
</script>
