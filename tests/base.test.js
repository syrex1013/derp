import { parseCompletionResult } from '../dist/providers/base.js';

describe('parseCompletionResult', () => {
  test('should parse valid JSON response', () => {
    const input = JSON.stringify({
      regex: '\\d{3}-\\d{3}-\\d{4}',
      args: ['-i'],
      explanation: 'Matches US phone numbers'
    });

    const result = parseCompletionResult(input);
    
    expect(result.regex).toBe('\\d{3}-\\d{3}-\\d{4}');
    expect(result.args).toEqual(['-i']);
    expect(result.explanation).toBe('Matches US phone numbers');
  });

  test('should parse JSON from markdown code block', () => {
    const input = '```json\n{"regex": "test", "args": []}\n```';
    
    const result = parseCompletionResult(input);
    
    expect(result.regex).toBe('test');
    expect(result.args).toEqual([]);
  });

  test('should filter out -E and -e flags', () => {
    const input = JSON.stringify({
      regex: 'test',
      args: ['-E', '-i', '-e', '-n']
    });

    const result = parseCompletionResult(input);
    
    expect(result.args).toEqual(['-i', '-n']);
  });

  test('should handle missing args field', () => {
    const input = JSON.stringify({
      regex: 'test'
    });

    const result = parseCompletionResult(input);
    
    expect(result.regex).toBe('test');
    expect(result.args).toEqual([]);
  });

  test('should fallback on invalid JSON', () => {
    const input = 'not-json-at-all';
    
    const result = parseCompletionResult(input);
    
    expect(result.regex).toBe('not-json-at-all');
    expect(result.args).toEqual([]);
  });
});
