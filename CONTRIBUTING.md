# Contributing to Grepagent

Thank you for your interest in contributing to Grepagent! 🎉

## Getting Started

1. **Fork the repository**
2. **Clone your fork:**
   ```bash
   git clone https://github.com/yourusername/grepagent.git
   cd grepagent
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Build the project:**
   ```bash
   npm run build
   ```

## Development Workflow

1. **Create a new branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** in the `src/` directory

3. **Build and test:**
   ```bash
   npm run build
   node dist/cli.js --help
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

5. **Push and create a Pull Request:**
   ```bash
   git push origin feature/your-feature-name
   ```

## Project Structure

```
grepagent/
├── src/
│   ├── cli.ts              # Main CLI entry point
│   ├── config.ts           # Configuration management
│   ├── llmRouter.ts        # LLM provider routing
│   ├── prompts.ts          # Prompt templates
│   ├── engines.ts          # grep/ripgrep handling
│   ├── utils.ts            # Utility functions
│   └── providers/          # LLM provider implementations
│       ├── base.ts         # Provider interface
│       ├── ollama.ts       # Ollama provider
│       ├── lmstudio.ts     # LM Studio provider
│       ├── openai.ts       # OpenAI provider
│       ├── bedrock.ts      # AWS Bedrock provider
│       └── openrouter.ts   # OpenRouter provider
├── dist/                   # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## Adding a New LLM Provider

1. Create a new file in `src/providers/yourprovider.ts`
2. Implement the `Provider` interface from `base.ts`
3. Add the provider to `llmRouter.ts`
4. Update the config type in `config.ts`
5. Update the CLI init flow in `cli.ts`

Example:

```typescript
import axios from 'axios';
import { Provider, CompletionResult } from './base.js';

export class YourProvider implements Provider {
  constructor(private apiKey: string, private model: string) {}

  async complete(systemPrompt: string, userPrompt: string): Promise<CompletionResult> {
    // Implement API call
    const response = await axios.post('https://api.example.com/chat', {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    });
    
    const content = response.data.message.content;
    const regex = this.extractRegex(content);
    
    return { regex, explanation: content };
  }

  private extractRegex(content: string): string {
    // Extract regex from response
    return content.trim().split('\n')[0];
  }
}
```

## Code Style

- Use TypeScript
- Follow existing code formatting
- Add comments for complex logic
- Use meaningful variable names
- Keep functions focused and small

## Commit Messages

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `refactor:` Code refactoring
- `test:` Test additions or changes
- `chore:` Build process or auxiliary tool changes

## Testing

Before submitting a PR, ensure:
- The project builds successfully (`npm run build`)
- The CLI runs without errors (`node dist/cli.js --help`)
- Your changes work with at least one LLM provider

## Questions?

Open an issue for:
- Bug reports
- Feature requests
- Questions about the codebase

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
