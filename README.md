<div align="center">

# 🤖 Derp

<p align="center">
  <strong>Natural language grep for regex-challenged developers</strong>
</p>

<p align="center">
  Because <code>[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}</code> is too hard
</p>

<p align="center">
  <a href="https://github.com/yourusername/derp/actions/workflows/ci.yml">
    <img src="https://github.com/yourusername/derp/actions/workflows/ci.yml/badge.svg" alt="CI Status">
  </a>
  <a href="https://www.npmjs.com/package/derp">
    <img src="https://img.shields.io/npm/v/derp.svg" alt="npm version">
  </a>
  <a href="https://www.npmjs.com/package/derp">
    <img src="https://img.shields.io/npm/dm/derp.svg" alt="npm downloads">
  </a>
  <a href="https://github.com/yourusername/derp/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  </a>
  <a href="https://nodejs.org">
    <img src="https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg" alt="Node.js">
  </a>
  <a href="https://codecov.io/gh/yourusername/derp">
    <img src="https://codecov.io/gh/yourusername/derp/branch/main/graph/badge.svg" alt="Coverage">
  </a>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-usage">Usage</a> •
  <a href="#-providers">Providers</a> •
  <a href="#-contributing">Contributing</a>
</p>

<img src="https://raw.githubusercontent.com/yourusername/derp/main/assets/demo.gif" alt="Derp Demo" width="800">

</div>

---

## 🌟 Why Derp?

Because let's face it: you probably Googled "regex for email" at least three times this week. Derp uses AI to convert your plain English into those weird hieroglyphics called regex, so you can pretend you totally knew how to write `(?:[a-z0-9!#$%&'*+/=?^_\`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_\`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")` from memory.

```bash
# Instead of pretending you know this:
grep -E '\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b' -r .

# Just admit defeat and type this:
derp "email addresses" -r .
```

## ✨ Features

<table>
  <tr>
    <td align="center">🗣️<br><strong>Natural Language</strong><br>Use plain English instead of regex syntax</td>
    <td align="center">🤖<br><strong>Multi-Provider AI</strong><br>Ollama, OpenAI, Claude, and more</td>
    <td align="center">⚡<br><strong>Fast & Efficient</strong><br>Powered by ripgrep or grep</td>
  </tr>
  <tr>
    <td align="center">🎨<br><strong>Beautiful Output</strong><br>Colorized and easy to read</td>
    <td align="center">🔧<br><strong>Highly Configurable</strong><br>Customize to your workflow</td>
    <td align="center">🔒<br><strong>Privacy First</strong><br>Works offline with local models</td>
  </tr>
</table>

## 📦 Installation

### Via npm (Recommended)

```bash
npm install -g derp
```

### Via yarn

```bash
yarn global add derp
```

### From Source

```bash
git clone https://github.com/yourusername/derp.git
cd derp
npm install
npm run build
npm link
```

## 🚀 Quick Start

### 1️⃣ Initialize Configuration

```bash
derp --init
```

Choose your preferred AI provider and model.

### 2️⃣ Start Searching (Like a Pro, Sort Of)

```bash
# Find email addresses (without crying)
derp "email addresses" -r .

# Find TODO comments (procrastination tracker)
derp "TODO comments" src/

# Find IP addresses in logs (for when things go wrong)
derp "IP addresses" logs/*.log

# Find phone numbers (stalker mode activated)
derp "US phone numbers" contacts.txt
```

## 📖 Usage

### Basic Syntax

```bash
derp "<natural-language-query>" [grep-options] [paths...]
```

### Command Options

| Option | Description |
|--------|-------------|
| `--init` | Initialize or update configuration |
| `--config` | Display current configuration |
| `--dry-run` | Show generated command without executing |
| `--explain` | Show AI explanation of the regex |
| `--help` | Display help information |

### Real-World Examples

<details>
<summary><strong>📧 Finding Patterns</strong></summary>

```bash
# Email addresses
derp "email addresses" -r .

# URLs
derp "URLs starting with https" docs/

# Credit card numbers (with case-insensitive flag)
derp "credit card numbers" -i data/

# Dates in various formats
derp "dates in YYYY-MM-DD format" logs/
```
</details>

<details>
<summary><strong>💻 Code Searching</strong></summary>

```bash
# TODO comments
derp "TODO comments" src/

# Function definitions
derp "function definitions in JavaScript" src/

# Import statements
derp "Python import statements" --include="*.py" .

# API keys or tokens
derp "API keys or tokens" -i config/
```
</details>

<details>
<summary><strong>📊 Log Analysis</strong></summary>

