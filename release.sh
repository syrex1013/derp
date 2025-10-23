#!/bin/bash
set -e

VERSION="0.1.0"

# Check for GitHub CLI
if ! command -v gh &> /dev/null; then
    echo "Error: GitHub CLI (gh) is not installed."
    echo "Please install it: brew install gh"
    exit 1
fi

echo "Creating GitHub release v${VERSION}..."

# Create release using GitHub CLI
gh release create "v${VERSION}" \
  --title "v${VERSION}" \
  --notes "Initial release of derp - natural language grep

## Features
- Natural language to regex conversion
- Multiple AI provider support (Ollama, OpenAI, OpenRouter, LM Studio, AWS Bedrock)
- Fast search powered by ripgrep or grep
- Beautiful colorized output
- Highly configurable
- Works offline with local models

## Installation

### npm
\`\`\`bash
npm install -g derp
\`\`\`

### Homebrew (Coming soon)
\`\`\`bash
brew tap syrex1013/derp
brew install derp
\`\`\`

### Binaries
Download the appropriate binary for your platform from the assets below.

## Quick Start
\`\`\`bash
# Initialize configuration
derp --init

# Start searching
derp \"email addresses\" -r .
\`\`\`" \
  dist/bin/derp-macos#derp-macos-x64 \
  dist/bin/derp-linux#derp-linux-x64

echo "Release complete!"
