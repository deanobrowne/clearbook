// Popup script for Clearbook

// Get elements
const hideAdsCheckbox = document.getElementById('hideAds');
const hideSuggestedContentCheckbox = document.getElementById('hideSuggestedContent');
const hideReelsCheckbox = document.getElementById('hideReels');
const hideMarketplaceCheckbox = document.getElementById('hideMarketplace');
const hideAISlopCheckbox = document.getElementById('hideAISlop');
const friendsOnlyFeedCheckbox = document.getElementById('friendsOnlyFeed');
const chronologicalFeedCheckbox = document.getElementById('chronologicalFeed');
const showHiddenPlaceholdersCheckbox = document.getElementById('showHiddenPlaceholders');
const themeSelect = document.getElementById('themeSelect');
const openSettingsButton = document.getElementById('openSettings');
const refreshPageButton = document.getElementById('refreshPage');
const statusElement = document.getElementById('status');

// Load settings
async function loadSettings() {
  const result = await browser.storage.sync.get('settings');
  const settings = result.settings || getDefaultSettings();
  
  // Update UI
  hideAdsCheckbox.checked = settings.hideAds;
  hideSuggestedContentCheckbox.checked = settings.hideSuggestedContent;
  hideReelsCheckbox.checked = settings.hideReels;
  hideMarketplaceCheckbox.checked = settings.hideMarketplace;
  hideAISlopCheckbox.checked = settings.hideAISlop;
  friendsOnlyFeedCheckbox.checked = settings.friendsOnlyFeed;
  chronologicalFeedCheckbox.checked = settings.chronologicalFeed;
  showHiddenPlaceholdersCheckbox.checked = !!settings.showHiddenPlaceholders;
  themeSelect.value = settings.theme;
}

// Save settings
async function saveSettings() {
  const result = await browser.storage.sync.get('settings');
  const settings = result.settings || getDefaultSettings();
  
  // Update settings
  settings.hideAds = hideAdsCheckbox.checked;
  settings.hideSuggestedContent = hideSuggestedContentCheckbox.checked;
  settings.hideReels = hideReelsCheckbox.checked;
  settings.hideMarketplace = hideMarketplaceCheckbox.checked;
  settings.hideAISlop = hideAISlopCheckbox.checked;
  settings.friendsOnlyFeed = friendsOnlyFeedCheckbox.checked;
  settings.chronologicalFeed = chronologicalFeedCheckbox.checked;
  settings.showHiddenPlaceholders = showHiddenPlaceholdersCheckbox.checked;
  settings.theme = themeSelect.value;
  
  // Save to storage
  await browser.storage.sync.set({ settings });
  
  // Show status
  showStatus('Settings saved!', 'success');
}

// Show status message
function showStatus(message, type = 'success') {
  statusElement.textContent = message;
  statusElement.className = `status ${type}`;
  
  setTimeout(() => {
    statusElement.textContent = 'Settings saved';
    statusElement.className = 'status';
  }, 2000);
}

// Get default settings
function getDefaultSettings() {
  return {
    hideAds: true,
    hideSuggestedContent: true,
    hideReels: true,
    hideMarketplace: true,
    hideAISlop: true,
    friendsOnlyFeed: false,
    chronologicalFeed: true,
    showHiddenPlaceholders: false,
    theme: 'minimal',
    keywordBlacklist: [],
    providers: {
      facebook: {
        enabled: true,
        hideSponsored: true,
        hideSuggestedPosts: true,
        hideSuggestedPages: true,
        hideSuggestedGroups: true,
        hideReels: true,
        hideStories: true,
        hideMarketplace: true,
        hidePeopleYouMayKnow: true,
        hideTrending: true,
        hideWatch: true
      },
      reddit: { enabled: false },
      twitter: { enabled: false }
    }
  };
}

// Event listeners
hideAdsCheckbox.addEventListener('change', saveSettings);
hideSuggestedContentCheckbox.addEventListener('change', saveSettings);
hideReelsCheckbox.addEventListener('change', saveSettings);
hideMarketplaceCheckbox.addEventListener('change', saveSettings);
hideAISlopCheckbox.addEventListener('change', saveSettings);
friendsOnlyFeedCheckbox.addEventListener('change', saveSettings);
chronologicalFeedCheckbox.addEventListener('change', saveSettings);
showHiddenPlaceholdersCheckbox.addEventListener('change', saveSettings);
themeSelect.addEventListener('change', saveSettings);

openSettingsButton.addEventListener('click', () => {
  browser.runtime.openOptionsPage();
});

refreshPageButton.addEventListener('click', async () => {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  if (tabs[0]) {
    browser.tabs.reload(tabs[0].id);
    showStatus('Page refreshing...', 'saving');
  }
});

// Initialize
loadSettings();
