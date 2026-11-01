# ✨ Clearbook

**Transform social networks into minimal, distraction-free feeds**

Clearbook is a Firefox extension that removes algorithmic clutter from social media platforms, bringing back the simplicity of early 2000s social networks. Currently supports Facebook, with Reddit and X (Twitter) coming soon.

## Features

### 🎯 Content Filtering

**Remove unwanted content:**
- ❌ Sponsored posts and advertisements
- ❌ Suggested posts ("You may also like")
- ❌ Suggested pages and groups
- ❌ Reels and short videos
- ❌ Marketplace recommendations
- ❌ "People You May Know"
- ❌ Trending content
- ❌ AI-generated content (where detectable)
- ❌ Watch/Video recommendations

**Show only what matters:**
- ✅ Friends' posts
- ✅ Followed page posts
- ✅ Joined group posts

### 🎨 Themes

Choose from four beautiful themes:

1. **Classic Facebook** - Original Facebook look and feel
2. **Minimal** - Clean, modern, distraction-free design
3. **Dark** - Easy on the eyes with dark mode
4. **Hacker News** - Orange accent, inspired by HN's minimal aesthetic

### ⚙️ Advanced Controls

- **Keyword Blacklist** - Hide posts containing specific words or phrases
- **Friends Only Feed** - Aggressively filter to show only friend content
- **Chronological Feed** - See newest posts first (when possible)
- **Per-Platform Settings** - Fine-tune behavior for each social network

## Installation

### From Source (Development)

1. Clone or download this repository
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox" in the left sidebar
4. Click "Load Temporary Add-on"
5. Navigate to the `clearbook` folder and select `manifest.json`

### From Firefox Add-ons (Coming Soon)

Once published, you'll be able to install directly from the Firefox Add-ons store.

## Usage

### Quick Start

1. **Install the extension** - See installation instructions above
2. **Click the Clearbook icon** in your toolbar
3. **Toggle features** on or off with simple checkboxes
4. **Refresh Facebook** to see the changes

### Settings Panel

Access advanced settings by:
- Clicking "⚙️ All Settings" in the popup, or
- Right-click the extension icon → "Manage Extension" → "Options"

### Keyboard Shortcuts

You can set custom keyboard shortcuts in Firefox:
1. Navigate to `about:addons`
2. Click the gear icon ⚙️
3. Select "Manage Extension Shortcuts"
4. Set a shortcut for Clearbook

## Architecture

Clearbook uses a **provider-based architecture** for easy extensibility:

```
clearbook/
├── manifest.json           # Extension configuration
├── background.js           # Network-level ad blocking
├── utils/                  # Shared utilities
│   ├── constants.js        # Default settings
│   └── storage.js          # Settings management
├── content/                # Content scripts
│   ├── content.js          # Main coordinator
│   ├── themes.css          # Theme styles
│   └── providers/          # Platform-specific logic
│       ├── facebook.js     # ✅ Facebook cleaning
│       ├── reddit.js       # 🚧 Coming soon
│       └── twitter.js      # 🚧 Coming soon
├── popup/                  # Quick settings popup
└── options/                # Full settings page
```

### Adding New Providers

To add support for a new social network:

1. Create a new file in `content/providers/[platform].js`
2. Implement the provider interface:
   ```javascript
   const PlatformProvider = {
     name: 'platform',
     async init(settings) { /* Setup */ },
     cleanFeed() { /* Clean content */ },
     async updateSettings(newSettings) { /* Update */ }
   };
   ```
3. Add the provider to `manifest.json` content_scripts
4. Update `PROVIDERS` in `utils/constants.js`

## How It Works

### Content Filtering

Clearbook uses multiple strategies to identify and remove unwanted content:

1. **DOM Selectors** - Targets known Facebook element structures
2. **Text Analysis** - Detects "Sponsored", "Suggested for you", etc.
3. **Pattern Matching** - Identifies ad-like patterns
4. **MutationObserver** - Watches for new content dynamically
5. **Network Blocking** - Blocks ad requests at the network level

### Theme System

Themes use CSS custom properties and data attributes:
- Extension sets `data-clearbook-theme="[theme]"` on `<html>`
- Theme-specific CSS rules are applied
- Changes take effect immediately

### Settings Sync

Settings are stored using Firefox's `browser.storage.sync` API:
- Syncs across devices (if logged into Firefox)
- Changes propagate instantly to all open tabs
- Supports export/import for backups

## Privacy

Clearbook is **100% privacy-focused**:

- ✅ **No data collection** - We don't collect any data
- ✅ **No analytics** - No tracking or telemetry
- ✅ **No external requests** - All processing happens locally
- ✅ **Open source** - Fully auditable code
- ✅ **No account required** - Works immediately

The extension only:
- Reads page content to identify and hide elements
- Stores your settings locally (never sent anywhere)
- Blocks known advertising domains

## Permissions Explained

Clearbook requires these permissions:

- **`storage`** - Save your settings
- **`webRequest`** - Block ad network requests
- **`webRequestBlocking`** - Required for request blocking
- **`*://*.facebook.com/*`** - Access Facebook pages (only when you visit them)
- **`*://*.reddit.com/*`** - For future Reddit support
- **`*://*.twitter.com/*`** - For future Twitter/X support
- **`*://*.x.com/*`** - For future X support

## Troubleshooting

### Extension not working?

1. **Refresh the page** - Use the 🔄 button in the popup
2. **Check if enabled** - Make sure toggles are on
3. **Clear cache** - Sometimes cached content appears
4. **Reload extension** - In `about:debugging`, click "Reload"

### Some content still showing?

Facebook frequently updates their markup. If you see content that should be hidden:

1. Open an issue on GitHub with a screenshot
2. Include the text/label on the content
3. We'll update the selectors in the next release

### Theme not applying?

- Make sure you've selected a theme in settings
- Try refreshing the page
- Check browser console for errors (F12 → Console)

## Roadmap

### v1.1 - Reddit Support
- [ ] Hide promoted posts
- [ ] Hide recommended communities
- [ ] Filter subreddit content
- [ ] Apply themes to Reddit

### v1.2 - X (Twitter) Support
- [ ] Hide promoted tweets
- [ ] Hide "Who to follow"
- [ ] Hide recommended tweets
- [ ] Apply themes to X

### v1.3 - Instagram Support
- [ ] Hide suggested posts
- [ ] Hide ads
- [ ] Clean up Explore page

### v2.0 - Advanced Features
- [ ] Custom CSS injection
- [ ] Per-friend filters
- [ ] Time-based rules
- [ ] Statistics dashboard

## Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on Facebook
5. Submit a pull request

### Development Setup

```bash
# Clone the repo
git clone <repo-url>
cd clearbook

# Make your changes
# Test in Firefox (about:debugging)

# Lint (optional)
# Add ESLint config if desired
```

## License

MIT License - See LICENSE file for details

## Credits

Created with ❤️ for a better, more intentional social media experience.

Inspired by the simplicity of early social networks and tools like:
- News Feed Eradicator
- FB Purity
- uBlock Origin

## Support

- **Issues**: Report bugs on GitHub Issues
- **Questions**: Open a discussion on GitHub
- **Feature Requests**: We'd love to hear your ideas!

---

**Remember**: Social media should serve you, not the other way around. Take back your attention! ✨
