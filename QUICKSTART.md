# 🚀 Quick Start Guide

Get up and running with Derp in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- `grep` or `ripgrep` available in PATH
- One LLM provider (see options below)

## Installation

```bash
cd derp
npm install
npm run build
```

## Quick Setup

### Option 1: Using Ollama (Recommended for Local)

1. Install Ollama from https://ollama.ai
2. Pull a model:
   ```bash
   ollama pull llama3.2
   ```
3. Configure derp:
   ```bash
   node dist/cli.js --init
   # Select: ollama
   # Model: llama3.2
   ```

### Option 2: Using OpenAI

1. Get API key from https://platform.openai.com
2. Set environment variable:
   ```bash
   export OPENAI_API_KEY="sk-..."
   ```
3. Configure derp:
   ```bash
   node dist/cli.js --init
   # Select: openai
   # Model: gpt-4
   ```

### Option 3: Using LM Studio

1. Download LM Studio from https://lmstudio.ai
2. Load a model and start the server
3. Configure derp:
   ```bash
   node dist/cli.js --init
   # Select: lmstudio
   ```

## First Search

```bash
# Search for email addresses
node dist/cli.js "email addresses" -r . --dry-run

# Search for TODO comments
node dist/cli.js "TODO comments" src/

# Find IP addresses with explanation
node dist/cli.js "IP addresses" . --explain
```

## Common Commands

```bash
# Show help
node dist/cli.js --help

# Show configuration
node dist/cli.js --config

# Run without executing (preview only)
node dist/cli.js "your query" path/ --dry-run

# Show AI explanation
node dist/cli.js "your query" path/ --explain
```

## Usage Pattern

```bash
node dist/cli.js "<natural language query>" [grep-options] [flags]
```

### Natural Language Examples

- `"email addresses"`
- `"TODO comments"`
- `"IP addresses"`
- `"phone numbers"`
- `"URLs starting with https"`
- `"dates in YYYY-MM-DD format"`
- `"lines containing error"`
- `"JSON objects"`

### Grep Options

Any standard grep/ripgrep options work:

- `-r` - Recursive search
- `-i` - Case insensitive
- `-n` - Show line numbers
- `-l` - List files only
- `-A 3` - Show 3 lines after match
- `-B 3` - Show 3 lines before match

### Flags

- `--dry-run` - Show command without executing
- `--explain` - Show AI explanation of regex
- `--help` - Show help message
- `--config` - Show configuration
- `--init` - Initialize/update configuration

## Examples

### Find emails recursively

```bash
node dist/cli.js "email addresses" -r .
```

### Find TODOs in source code

```bash
node dist/cli.js "TODO comments" src/ -n
```

### Find IP addresses with context

```bash
node dist/cli.js "IP addresses" logs/ -A 2 -B 2
```

### Preview command before running

```bash
node dist/cli.js "phone numbers" contacts/ --dry-run
```

### Get explanation of generated regex

```bash
node dist/cli.js "dates in MM/DD/YYYY format" . --explain
```

## Troubleshooting

### "LLM request failed"
- Ensure your LLM provider is running
- Check API keys are set correctly
- Verify network connectivity

### "Neither ripgrep nor grep found"
- Install ripgrep: `brew install ripgrep` (macOS)
- Or use system grep (already installed on Unix systems)

### "Configuration not found"
- Run `node dist/cli.js --init` to create config
- Or manually create `~/.derp.json`

## What's Next?

- Explore different LLM providers
- Try complex search patterns
- Integrate into your workflow
- Contribute improvements!

## Need Help?

- Check `README.md` for detailed documentation
- View `examples.sh` for more examples
- Open an issue on GitHub

Happy searching! 🔍
