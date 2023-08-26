const { test, expect } = require('@jest/globals');
const { normalizeURL } = require('./crawl');

describe('test url normalization', () => {
  test('test basic urls no paths', () => {
    const testURLs = ['http://blog.boot.dev/', 'https://blog.boot.dev'];

    const expected = 'blog.boot.dev';
    for (let i = 0; i < testURLs.length; i++) {
      const normalized = normalizeURL(testURLs[i]);
      const expected_url = expected;

      expect(normalized).toBe(expected_url);
    }
  });

  test('test url with paths', () => {
    const testURLs = [
      'https://blog.boot.dev/path/',
      'https://blog.boot.dev/path',
      'http://blog.boot.dev/path/',
      'http://blog.boot.dev/path',
    ];

    const expected = 'blog.boot.dev/path';
    for (let i = 0; i < testURLs.length; i++) {
      const normalized = normalizeURL(testURLs[i]);
      const expected_url = expected;

      expect(normalized).toBe(expected_url);
    }
  });
});
