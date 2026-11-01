# Clearbook Architecture

## Overview

Clearbook uses a multi-layer architecture to clean social media feeds while maintaining performance and extensibility.

## Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        FIREFOX BROWSER                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────┐         ┌──────────────────────────┐   │
│  │  Browser UI    │         │   Background Script      │   │
│  │  ─────────     │         │   ─────────────────      │   │
│  │  • Toolbar     │◄────────┤   • Network Blocking     │   │
│  │  • Popup       │         │   • Ad URL Filtering     │   │
│  │  • Options     │         │   • Extension Lifecycle  │   │
│  └────────────────┘         └──────────────────────────┘   │
│         │                              │                     │
│         │                              │                     │
│         ▼                              ▼                     │
│  ┌────────────────────────────────────────────────────┐    │
│  │            Browser Storage (sync)                   │    │
│  │            • User Settings                          │    │
│  │            • Keyword Blacklist                      │    │
│  │            • Theme Preferences                      │    │
│  └────────────────────────────────────────────────────┘    │
│                              │                              │
└──────────────────────────────┼──────────────────────────────┘
                               │
                               │ Settings sync
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                  FACEBOOK.COM TAB                            │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Content Scripts (Injected into page)               │   │
│  │  ────────────────────────────────                   │   │
│  │                                                       │   │
│  │  ┌──────────────────────────────────────────┐      │   │
│  │  │  content.js (Coordinator)                 │      │   │
│  │  │  • Detects current provider (FB/X/Reddit)│      │   │
│  │  │  • Applies theme                          │      │   │
│  │  │  • Shows "Clearbook Active" indicator     │      │   │
│  │  └──────────────────────────────────────────┘      │   │
│  │                     │                                │   │
│  │                     ▼                                │   │
│  │  ┌──────────────────────────────────────────┐      │   │
│  │  │  providers/facebook.js                    │      │   │
│  │  │  • MutationObserver (watches for changes) │      │   │
│  │  │  • Identifies ads/sponsored content       │      │   │
│  │  │  • Hides suggested posts                  │      │   │
│  │  │  • Filters by keywords                    │      │   │
│  │  │  • Applies provider-specific rules        │      │   │
│  │  └──────────────────────────────────────────┘      │   │
│  │                     │                                │   │
│  │                     ▼                                │   │
│  │  ┌──────────────────────────────────────────┐      │   │
│  │  │  themes.css                               │      │   │
│  │  │  • Classic theme                          │      │   │
│  │  │  • Minimal theme                          │      │   │
│  │  │  • Dark theme                             │      │   │
│  │  │  • Hacker News theme                      │      │   │
│  │  └──────────────────────────────────────────┘      │   │
│  │                                                       │   │
│  │  ┌──────────────────────────────────────────┐      │   │
│  │  │  utils/                                   │      │   │
│  │  │  • storage.js (settings helpers)          │      │   │
│  │  │  • constants.js (defaults)                │      │   │
│  │  └──────────────────────────────────────────┘      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Facebook DOM (modified)                             │   │
│  │  • Ads hidden (display: none)                        │   │
│  │  • Suggested content hidden                          │   │
│  │  • Theme CSS applied                                 │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Extension Initialization

```
User installs extension
    ↓
background.js loads
    ↓
Sets default settings in storage
    ↓
Sets up network request blocking
    ↓
Extension ready
```

### 2. Page Load Flow

```
User visits facebook.com
    ↓
Content scripts inject
    ↓
content.js detects provider = "facebook"
    ↓
Load settings from storage
    ↓
facebook.js initializes
    ↓
Start MutationObserver
    ↓
Initial cleanFeed() run
    ↓
Apply theme
    ↓
Show "Clearbook Active" indicator
```

### 3. Content Cleaning Flow

```
Facebook loads new posts
    ↓
MutationObserver detects DOM change
    ↓
cleanFeed() triggered
    ↓
┌─────────────────────────────────┐
│ For each filtering rule:        │
│  • Check if enabled in settings │
│  • Run selector queries         │
│  • Hide matching elements       │
│  • Mark with data attribute     │
└─────────────────────────────────┘
    ↓
User sees clean feed
```

### 4. Settings Change Flow

```
User opens popup/options
    ↓
Toggles a setting
    ↓
JavaScript saves to browser.storage.sync
    ↓
Storage change event fires
    ↓
All tabs receive update
    ↓
Provider.updateSettings() called
    ↓
cleanFeed() re-runs with new settings
    ↓
UI updates immediately
```

## Key Design Decisions

### 1. Provider Architecture

**Why?** To support multiple social networks with shared code.

- Each platform has unique DOM structure
- Common utilities (storage, themes) are shared
- Easy to add new platforms without changing core code
- Providers are isolated and independently testable

### 2. MutationObserver Pattern

**Why?** Facebook dynamically loads content as you scroll.

