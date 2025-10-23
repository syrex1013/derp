export function regexPrompt(intent: string): { system: string; user: string } {
  const system = `You are a regex expert. Convert natural language queries into valid regex patterns for grep/ripgrep.

Rules:
- Return ONLY the regex pattern, nothing else
- Use PCRE-compatible syntax
- Be precise and efficient
- For emails: [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}
- For URLs: https?://[^\\s]+
- For IPs: \\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b
- For dates: \\d{4}-\\d{2}-\\d{2} or \\d{2}/\\d{2}/\\d{4}
- For phone numbers: \\+?\\d{1,3}[-.\\s]?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}

Respond ONLY with the regex pattern.`;

  const user = `Generate regex for: ${intent}`;

  return { system, user };
}
