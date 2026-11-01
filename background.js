// Background script for Clearbook
// Handles web request blocking and extension lifecycle

console.log('Clearbook: Background script loaded');

// Initialize default settings on install
browser.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    console.log('Clearbook: First install, setting defaults');
    
    // Set default settings
    await browser.storage.sync.set({
      settings: {
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
          reddit: {
            enabled: false
          },
          twitter: {
            enabled: false
          }
        }
      }
    });

    // Open options page on first install
    browser.runtime.openOptionsPage();
  }
});

// Block ad requests at the network level
const adUrlPatterns = [
  '*://www.facebook.com/ads/*',
  '*://www.facebook.com/tr*',
  '*://connect.facebook.net/*/fbevents.js*',
  '*://www.facebook.com/ajax/bz*',
  '*://*.doubleclick.net/*',
  '*://*.googlesyndication.com/*',
  '*://*.google-analytics.com/*',
];

// Set to false to turn off network-level blocking (e.g. to measure whether
// blocked requests make Facebook retry and do extra work).
const BLOCK_REQUESTS = true;

// Request blocking
if (BLOCK_REQUESTS) browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    return { cancel: true };
  },
  {
    urls: adUrlPatterns,
    types: ['script', 'image', 'stylesheet', 'xmlhttprequest']
  },
  ['blocking']
);

// Listen for messages from content scripts
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_SETTINGS') {
    browser.storage.sync.get('settings', (result) => {
      sendResponse(result.settings);
    });
    return true; // Indicates async response
  }
  
  if (message.type === 'SAVE_SETTINGS') {
    browser.storage.sync.set({ settings: message.settings }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});

// Badge to show extension is active
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    const url = tab.url || '';
    
    if (url.includes('facebook.com') || 
        url.includes('reddit.com') || 
        url.includes('twitter.com') || 
        url.includes('x.com')) {
      
      browser.browserAction.setBadgeText({ 
        text: '✓', 
        tabId: tabId 
      });
      
      browser.browserAction.setBadgeBackgroundColor({ 
        color: '#4CAF50', 
        tabId: tabId 
      });
    }
  }
});

console.log('Clearbook: Background script initialized');
