export interface CompletionResult {
  regex: string;
  args: string[];
  explanation?: string;
}

export interface Provider {
  complete(systemPrompt: string, userPrompt: string): Promise<CompletionResult>;
}

/**
 * Parse JSON response from LLM and extract CompletionResult
 * Handles various response formats and extracts JSON from markdown code blocks
 */
export function parseCompletionResult(content: string): CompletionResult {
  try {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    const jsonStr = jsonMatch ? jsonMatch[1] : content;

    // Clean up any leading/trailing whitespace
    const cleaned = jsonStr.trim();

    // Parse JSON
    const parsed = JSON.parse(cleaned);

    // Validate required fields
    if (!parsed.regex || typeof parsed.regex !== 'string') {
      throw new Error('Missing or invalid "regex" field');
    }

    // Args is optional but should be array if present
    let args = Array.isArray(parsed.args) ? parsed.args : [];

    // CRITICAL: Filter out -E and -e flags that LLM might have added
    // These are handled separately by the engine
    args = args.filter((arg: string) => arg !== '-E' && arg !== '-e');

    return {
      regex: parsed.regex,
      args,
      explanation: parsed.explanation || undefined
    };
  } catch (error: any) {
    // Fallback: attempt to robustly extract a usable regex from raw content
    console.warn('Failed to parse JSON response, falling back to regex extraction:', error.message);

    const extractRegex = (raw: string): string => {
      const trimmed = raw.trim();

      // 1) Prefer first non-JSON code block contents
      const codeBlock = trimmed.match(/```(?!json)[^\n]*\n([\s\S]*?)```/i);
      let candidate = codeBlock ? codeBlock[1].trim() : '';

      // 2) If no code block, use first paragraph; join wrapped lines
      if (!candidate) {
        const firstParagraph = trimmed.split(/\n\s*\n/)[0] || '';
        candidate = firstParagraph.replace(/\r?\n/g, ' ').trim();
      }

      // Strip common labels and surrounding quotes/backticks
      candidate = candidate.replace(/^\s*(regex|pattern)\s*[:=\-]\s*/i, '');
      candidate = candidate.replace(/^["'`]|["'`]$/g, '');

      // Collapse internal whitespace (regex should be single-line for grep -E)
      candidate = candidate.replace(/\s+/g, '');

      // Heuristics to fix common email pattern truncation issues
      if (candidate.includes('@')) {
        // Ensure a quantifier on the domain character class
        candidate = candidate.replace(/(@\[[^\]]+\])(?![+*{?])/g, '$1+');
        // Ensure a top-level domain exists (e.g., \\.com or \\.[A-Za-z]{2,})
        if (!/@[^]*\\\./.test(candidate)) {
          candidate += '\\.[A-Za-z]{2,}';
        }
      }

      return candidate || trimmed.split('\n')[0].trim();
    };

    const regex = extractRegex(content);
    return {
      regex,
      args: [],
      explanation: content
    };
  }
}
