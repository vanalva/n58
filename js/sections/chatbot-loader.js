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

  // ✅ Smart load: idle or timeout after 4 seconds
  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadIframe, { timeout: 4000 });
  } else {
    setTimeout(loadIframe, 4000);
  }

  // ✅ Fallback: User clicks before idle or timeout
  trigger.addEventListener('click', loadIframe);
});
</script>
