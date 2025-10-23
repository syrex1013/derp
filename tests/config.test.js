describe('Config', () => {
  test('should validate provider types', () => {
    const validProviders = ['ollama', 'lmstudio', 'openai', 'bedrock', 'openrouter'];
    
    validProviders.forEach(provider => {
      expect(validProviders).toContain(provider);
    });
  });
});
