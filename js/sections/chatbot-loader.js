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

  // ⏱️ Automatically load after delay
  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadIframe);
  } else {
    setTimeout(loadIframe, 4000);
  }

  // 🖱️ Fallback: Load immediately if user clicks early
  trigger.addEventListener('click', loadIframe);
});
</script>
