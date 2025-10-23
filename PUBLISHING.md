# Publishing Guide

This document explains how to publish `derp` to npm and Homebrew, both automatically via GitHub Actions and manually.

## Table of Contents
- [Automated Publishing (Recommended)](#automated-publishing-recommended)
- [Manual Publishing](#manual-publishing)
- [Initial Setup](#initial-setup)

---

## Automated Publishing (Recommended)

The project is configured with GitHub Actions to automatically publish to both npm and Homebrew when you create a new tag.

### How It Works

When you push a tag (e.g., `v0.1.2`), the workflow automatically:

1. Runs tests and linting
2. Publishes the package to npm (without large binaries)
3. Builds platform-specific binaries (macOS, Linux)
4. Creates a GitHub Release with the binaries
5. Updates the Homebrew formula with new checksums
6. Commits and pushes the updated Homebrew formula

### Publishing a New Version

```bash
# 1. Update version in package.json
npm version patch  # or minor, or major

# 2. Push the tag to GitHub (this triggers the workflow)
git push origin main --tags

# 3. Monitor the workflow
# Visit: https://github.com/syrex1013/derp/actions
```

That's it! The GitHub Action will handle the rest.

---

## Initial Setup

### 1. Create npm Access Token

You need to create an npm access token with automation permissions:

1. Log in to [npmjs.com](https://www.npmjs.com)
2. Click your profile icon → "Access Tokens"
3. Click "Generate New Token" → "Automation"
4. Copy the token (you won't see it again!)

### 2. Add npm Token to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `NPM_TOKEN`
5. Value: Paste your npm token
6. Click **Add secret**

### 3. Enable Workflow Permissions

Ensure GitHub Actions has write permissions:

1. Go to **Settings** → **Actions** → **General**
2. Scroll to **Workflow permissions**
3. Select **Read and write permissions**
4. Check **Allow GitHub Actions to create and approve pull requests**
5. Click **Save**

### 4. Set Up 2FA for npm (If Required)

If your npm account has 2FA enabled:

**Option A: Use Automation Token (Recommended)**
- Automation tokens bypass 2FA requirements
- Follow steps in "Create npm Access Token" above

**Option B: Disable 2FA**
- Not recommended for security reasons
- Only do this if you understand the security implications

---

## Manual Publishing

If you need to publish manually (e.g., for testing):

### Prerequisites

```bash
# Ensure you're logged into npm
npm whoami

# If not logged in:
npm login
```

### Publishing to npm

```bash
# 1. Clean and build
npm run build

# 2. Test the package locally
npm pack
# This creates derp-0.1.1.tgz - inspect to ensure it's correct

# 3. Publish to npm
npm publish --access public

# If you have 2FA enabled, you'll need an OTP:
npm publish --access public --otp=123456
```

### Creating GitHub Release with Binaries

```bash
# 1. Build binaries
npm run build:binaries

# 2. Calculate checksums
shasum -a 256 dist/bin/derp-macos
shasum -a 256 dist/bin/derp-linux

# 3. Create and push a tag
git tag v0.1.2
git push origin v0.1.2

# 4. Create GitHub release using gh CLI
gh release create v0.1.2 \
  dist/bin/derp-macos \
  dist/bin/derp-linux \
  --title "v0.1.2" \
  --generate-notes
```

### Updating Homebrew Formula

After creating a GitHub release, update `derp.rb`:

```bash
# 1. Update version
sed -i '' 's/version ".*"/version "0.1.2"/' derp.rb

# 2. Update URLs (they should already use #{version})

# 3. Update SHA256 checksums with values from step 2 above
sed -i '' 's/sha256 ".*" # macos/sha256 "NEW_MACOS_SHA256" # macos/' derp.rb
sed -i '' 's/sha256 ".*" # linux/sha256 "NEW_LINUX_SHA256" # linux/' derp.rb

# 4. Commit and push
git add derp.rb
git commit -m "Update Homebrew formula to v0.1.2"
git push origin main
```

---

## Package Size Optimization

The `.npmignore` file ensures that large binaries are excluded from the npm package:

- npm package: ~1-2 MB (JavaScript code only)
- GitHub binaries: ~120-130 MB each (standalone executables)

Users can install via:
- **npm**: Small package, requires Node.js runtime
- **Homebrew**: Downloads pre-built binary, no Node.js required

---

## Troubleshooting

### npm publish fails with "EOTP"
You need a one-time password from your authenticator app:
```bash
npm publish --access public --otp=123456
```

### npm publish fails with "ENEEDAUTH"
You're not logged in:
```bash
npm login
```

### GitHub Actions workflow fails
1. Check that `NPM_TOKEN` secret is set correctly
2. Ensure workflow has write permissions
3. Check the Actions logs for specific errors

### Homebrew formula has wrong checksums
Recalculate them:
```bash
shasum -a 256 dist/bin/derp-macos
shasum -a 256 dist/bin/derp-linux
```

---

## Version Numbering

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.2.0): New features, backward compatible
- **PATCH** (0.1.2): Bug fixes

Use npm version commands:
```bash
npm version patch  # 0.1.1 → 0.1.2
npm version minor  # 0.1.2 → 0.2.0
npm version major  # 0.2.0 → 1.0.0
```

---

## Resources

- [npm Documentation](https://docs.npmjs.com/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Homebrew Formula Cookbook](https://docs.brew.sh/Formula-Cookbook)
- [Semantic Versioning](https://semver.org/)
