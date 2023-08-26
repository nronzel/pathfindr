const { test, expect } = require('@jest/globals');
const { normalizeURL, getURLsFromHTML } = require('./crawl');

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

  test('test empty string', () => {
    expect(() => normalizeURL('')).toThrow('Invalid URL');
  });

  test('test invalid URLs', () => {
    const testURLs = ['not-a-url', '://missing-protocol.com'];
    for (let i = 0; i < testURLs.length; i++) {
      expect(() => normalizeURL(testURLs[i])).toThrow();
    }
  });

  test('test URL with query parameters', () => {
    const normalized = normalizeURL('https://blog.boot.dev/path?query=value');
    expect(normalized).toBe('blog.boot.dev/path');
  });

  test('test URLs with fragments', () => {
    const normalized = normalizeURL('https://blog.boot.dev/path#fragment');
    expect(normalized).toBe('blog.boot.dev/path');
  });

  test('test special characters', () => {
    const normalized = normalizeURL('https://blog.boot.dev/p@th$');
    expect(normalized).toBe('blog.boot.dev/p@th$');
  });

  test('test with port numbers', () => {
    const testURLs = [
      'http://blog.boot.dev:8080',
      'https://blog.boot.dev:443/',
      'http://blog.boot.dev:3000/path',
    ];

    const expected = ['blog.boot.dev', 'blog.boot.dev', 'blog.boot.dev/path'];
    for (let i = 0; i < testURLs.length; i++) {
      const normalized = normalizeURL(testURLs[i]);
      expect(normalized).toBe(expected[i]);
    }
  });

  test('test single character paths', () => {
    const normalized = normalizeURL('https://blog.boot.dev/a');
    expect(normalized).toBe('blog.boot.dev/a');
  });

  test('test subdomains', () => {
    const normalized = normalizeURL('https://sub.blog.boot.dev/path/');
    expect(normalized).toBe('sub.blog.boot.dev/path');
  });

  test('test encoded characters in path', () => {
    const normalized = normalizeURL('https://blog.boot.dev/one%20two');
    expect(normalized).toBe('blog.boot.dev/one%20two');
  });
});

describe('Test URL extraction', () => {
  test('extract URL from simple HTML', () => {
    const html = `
        <html>
            <body>
                <a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a>
            </body>
        </html>
        `;
    const extracted = getURLsFromHTML(html, 'blog.boot.dev');
    expect(extracted).toBe('https://blog.boot.dev');
  });
});