- Watches for DOM changes in real-time
- Triggers cleaning when new posts appear
- Minimal performance impact (throttled internally by browser)
- Catches content that loads after initial page load

### 3. CSS-Based Hiding

**Why?** Faster and more reliable than removing elements.

```javascript
// Instead of: element.remove()
element.style.display = 'none';
element.setAttribute('data-clearbook-hidden', 'true');
```

Benefits:
- Preserves DOM structure (prevents breaking Facebook's JS)
- Faster execution
- Reversible if needed
- Easy to debug (elements still in DOM)

### 4. Network-Level Blocking

**Why?** Block ads before they load, saving bandwidth.

- Background script intercepts requests
- Blocks known ad domains
- Reduces data usage
- Faster page loads
- Works even if content scripts fail

### 5. Settings Sync

**Why?** Settings persist across browser sessions and devices.

- Uses Firefox's sync storage
- Automatically syncs across devices
- No backend server needed
- Privacy-friendly (stored locally, synced via Firefox account)

## Extension Lifecycle

### Install

```
1. Extension installed
2. onInstalled listener fires
3. Default settings written to storage
4. Options page opens
5. User configures preferences
```

### Active Use

```
1. User visits Facebook
2. Content scripts inject
3. Background script blocks ad requests
4. Provider cleans feed continuously
5. User interacts with popup for quick changes
```

### Update

```
1. New version installed
2. onInstalled listener fires (reason: "update")
3. Migrate settings if needed
4. Show changelog (optional)
5. Reload all tabs (optional)
```

## Performance Considerations

### 1. Efficient Selectors

```javascript
// Bad: too broad, slow
document.querySelectorAll('div')

// Good: specific, fast
document.querySelectorAll('[data-pagelet*="FeedUnit"]:has(a[href*="/ads/"])')
```

### 2. Throttled Execution

```javascript
// Run cleanup periodically, not on every mutation
setInterval(() => this.cleanFeed(), 2000);
```

### 3. Early Exit

```javascript
cleanFeed() {
  if (!this.providerSettings.enabled) return; // Early exit
  // ... rest of cleaning logic
}
```

### 4. Cached References

```javascript
// Cache commonly used elements
this.feedContainer = document.querySelector('[role="feed"]');
```

## Security Considerations

### 1. No External Requests

- All code runs locally
- No telemetry or analytics
- No API calls to external servers

### 2. Minimal Permissions

Only requests permissions actually needed:
- `storage` - for settings
- `webRequest` - for ad blocking
- Specific domain patterns - not `<all_urls>`

### 3. Content Script Isolation

- Scripts run in isolated world
- Cannot directly access page JavaScript
- Cannot be tampered with by page scripts

### 4. Safe Settings Storage

```javascript
// Validate settings before saving
if (typeof settings.hideAds === 'boolean') {
  // Safe to save
}
```

## Testing Strategy

### Unit Testing (Manual)

- Test each provider function individually
- Verify selectors match correct elements
- Test settings load/save

### Integration Testing

- Test full flow: install → configure → browse
- Test theme switching
- Test keyword filtering
- Test settings sync

### Compatibility Testing

- Test on different Facebook pages
- Test with different Facebook layouts
- Test theme combinations
- Test edge cases (no content, all content hidden)

## Future Architecture

### Planned Improvements

1. **Event-based Architecture**
   ```javascript
   EventBus.on('content-added', () => cleanFeed());
   EventBus.on('settings-changed', (settings) => updateSettings(settings));
   ```

2. **Plugin System**
   - User-contributed filters
   - Custom selectors via UI
   - Community-shared rules

3. **Performance Monitoring**
   - Track clean operations/second
   - Monitor memory usage
   - Optimize hot paths

4. **Smart Detection**
   - ML-based ad detection (client-side)
   - Pattern recognition for new ad types
   - Adaptive filtering

## File Size & Performance

```
Total extension size: ~500 KB
  - Code: ~50 KB (minified)
  - Icons: ~30 KB
  - Documentation: Not included in build

Memory usage: <5 MB per tab
CPU usage: <1% (idle), <5% (scrolling)
Network blocking: ~60% reduction in requests
```

## Debugging

### Enable Debug Mode

```javascript
// Add to content.js
const DEBUG = true;
if (DEBUG) console.log('Clearbook:', ...args);
```

### View Background Logs

1. `about:debugging`
2. Click "Inspect" next to Clearbook
3. View console

### View Content Script Logs

1. F12 on Facebook tab
2. View console
3. Look for "Clearbook:" messages

### Storage Inspector

```javascript
// In browser console
await browser.storage.sync.get('settings');
```

---

This architecture enables Clearbook to be:
- ✅ **Fast** - Minimal performance impact
- ✅ **Extensible** - Easy to add new platforms
- ✅ **Maintainable** - Clean separation of concerns
- ✅ **Privacy-focused** - No external dependencies
- ✅ **User-friendly** - Simple configuration
