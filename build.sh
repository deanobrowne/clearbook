#!/bin/bash
# Build script for Clearbook extension

set -e

echo "🔨 Building Clearbook extension..."

# Clean previous builds
rm -f clearbook.xpi
rm -f clearbook.zip

# Create XPI (Firefox extension package)
echo "📦 Creating XPI package..."
zip -r clearbook.xpi \
  manifest.json \
  background.js \
  icons/ \
  popup/ \
  options/ \
  content/ \
  utils/ \
  -x "*.DS_Store" "*/.git/*" "*.swp"

# Also create a regular zip for distribution
echo "📦 Creating ZIP package..."
cp clearbook.xpi clearbook.zip

echo "✅ Build complete!"
echo ""
echo "Files created:"
echo "  - clearbook.xpi (for Firefox installation)"
echo "  - clearbook.zip (for distribution)"
echo ""
echo "To install:"
echo "  1. Open Firefox"
echo "  2. Go to about:debugging"
echo "  3. Click 'This Firefox'"
echo "  4. Click 'Load Temporary Add-on'"
echo "  5. Select manifest.json from this directory"
echo ""
echo "Or for permanent install (Firefox Dev Edition):"
echo "  1. Go to about:addons"
echo "  2. Click gear icon → 'Install Add-on From File'"
echo "  3. Select clearbook.xpi"