```bash
# Error messages
derp "error messages" logs/*.log

# IP addresses
derp "IPv4 addresses" /var/log/

# Timestamps
derp "timestamps in HH:MM:SS format" logs/

# HTTP status codes
derp "HTTP 4xx or 5xx errors" access.log
```
</details>

<details>
<summary><strong>🔍 Data Extraction</strong></summary>

```bash
# Phone numbers
derp "US phone numbers" contacts/

# Social security numbers
derp "social security numbers" records.txt

# Hex colors
derp "hexadecimal color codes" styles.css

# MAC addresses
derp "MAC addresses" network-config.txt
```
</details>

## 🤖 Supported AI Providers

### Ollama (Default - Free, Local)

Perfect for privacy-focused users. Runs completely offline.

```bash
export OLLAMA_HOST=http://localhost:11434
derp --init
# Select: ollama
# Model: llama3.2, qwen2.5-coder, etc.
```

### LM Studio (Free, Local)

Another great local option with a user-friendly interface.

```bash
export LMSTUDIO_URL=http://localhost:1234
derp --init
# Select: lmstudio
```

### OpenAI (Cloud)

For maximum accuracy with GPT models.

```bash
export OPENAI_API_KEY=your-api-key
derp --init
# Select: openai
# Model: gpt-4o, gpt-4o-mini, gpt-3.5-turbo
```

### OpenRouter (Cloud)

Access multiple models through a single API.

```bash
export OPENROUTER_API_KEY=your-api-key
derp --init
# Select: openrouter
# Model: anthropic/claude-3-sonnet, google/gemini-pro, etc.
```

### AWS Bedrock (Cloud)

Enterprise-grade AI with AWS infrastructure.

```bash
export BEDROCK_URL=https://your-bedrock-proxy
derp --init
# Select: bedrock
```

## ⚙️ Configuration

Configuration is stored in `~/.derp.json`:

```json
{
  "provider": "ollama",
  "model": "llama3.2",
  "ollamaHost": "http://localhost:11434"
}
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `OLLAMA_HOST` | Ollama server URL (default: http://localhost:11434) |
| `LMSTUDIO_URL` | LM Studio server URL (default: http://localhost:1234) |
| `OPENAI_API_KEY` | OpenAI API key |
| `OPENROUTER_API_KEY` | OpenRouter API key |
| `BEDROCK_URL` | AWS Bedrock proxy URL |

## 🛠️ Development

### Setup

```bash
# Clone repository
git clone https://github.com/yourusername/derp.git
cd derp

# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Watch mode for tests
npm run test:watch

# Coverage report
npm run test:coverage

# Link for local development
npm link
```

### Project Structure

```
derp/
├── src/
│   ├── __tests__/        # Test files
│   ├── providers/        # AI provider implementations
│   ├── cli.ts           # CLI entry point
│   ├── config.ts        # Configuration management
│   ├── engines.ts       # Grep/ripgrep engines
│   ├── llmRouter.ts     # LLM routing logic
│   └── prompts.ts       # Prompt templates
├── dist/                # Compiled output
└── .github/
    └── workflows/       # CI/CD pipelines
```

## 📋 Requirements

- **Node.js**: 18.0.0 or higher
- **Grep Tool**: `grep` (built-in on Unix) or `ripgrep` (recommended)
- **AI Provider**: At least one configured provider (Ollama, OpenAI, etc.)

### Installing ripgrep (Recommended)

```bash
# macOS
brew install ripgrep

# Ubuntu/Debian
sudo apt install ripgrep

# Windows (via Chocolatey)
choco install ripgrep

# Or use cargo
cargo install ripgrep
```

## 🧪 Testing

Derp includes comprehensive test coverage:

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Lint check
npm run lint
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write tests for new features
- Follow existing code style
- Update documentation as needed
- Ensure CI passes before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with amazing open-source tools:

- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [chalk](https://github.com/chalk/chalk) - Terminal string styling
- [inquirer](https://github.com/SBoudrias/Inquirer.js) - Interactive CLI prompts
- [ora](https://github.com/sindresorhus/ora) - Elegant terminal spinners
- [axios](https://github.com/axios/axios) - HTTP client
- [ripgrep](https://github.com/BurntSushi/ripgrep) - Fast search tool
- [Jest](https://jestjs.io/) - Testing framework

## 🔗 Links

- [📦 npm Package](https://www.npmjs.com/package/derp)
- [📚 Documentation](https://github.com/yourusername/derp#readme)
- [🐛 Issue Tracker](https://github.com/yourusername/derp/issues)
- [💬 Discussions](https://github.com/yourusername/derp/discussions)

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/derp&type=Date)](https://star-history.com/#yourusername/derp&Date)

---

<div align="center">

Made with ❤️ by the Derp community

[⬆ back to top](#-derp)

</div>

