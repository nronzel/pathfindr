const { URL } = require('url');
const { JSDOM } = require('jsdom');

const normalizeURL = (url) => {
  try {
    const urlObj = new URL(url);
    let path = removeTrailingSlash(urlObj.pathname);
    const normalized = urlObj.hostname + path;
    return normalized;
  } catch (error) {
    throw error;
  }
};

const getURLsFromHTML = (htmlBody, baseURL) => {
  // returns non-normalized URLs from page
  const dom = new JSDOM(htmlBody);
  const aTags = dom.window.document.querySelectorAll('a');
  const foundLinks = new Set();

  for (const tag of aTags) {
    let fullURL;
    if (tag.href[0] === '/') {
      fullURL = new URL(tag.href, baseURL).toString();
    } else {
      fullURL = tag.href;
    }
    foundLinks.add(fullURL);
  }
  return Array.from(foundLinks);
};

// Helper functions
const removeTrailingSlash = (path) => {
  const lastChar = path.slice(-1);
  if (lastChar === '/') {
    return path.slice(0, -1);
  } else {
    return path;
  }
};

module.exports = {
  normalizeURL,
  getURLsFromHTML,
};
