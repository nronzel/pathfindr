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

const crawlPage = async (baseURL) => {
  try {
    const res = await fetch(baseURL);
    if (res.status !== 200) {
      throw new Error(`Received response status code ${res.status}`);
    }
    const contentType = res.headers.get('Content-Type');
    if (!contentType || !contentType.includes('text/html')) {
      throw new Error(`Received unwanted Content-Type: ${contentType}`);
    }
    const data = await res.text();
    console.log(data);
  } catch (error) {
    console.error('Error: ', error);
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
  crawlPage,
};
