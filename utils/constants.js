// Default settings for Clearbook
const DEFAULT_SETTINGS = {
  // Feature toggles
  hideAds: true,
  hideSuggestedContent: true,
  hideReels: true,
  hideMarketplace: true,
  hideAISlop: true,
  friendsOnlyFeed: false,
  chronologicalFeed: true,
  showHiddenPlaceholders: false, // show a labelled bar where posts were hidden
  
  // Theme
  theme: 'minimal', // 'classic', 'minimal', 'dark', 'hackernews'
  
  // Keyword blacklist
  keywordBlacklist: [],
  
  // Provider-specific settings
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
      enabled: false // Placeholder for future
    },
    twitter: {
      enabled: false // Placeholder for future
    }
  }
};

// Provider configurations
const PROVIDERS = {
  facebook: {
    name: 'Facebook',
    domains: ['facebook.com', 'www.facebook.com'],
    scriptPath: 'content/providers/facebook.js'
  },
  reddit: {
    name: 'Reddit',
    domains: ['reddit.com', 'www.reddit.com'],
    scriptPath: 'content/providers/reddit.js'
  },
  twitter: {
    name: 'X (Twitter)',
    domains: ['twitter.com', 'www.twitter.com', 'x.com', 'www.x.com'],
    scriptPath: 'content/providers/twitter.js'
  }
};

// Themes
const THEMES = {
  classic: 'Classic Facebook',
  minimal: 'Minimal',
  dark: 'Dark',
  hackernews: 'Hacker News'
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DEFAULT_SETTINGS, PROVIDERS, THEMES };
}
