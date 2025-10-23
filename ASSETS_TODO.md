# Visual Assets TODO

This file contains suggestions for creating the visual assets referenced in the README.

## 🎨 Logo Design Ideas

### Concept
Combine these elements:
- 🔍 Magnifying glass (search/grep)
- 🤖 Robot/AI brain (artificial intelligence)
- 💻 Terminal prompt (command line)

### Colors
- Primary: **#4A90E2** (blue - trust, technology)
- Secondary: **#50C878** (emerald green - growth, success)
- Accent: **#FF6B6B** (coral - energy, highlight)

### Specifications
- `logo.png`: 1200×1200px, transparent background
- `logo-small.png`: 120×120px, for badges
- `banner.png`: 1280×640px, for GitHub social preview

### Tools
- [Figma](https://figma.com) (free, web-based)
- [Canva](https://canva.com) (templates available)
- [DALL-E](https://openai.com/dall-e) or [Midjourney](https://midjourney.com) (AI generation)

## 🎬 Demo GIF Creation

### What to Show
1. Initialize configuration (`derp --init`)
2. Simple search: `derp "email addresses" -r .`
3. Show colorized output
4. Complex example: `derp "IP addresses" logs/`
5. Dry-run mode: `derp "TODO comments" --dry-run src/`

### Recommended Tools

#### Option 1: VHS (Recommended)
```bash
# Install VHS
brew install vhs

# Create tape file (demo.tape)
cat > demo.tape << 'EOF'
Output demo.gif
Set FontSize 16
Set Width 1200
Set Height 600
Set Theme "Dracula"

Type "derp --init"
Enter
Sleep 2s

Type "derp 'email addresses' -r ."
Enter
Sleep 3s

Type "derp 'IP addresses' logs/"
Enter
Sleep 2s
EOF

# Generate GIF
vhs demo.tape
```

#### Option 2: Asciinema + agg
```bash
# Record session
asciinema rec demo.cast

# Convert to GIF
agg demo.cast demo.gif
```

#### Option 3: Terminalizer
```bash
# Install
npm install -g terminalizer

# Record
terminalizer record demo

# Render
terminalizer render demo
```

### GIF Specifications
- **Size**: Max 5MB
- **Dimensions**: 800×600 or 1200×800
- **FPS**: 15-20 (smooth but small file size)
- **Duration**: 10-30 seconds
- **Format**: GIF or MP4

## 📸 Screenshots

Consider adding screenshots showing:

1. **Interactive setup**
   ```
   ? Select your AI provider: (Use arrow keys)
   ❯ ollama
     lmstudio
     openai
     openrouter
     bedrock
   ```

2. **Successful search with highlighted results**
   
3. **Dry-run mode output**

4. **Config display** (`derp --config`)

## 🎯 Banner Design

### Content
- Project name: "Derp"
- Tagline: "Transform natural language into powerful regex searches"
- Key features (3-4 icons)
- Terminal screenshot or mockup

### Layout Suggestion
```
┌─────────────────────────────────────────────────────┐
│  [Logo]  Derp                                  │
│          Transform natural language into regex      │
│                                                     │
│  🗣️ Natural Language  🤖 Multi-Provider  ⚡ Fast   │
│                                                     │
│  $ derp "email addresses" -r .                │
│  [Terminal preview with colorized output]           │
└─────────────────────────────────────────────────────┘
```

## 📋 Checklist

Once assets are created:

- [ ] Add `logo.png` to `assets/`
- [ ] Add `logo-small.png` to `assets/`
- [ ] Add `banner.png` to `assets/`
- [ ] Add `demo.gif` to `assets/`
- [ ] Update README to use actual asset paths (not placeholder URLs)
- [ ] Set GitHub repository social preview (Settings → Options → Social preview)
- [ ] Add logo to npm package (package.json `icon` field)

## 🔗 Resources

- **Color Palette**: [Coolors.co](https://coolors.co/)
- **Icons**: [Heroicons](https://heroicons.com/), [Feather Icons](https://feathericons.com/)
- **Fonts**: [Google Fonts](https://fonts.google.com/) - Try: Fira Code, JetBrains Mono
- **Mockups**: [MockUPhone](https://mockuphone.com/), [Screely](https://screely.com/)
- **GIF Optimization**: [Gifsicle](https://www.lcdf.org/gifsicle/), [ezgif.com](https://ezgif.com/)

---

**Note**: The README currently uses placeholder URLs. Once assets are created and pushed to the repository, update the URLs in README.md from:
```
https://raw.githubusercontent.com/yourusername/derp/main/assets/demo.gif
```
to your actual repository URL.
