#!/bin/bash
set -e

echo "=== Derp Deployment Script ==="
echo ""

# Step 1: Push to GitHub
echo "Step 1: Pushing to GitHub..."
git push origin main

# Step 2: Create GitHub release
echo ""
echo "Step 2: Creating GitHub release..."
bash release.sh

# Step 3: Publish to npm
echo ""
echo "Step 3: Publishing to npm..."
echo "Run: npm login"
echo "Then: npm publish"

# Step 4: Homebrew instructions
echo ""
echo "Step 4: Homebrew publishing instructions:"
echo "1. Fork homebrew-core: https://github.com/Homebrew/homebrew-core"
echo "2. Calculate SHA256:"
echo "   shasum -a 256 dist/bin/derp-macos"
echo "   shasum -a 256 dist/bin/derp-linux"
echo "3. Update derp.rb with the SHA256 values"
echo "4. Copy derp.rb to homebrew-core/Formula/"
echo "5. Create PR to Homebrew"

echo ""
echo "=== Deployment complete! ==="
