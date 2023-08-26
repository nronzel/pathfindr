const { url } = require('url');
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
  const newDom = new JSDOM(htmlBody);
    const links = newDom.window.document.querySelectorAll('a')
    for (const link of links) {
        return removeTrailingSlash(link.href)
    }
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
