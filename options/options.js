// Options page script for Clearbook

// Get all elements
const elements = {
  // General settings
  hideAds: document.getElementById('hideAds'),
  hideSuggestedContent: document.getElementById('hideSuggestedContent'),
  hideReels: document.getElementById('hideReels'),
  hideMarketplace: document.getElementById('hideMarketplace'),
  hideAISlop: document.getElementById('hideAISlop'),
  friendsOnlyFeed: document.getElementById('friendsOnlyFeed'),
  chronologicalFeed: document.getElementById('chronologicalFeed'),
  showHiddenPlaceholders: document.getElementById('showHiddenPlaceholders'),
  
  // Facebook settings
  fbHideSponsored: document.getElementById('fb-hideSponsored'),
  fbHideSuggestedPosts: document.getElementById('fb-hideSuggestedPosts'),
  fbHideSuggestedPages: document.getElementById('fb-hideSuggestedPages'),
  fbHideSuggestedGroups: document.getElementById('fb-hideSuggestedGroups'),
  fbHideReels: document.getElementById('fb-hideReels'),
  fbHideStories: document.getElementById('fb-hideStories'),
  fbHideMarketplace: document.getElementById('fb-hideMarketplace'),
  fbHidePeopleYouMayKnow: document.getElementById('fb-hidePeopleYouMayKnow'),
  fbHideTrending: document.getElementById('fb-hideTrending'),
  fbHideWatch: document.getElementById('fb-hideWatch'),
  
  // Keywords
  keywordInput: document.getElementById('keywordInput'),
  addKeywordButton: document.getElementById('addKeyword'),
  keywordList: document.getElementById('keywordList'),
  
  // Actions
  saveButton: document.getElementById('saveButton'),
  exportButton: document.getElementById('exportSettings'),
  importButton: document.getElementById('importSettings'),
  resetButton: document.getElementById('resetSettings'),
  importFile: document.getElementById('importFile'),
  
  // Status
  status: document.getElementById('status')
};

// Current settings
let currentSettings = null;

// Default settings
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

// Load settings from storage
async function loadSettings() {
  const result = await browser.storage.sync.get('settings');
  currentSettings = result.settings || getDefaultSettings();
  
  // Update UI
  updateUI();
}

// Update UI with current settings
function updateUI() {
  // General settings
  elements.hideAds.checked = currentSettings.hideAds;
  elements.hideSuggestedContent.checked = currentSettings.hideSuggestedContent;
  elements.hideReels.checked = currentSettings.hideReels;
  elements.hideMarketplace.checked = currentSettings.hideMarketplace;
  elements.hideAISlop.checked = currentSettings.hideAISlop;
  elements.friendsOnlyFeed.checked = currentSettings.friendsOnlyFeed;
  elements.chronologicalFeed.checked = currentSettings.chronologicalFeed;
  elements.showHiddenPlaceholders.checked = !!currentSettings.showHiddenPlaceholders;
  
  // Facebook settings
  const fb = currentSettings.providers.facebook;
  elements.fbHideSponsored.checked = fb.hideSponsored;
  elements.fbHideSuggestedPosts.checked = fb.hideSuggestedPosts;
  elements.fbHideSuggestedPages.checked = fb.hideSuggestedPages;
  elements.fbHideSuggestedGroups.checked = fb.hideSuggestedGroups;
  elements.fbHideReels.checked = fb.hideReels;
  elements.fbHideStories.checked = fb.hideStories;
  elements.fbHideMarketplace.checked = fb.hideMarketplace;
  elements.fbHidePeopleYouMayKnow.checked = fb.hidePeopleYouMayKnow;
  elements.fbHideTrending.checked = fb.hideTrending;
  elements.fbHideWatch.checked = fb.hideWatch;
  
  // Theme
  document.querySelector(`input[name="theme"][value="${currentSettings.theme}"]`).checked = true;
  
  // Keywords
  renderKeywords();
}

// Render keyword list
function renderKeywords() {
  elements.keywordList.innerHTML = '';
  
  currentSettings.keywordBlacklist.forEach(keyword => {
    const tag = document.createElement('div');
    tag.className = 'keyword-tag';
    
    const text = document.createElement('span');
    text.textContent = keyword;
    
    const removeBtn = document.createElement('button');
    removeBtn.textContent = '×';
    removeBtn.addEventListener('click', () => removeKeyword(keyword));
    
    tag.appendChild(text);
    tag.appendChild(removeBtn);
    elements.keywordList.appendChild(tag);
  });
}

// Add keyword
function addKeyword() {
  const keyword = elements.keywordInput.value.trim();
  
  if (keyword && !currentSettings.keywordBlacklist.includes(keyword)) {
    currentSettings.keywordBlacklist.push(keyword);
    elements.keywordInput.value = '';
    renderKeywords();
    saveSettings();
  }
}

