# Contributing to Clearbook

Thank you for your interest in contributing to Clearbook! This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Adding New Providers](#adding-new-providers)

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Prioritize user privacy and experience

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/clearbook.git
   cd clearbook
   ```
3. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/my-new-feature
   ```

## Development Setup

### Prerequisites

- Firefox Browser (latest version)
- Basic knowledge of JavaScript, HTML, CSS
- Text editor or IDE (VS Code recommended)

### Loading the Extension

1. Open Firefox
2. Navigate to `about:debugging`
3. Click "This Firefox"
4. Click "Load Temporary Add-on"
5. Select `manifest.json` from the clearbook directory

### Development Workflow

1. Make changes to the code
2. In `about:debugging`, click "Reload" next to Clearbook
3. Refresh Facebook or the relevant social network
4. Check browser console (F12) for errors
5. Test your changes thoroughly

## Project Structure

```
clearbook/
├── manifest.json           # Extension configuration
├── background.js           # Background script (network blocking)
│
├── utils/                  # Shared utilities
│   ├── constants.js        # Default settings & constants
│   └── storage.js          # Settings storage helpers
│
├── content/                # Content scripts (run on pages)
│   ├── content.js          # Main content coordinator
│   ├── themes.css          # Theme styles
│   └── providers/          # Platform-specific cleaning logic
│       ├── facebook.js     # Facebook provider (active)
│       ├── reddit.js       # Reddit provider (planned)
│       └── twitter.js      # Twitter/X provider (planned)
│
├── popup/                  # Extension popup UI
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
│
├── options/                # Settings page UI
│   ├── options.html
│   ├── options.css
│   └── options.js
│
└── icons/                  # Extension icons
    ├── icon-48.png
    └── icon-96.png
```

## Making Changes

### Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### Adding Features

1. **Plan your change** - Open an issue first to discuss
2. **Update relevant files**:
   - Settings? → `utils/constants.js`, `popup.html`, `options.html`
   - Filtering? → `content/providers/[platform].js`
   - UI? → `popup/` or `options/`
   - Themes? → `content/themes.css`
3. **Test thoroughly** on Facebook
4. **Update documentation** (README.md, etc.)

### Fixing Bugs

1. **Reproduce the bug** consistently
2. **Identify the root cause** (use browser console)
3. **Make minimal changes** to fix the issue
4. **Test the fix** extensively
5. **Add comments** explaining the fix if needed

## Testing

### Manual Testing Checklist

Before submitting changes, test:

- [ ] Extension loads without errors
- [ ] All settings can be toggled
- [ ] Settings persist after refresh
- [ ] Facebook ads are hidden
- [ ] Suggested content is hidden
- [ ] Themes work correctly
- [ ] Keyword blacklist works
- [ ] No console errors
- [ ] Performance is good (no lag)
- [ ] Works on different Facebook pages (feed, groups, pages)

### Testing on Facebook

Test these Facebook pages:
1. Home feed (main news feed)
2. A friend's profile
3. A group you're in
4. A page you follow
5. Marketplace (if not fully hidden)
6. Watch (if not fully hidden)

### Browser Console

Always check for:
- Errors (red messages)
- Warnings (yellow messages)
- Clearbook debug messages

## Submitting Changes

### Commit Messages

Use clear, descriptive commit messages:

```bash
# Good
git commit -m "Add support for hiding Facebook Stories"
git commit -m "Fix theme not applying on first load"
git commit -m "Improve performance of mutation observer"

# Bad
git commit -m "fix bug"
git commit -m "updates"
git commit -m "changes"
```

### Pull Request Process

1. **Push your changes** to your fork:
   ```bash
   git push origin feature/my-new-feature
   ```

2. **Open a Pull Request** on GitHub

3. **Describe your changes**:
   - What does this PR do?
   - Why is it needed?
   - How did you test it?
   - Screenshots (if UI change)

4. **Wait for review** - Be patient and responsive to feedback

5. **Make requested changes** if needed

6. **Celebrate!** 🎉 Your contribution helps everyone

## Adding New Providers

Want to add support for Reddit, Twitter, or another platform? Here's how:

### Step 1: Create Provider File

Create `content/providers/[platform].js`:

```javascript
const PlatformProvider = {
  name: 'platform',
  
  // Selectors for content to remove
  selectors: {
    ads: ['selector1', 'selector2'],
    suggested: ['selector3'],
    // ... more
  },

  // Initialize the provider
  async init(settings) {
    this.settings = settings;
    this.startObserving();
    this.cleanFeed();
  },

  // Start watching for new content
  startObserving() {
    this.observer = new MutationObserver(() => {
      this.cleanFeed();
    });
    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  },

  // Clean the feed
  cleanFeed() {
    // Your cleaning logic here
    this.removeElements(this.selectors.ads);
    this.removeElements(this.selectors.suggested);
  },

  // Remove elements helper
  removeElements(selectors) {
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.style.display = 'none';
        el.setAttribute('data-clearbook-hidden', 'true');
      });
    });
  },

  // Update settings
  async updateSettings(newSettings) {
    this.settings = newSettings;
    this.cleanFeed();
  }
};
```

### Step 2: Update Manifest

Add to `manifest.json`:

```json
{
  "matches": ["*://*.platform.com/*"],
  "js": [
    "utils/constants.js",
    "utils/storage.js",
    "content/providers/platform.js",
    "content/content.js"
  ]
}
```

### Step 3: Add to Constants

Update `utils/constants.js`:

```javascript
PROVIDERS.platform = {
  name: 'Platform Name',
  domains: ['platform.com'],
  scriptPath: 'content/providers/platform.js'
};

DEFAULT_SETTINGS.providers.platform = {
  enabled: true,
  // ... platform-specific settings
};
```

### Step 4: Update UI

Add platform-specific settings to `options.html` and `options.js`.

### Step 5: Test & Document

- Test thoroughly on the platform
- Update README.md
- Add screenshots if possible
- Open a PR!

## Tips for Contributors

### Finding Selectors

Use Firefox Developer Tools:
1. Right-click an ad or suggested post
2. Click "Inspect Element"
3. Look for unique attributes:
   - `data-*` attributes
   - Specific class names
   - Text content patterns
4. Test selector in console: `document.querySelectorAll('your-selector')`

### Debugging Content Scripts

```javascript
// Add debug logging
console.log('Clearbook: Removed', count, 'ads');

// Check if elements exist
const elements = document.querySelectorAll('.ad');
console.log('Found', elements.length, 'ad elements');

// Log settings
console.log('Current settings:', this.settings);
```

### Performance Tips

- Use `MutationObserver` efficiently (throttle if needed)
- Cache selectors when possible
- Avoid expensive operations in loops
- Use CSS hiding (`display: none`) instead of removing elements
- Test performance with browser profiler

## Questions?

- Open an issue for questions
- Join discussions on GitHub
- Check existing issues and PRs first

## Recognition

Contributors will be:
- Listed in README.md
- Mentioned in release notes
- Part of making the web better! ✨

---

Thank you for contributing to Clearbook! 🙏
