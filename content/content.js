// Main content script for Clearbook
// This script coordinates the provider-specific scripts

(async () => {
  console.log('Clearbook: Content script loaded');

  // Detect which provider we're on
  const hostname = window.location.hostname;
  let currentProvider = null;

  // Determine provider based on hostname
  if (hostname.includes('facebook.com')) {
    currentProvider = 'facebook';
  } else if (hostname.includes('reddit.com')) {
    currentProvider = 'reddit';
  } else if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
    currentProvider = 'twitter';
  }

  if (!currentProvider) {
    console.log('Clearbook: Unknown provider, exiting');
    return;
  }

  console.log(`Clearbook: Detected provider: ${currentProvider}`);

  // Load settings
  const settings = await ClearbookStorage.getSettings();

  // Apply theme
  applyTheme(settings.theme);

  // Listen for theme changes
  browser.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.settings && changes.settings.newValue && changes.settings.newValue.theme) {
      applyTheme(changes.settings.newValue.theme);
    }
  });

  // Apply theme function
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-clearbook-theme', theme);
  }

  // Add Clearbook indicator (runs at document_start, so wait for <body>)
  if (document.body) {
    addClearbookIndicator();
  } else {
    document.addEventListener('DOMContentLoaded', addClearbookIndicator, { once: true });
  }

  function addClearbookIndicator() {
    // Only add once
    if (document.getElementById('clearbook-indicator')) return;

    const indicator = document.createElement('div');
    indicator.id = 'clearbook-indicator';
    indicator.textContent = '✨ Clearbook Active';
    indicator.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      z-index: 9999;
      pointer-events: none;
      opacity: 0.5;
      transition: opacity 0.3s;
    `;
    
    document.body.appendChild(indicator);
    
    // Fade out after 3 seconds
    setTimeout(() => {
      indicator.style.opacity = '0';
    }, 3000);
  }
})();