// Remove keyword
function removeKeyword(keyword) {
  currentSettings.keywordBlacklist = currentSettings.keywordBlacklist.filter(k => k !== keyword);
  renderKeywords();
  saveSettings();
}

// Save settings
async function saveSettings() {
  // Update settings from UI
  currentSettings.hideAds = elements.hideAds.checked;
  currentSettings.hideSuggestedContent = elements.hideSuggestedContent.checked;
  currentSettings.hideReels = elements.hideReels.checked;
  currentSettings.hideMarketplace = elements.hideMarketplace.checked;
  currentSettings.hideAISlop = elements.hideAISlop.checked;
  currentSettings.friendsOnlyFeed = elements.friendsOnlyFeed.checked;
  currentSettings.chronologicalFeed = elements.chronologicalFeed.checked;
  currentSettings.showHiddenPlaceholders = elements.showHiddenPlaceholders.checked;
  
  // Facebook settings
  currentSettings.providers.facebook.hideSponsored = elements.fbHideSponsored.checked;
  currentSettings.providers.facebook.hideSuggestedPosts = elements.fbHideSuggestedPosts.checked;
  currentSettings.providers.facebook.hideSuggestedPages = elements.fbHideSuggestedPages.checked;
  currentSettings.providers.facebook.hideSuggestedGroups = elements.fbHideSuggestedGroups.checked;
  currentSettings.providers.facebook.hideReels = elements.fbHideReels.checked;
  currentSettings.providers.facebook.hideStories = elements.fbHideStories.checked;
  currentSettings.providers.facebook.hideMarketplace = elements.fbHideMarketplace.checked;
  currentSettings.providers.facebook.hidePeopleYouMayKnow = elements.fbHidePeopleYouMayKnow.checked;
  currentSettings.providers.facebook.hideTrending = elements.fbHideTrending.checked;
  currentSettings.providers.facebook.hideWatch = elements.fbHideWatch.checked;
  
  // Theme
  const selectedTheme = document.querySelector('input[name="theme"]:checked');
  if (selectedTheme) {
    currentSettings.theme = selectedTheme.value;
  }
  
  // Save to storage
  await browser.storage.sync.set({ settings: currentSettings });
  
  // Show status
  showStatus('All settings saved!', 'success');
}

// Export settings
function exportSettings() {
  const dataStr = JSON.stringify(currentSettings, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'clearbook-settings.json';
  link.click();
  
  URL.revokeObjectURL(url);
  showStatus('Settings exported!', 'success');
}

// Import settings
function importSettings() {
  elements.importFile.click();
}

// Handle file import
elements.importFile.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = async (event) => {
    try {
      const importedSettings = JSON.parse(event.target.result);
      currentSettings = importedSettings;
      await browser.storage.sync.set({ settings: currentSettings });
      updateUI();
      showStatus('Settings imported successfully!', 'success');
    } catch (error) {
      showStatus('Error importing settings!', 'error');
    }
  };
  reader.readAsText(file);
  
  // Reset file input
  elements.importFile.value = '';
});

// Reset settings
async function resetSettings() {
  if (confirm('Are you sure you want to reset all settings to defaults?')) {
    currentSettings = getDefaultSettings();
    await browser.storage.sync.set({ settings: currentSettings });
    updateUI();
    showStatus('Settings reset to defaults!', 'success');
  }
}

// Show status message
function showStatus(message, type = 'success') {
  elements.status.textContent = message;
  elements.status.className = type;
  
  setTimeout(() => {
    elements.status.textContent = 'All changes saved';
    elements.status.className = '';
  }, 3000);
}

// Event listeners
elements.saveButton.addEventListener('click', saveSettings);
elements.addKeywordButton.addEventListener('click', addKeyword);
elements.keywordInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addKeyword();
});
elements.exportButton.addEventListener('click', exportSettings);
elements.importButton.addEventListener('click', importSettings);
elements.resetButton.addEventListener('click', resetSettings);

// Auto-save on change
const autoSaveElements = [
  elements.hideAds,
  elements.hideSuggestedContent,
  elements.hideReels,
  elements.hideMarketplace,
  elements.hideAISlop,
  elements.friendsOnlyFeed,
  elements.chronologicalFeed,
  elements.showHiddenPlaceholders,
  elements.fbHideSponsored,
  elements.fbHideSuggestedPosts,
  elements.fbHideSuggestedPages,
  elements.fbHideSuggestedGroups,
  elements.fbHideReels,
  elements.fbHideStories,
  elements.fbHideMarketplace,
  elements.fbHidePeopleYouMayKnow,
  elements.fbHideTrending,
  elements.fbHideWatch
];

autoSaveElements.forEach(element => {
  element.addEventListener('change', saveSettings);
});

// Theme radio buttons
document.querySelectorAll('input[name="theme"]').forEach(radio => {
  radio.addEventListener('change', saveSettings);
});

// Initialize
loadSettings();
