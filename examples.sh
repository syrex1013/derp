#!/bin/bash

# Example usage script for Derp

echo "🤖 Derp Examples"
echo "===================="
echo ""

# Check if derp is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

echo "✅ Node.js found"
echo ""

# Build the project if not already built
if [ ! -d "dist" ]; then
    echo "📦 Building project..."
    npm run build
    echo ""
fi

echo "📋 Examples:"
echo ""
echo "1. Show help:"
echo "   node dist/cli.js --help"
echo ""

echo "2. Show configuration:"
echo "   node dist/cli.js --config"
echo ""

echo "3. Initialize configuration (interactive):"
echo "   node dist/cli.js --init"
echo ""

echo "4. Search for emails (requires LLM):"
echo "   node dist/cli.js \"email addresses\" -r . --dry-run"
echo ""

echo "5. Search for TODO comments (requires LLM):"
echo "   node dist/cli.js \"TODO comments\" src/ --dry-run"
echo ""

echo "6. Search for IP addresses with explanation (requires LLM):"
echo "   node dist/cli.js \"IP addresses\" . --dry-run --explain"
echo ""

echo "🔧 Configuration:"
echo ""
echo "Derp supports multiple LLM providers:"
echo "  - Ollama (default): http://localhost:11434"
echo "  - LM Studio: http://localhost:1234"
echo "  - OpenAI: Set OPENAI_API_KEY"
echo "  - OpenRouter: Set OPENROUTER_API_KEY"
echo "  - AWS Bedrock: Set BEDROCK_URL"
echo ""

echo "To configure, run: node dist/cli.js --init"
echo ""
