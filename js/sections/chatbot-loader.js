<script>
document.addEventListener('DOMContentLoaded', () => {
  const trigger = document.querySelector('#chatbot-trigger');
  const placeholder = document.querySelector('#zapier-chatbot-placeholder');

  if (!trigger || !placeholder) return;

  let isLoaded = false;

  const loadChatbot = () => {
    if (isLoaded) return;
    const chatbotUrl = trigger.getAttribute('data-chatbot');
    if (!chatbotUrl) return;

    const iframe = document.createElement('iframe');
    iframe.src = chatbotUrl;
    iframe.style.border = 'none';
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.allow = 'clipboard-write *';
    iframe.classList.add('no-scroll-iframe');

    placeholder.appendChild(iframe);
    isLoaded = true;
  };

  // 🧠 Trigger preload on hover or focus
  trigger.addEventListener('mouseenter', loadChatbot);
  trigger.addEventListener('focus', loadChatbot); // for keyboard nav
});
</script>
