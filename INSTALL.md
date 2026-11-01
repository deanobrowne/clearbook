# Installation Guide

## Installing Clearbook in Firefox

### Method 1: Temporary Installation (Development/Testing)

This method is perfect for testing or development. The extension will be removed when you restart Firefox.

1. **Open Firefox Developer Tools**
   - Type `about:debugging` in the address bar and press Enter
   - Or go to Menu → More Tools → Web Developer Tools → Settings → Enable "Enable browser chrome and add-on debugging toolboxes"

2. **Load the Extension**
   - Click on "This Firefox" in the left sidebar
   - Click the "Load Temporary Add-on..." button
   - Navigate to the `clearbook` folder
   - Select the `manifest.json` file
   - Click "Open"

3. **Verify Installation**
   - You should see "Clearbook" appear in the list
   - The extension icon should appear in your toolbar
   - A ✓ badge should appear when you visit Facebook

4. **Test It**
   - Go to facebook.com
   - You should see a "✨ Clearbook Active" indicator
   - Ads and suggested content should be hidden

### Method 2: Permanent Installation (Unsigned)

For permanent installation during development, you need to use Firefox Developer Edition or Firefox Nightly.

1. **Download Firefox Developer Edition**
   - Visit https://www.mozilla.org/firefox/developer/
   - Install Firefox Developer Edition

2. **Disable Signature Verification**
   - Type `about:config` in the address bar
   - Accept the warning
   - Search for `xpinstall.signatures.required`
   - Double-click to set it to `false`

3. **Package the Extension**
   ```bash
   cd clearbook
   zip -r ../clearbook.xpi *
   ```

4. **Install the XPI**
   - Type `about:addons` in Firefox Developer Edition
   - Click the gear icon ⚙️
   - Select "Install Add-on From File..."
   - Select the `clearbook.xpi` file

### Method 3: Firefox Add-ons Store (Coming Soon)

Once published to the official Firefox Add-ons store, you'll be able to:

1. Visit the Clearbook page on addons.mozilla.org
2. Click "Add to Firefox"
3. Confirm the installation
4. Done!

## First Time Setup

After installation:

1. **Click the Clearbook icon** in your toolbar
2. **Review the settings** - All recommended features are enabled by default
3. **Choose a theme** - Try "Minimal" for the cleanest experience
4. **Visit Facebook** - Reload the page to see changes
5. **Customize** - Click "⚙️ All Settings" for advanced options

## Updating the Extension

### Temporary Installation
- Simply click "Reload" next to Clearbook in `about:debugging`
- Changes will take effect immediately

### Permanent Installation
- Rebuild the XPI file with your changes
- Install the new version (it will replace the old one)

## Uninstalling

### Remove Temporary Add-on
- Go to `about:debugging`
- Click "Remove" next to Clearbook

### Remove Permanent Add-on
- Go to `about:addons`
- Find Clearbook
- Click the three dots (...)
- Select "Remove"

## Verification

To verify Clearbook is working:

1. **Visit Facebook** - You should see content being filtered
2. **Check the console** - Press F12, look for "Clearbook: Content script loaded"
3. **Test the popup** - Click the icon, toggle settings, refresh the page
4. **Check the badge** - A ✓ badge should appear on the icon when on Facebook

## Troubleshooting Installation

### "This add-on could not be installed"
- Make sure you selected `manifest.json`, not the folder
- Check that all files are present in the clearbook folder
- Look for JSON syntax errors in manifest.json

### Extension icon not showing
- Check if the icons were created properly in `icons/`
- Try reloading the extension
- Check browser console for errors

### Extension not working on Facebook
- Make sure you granted the necessary permissions
- Check if content scripts are loading (F12 → Console)
- Try refreshing the page
- Verify the extension is enabled in `about:addons`

### Settings not saving
- Check browser console for storage errors
- Make sure Firefox sync is working
- Try exporting/importing settings as a backup

## Development Setup

If you're developing Clearbook:

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd clearbook
   ```

2. **Install as temporary add-on** (see Method 1 above)

3. **Make changes** to the code

4. **Reload the extension** in `about:debugging`

5. **Test on Facebook** - Refresh the page to see changes

6. **Check the console** for errors:
   - Browser console (Ctrl+Shift+J) for background script
   - Page console (F12) for content scripts

## Testing Checklist

- [ ] Extension loads without errors
- [ ] Icon appears in toolbar
- [ ] Popup opens and shows settings
- [ ] Settings page opens from popup
- [ ] Changes to settings are saved
- [ ] Facebook page loads normally
- [ ] Ads are hidden
- [ ] Suggested content is hidden
- [ ] Reels are hidden
- [ ] Theme can be changed
- [ ] Keywords can be added/removed
- [ ] Extension badge shows ✓ on Facebook
- [ ] Refresh button in popup works
- [ ] Export/import settings works

## Browser Compatibility

- ✅ **Firefox** - Fully supported (v60+)
- ⚠️ **Chrome** - Not compatible (uses Firefox-specific APIs)
- ⚠️ **Safari** - Not compatible
- ⚠️ **Edge** - Not compatible

### Porting to Chrome

To port to Chrome, you'll need to:
1. Update manifest to v3
2. Replace `browser.*` with `chrome.*`
3. Adjust permissions format
4. Update storage API usage
5. Test thoroughly

## Getting Help

If you're having trouble installing:

1. Check this guide carefully
2. Look for error messages in the console
3. Open an issue on GitHub with:
   - Firefox version
   - Error messages
   - Screenshots
   - Steps you've tried

---

**Happy cleaning! ✨**
