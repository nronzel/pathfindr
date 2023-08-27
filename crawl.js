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
  const foundLinks = [];

  for (const tag of aTags) {
    let fullURL;
    if (tag.href[0] === '/') {
      fullURL = new URL(tag.href, baseURL).toString();
    } else {
      fullURL = tag.href;
    }
    foundLinks.push(fullURL);
  }
  return foundLinks;
};

const isSameDomain = (baseURL, currentURL) => {
  return new URL(baseURL).host === new URL(currentURL).host;
};

const initPageCounter = (pages) => {
  if (!('total_links' in pages)) {
    pages['total_links'] = 0;
  }
};

const crawlPage = async (baseURL, currentURL = baseURL, pages = {}) => {
  // check if currentUrl is on same domain as baseURL, if not - return
  // current `pages`.
  try {
    baseURL = new URL(baseURL);
    currentURL = new URL(currentURL);

    initPageCounter(pages);

    if (!isSameDomain(baseURL, currentURL)) {
      return pages;
    }
    // get normalized version of the currentURL
    const normalizedCurrentURL = normalizeURL(currentURL);

    // if `pages` already has entry for normalized version, increment count and
    // return the current `pages`
    if (pages[normalizedCurrentURL] ?? false) {
      pages[normalizedCurrentURL] += 1;
      return pages;
    }

    // otherwise add entry to `pages` for normalized version of currentURL, set
    // count to 1 as long as the current url isn't the base url. Set to 0 if it
    // is the base URL
    if (normalizedCurrentURL === baseURL.toString()) {
      pages[normalizedCurrentURL] = 0;
    } else {
      pages[normalizedCurrentURL] = 1;
    }

    const res = await fetch(currentURL);
    console.log(`Crawling: ${currentURL}`);

    if (res.status !== 200) {
      throw new Error(`Received Status Code: ${res.status}`);
    }

    const contentType = res.headers.get('Content-Type');
    if (!contentType.startsWith('text/html')) {
      throw new Error(`Received unwanted Content-Type: ${contentType}`);
    }
    const html = await res.text();
    const foundLinks = getURLsFromHTML(html, baseURL);

    for (const link of foundLinks) {
      await crawlPage(baseURL, link, pages);
    }
    pages['total_links'] += parseInt(foundLinks.length);
    // return updated `pages` object
    return pages;
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
    return pages;
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
