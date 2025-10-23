# 🤖 Grepagent

AI-powered grep tool that converts natural language queries into regex patterns.

## ✨ Features

- 🗣️ **Natural Language Interface** - Use plain English instead of regex
- 🤖 **Multi-Provider Support** - Works with Ollama, LM Studio, OpenAI, Bedrock, and OpenRouter
- ⚡ **Fast & Efficient** - Uses ripgrep or grep under the hood
- 🎨 **Beautiful CLI** - Colorized output with preview
- 🔧 **Configurable** - Easy setup and customization

## 📦 Installation

### npm

```bash
npm install -g grepagent
```

### From Source

```bash
git clone https://github.com/yourusername/grepagent.git
cd grepagent
npm install
npm run build
npm link
```

## 🚀 Quick Start

1. **Initialize configuration:**

```bash
grepagent --init
```

2. **Use natural language to search:**

```bash
grepagent "emails in files" -r .
grepagent "TODO comments" src/
grepagent "IP addresses" logs/*.log
```

## 📖 Usage

```bash
grepagent <natural-language-query> [grep-options]
```

### Options

- `--init` - Initialize configuration
- `--config` - Show current configuration
- `--dry-run` - Show generated command without executing
- `--explain` - Show LLM explanation
- `--help` - Show help message

### Examples

```bash
# Find email addresses recursively
grepagent "email addresses" -r .

# Find TODO comments with dry-run
grepagent "TODO comments" src/ --dry-run

# Find URLs with explanation
grepagent "URLs starting with https" . --explain

# Find phone numbers in specific files
grepagent "US phone numbers" contacts/*.txt

# Find dates in log files
grepagent "dates in YYYY-MM-DD format" logs/
```

## 🔧 Configuration

### Supported Providers

#### Ollama (Default)

```bash
export OLLAMA_HOST=http://localhost:11434
grepagent --init
# Select: ollama
# Model: llama3.2
```

#### LM Studio

```bash
export LMSTUDIO_URL=http://localhost:1234
grepagent --init
# Select: lmstudio
```

#### OpenAI

```bash
export OPENAI_API_KEY=your-api-key
grepagent --init
# Select: openai
# Model: gpt-4
```

#### OpenRouter

```bash
export OPENROUTER_API_KEY=your-api-key
grepagent --init
# Select: openrouter
# Model: anthropic/claude-3-sonnet
```

#### AWS Bedrock

```bash
export BEDROCK_URL=https://your-bedrock-proxy
grepagent --init
# Select: bedrock
```

### Configuration File

Configuration is stored in `~/.grepagent.json`:

```json
{
  "provider": "ollama",
  "model": "llama3.2",
  "ollamaHost": "http://localhost:11434"
}
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Development mode
npm run dev

# Link locally
npm link
```

## 📋 Requirements

- Node.js 18+
- `grep` or `ripgrep` (rg) installed
- One of the supported LLM providers configured

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [TypeScript](https://www.typescriptlang.org/)
- Uses [chalk](https://github.com/chalk/chalk) for colorization
- Uses [inquirer](https://github.com/SBoudrias/Inquirer.js) for interactive prompts
- Uses [ora](https://github.com/sindresorhus/ora) for spinners
- Uses [axios](https://github.com/axios/axios) for HTTP requests

## 🔗 Links

- [GitHub Repository](https://github.com/yourusername/grepagent)
- [npm Package](https://www.npmjs.com/package/grepagent)
- [Issue Tracker](https://github.com/yourusername/grepagent/issues)
