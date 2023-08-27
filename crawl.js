const { URL } = require('url');
const { JSDOM } = require('jsdom');

const removeTrailingSlash = (path) => {
  const lastChar = path.slice(-1);
  if (lastChar === '/') {
    return path.slice(0, -1);
  } else {
    return path;
  }
};

const normalizeURL = (url) => {
  try {
    const urlObj = new URL(url);
    let path = removeTrailingSlash(urlObj.pathname);
    const normalized = urlObj.hostname + path;
    return normalized;
  } catch (error) {
    throw new Error(`Failed to normalize URL: ${error.message}`);
  }
};

const getURLsFromHTML = (htmlBody, baseURL) => {
  // returns non-normalized URLs from page
  try {
    const dom = new JSDOM(htmlBody);
    const aTags = dom.window.document.querySelectorAll('a');
    const linksFromCurrentPage = [];

    for (const tag of aTags) {
      let fullURL = null;
      if (tag.href[0] === '/') {
        fullURL = new URL(tag.href, baseURL).toString();
      } else {
        fullURL = tag.href;
      }
      linksFromCurrentPage.push(fullURL);
    }
    return linksFromCurrentPage;
  } catch (error) {
    console.error(`An error occurred while parsing HTML: ${error.message}`);
    return [];
  }
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
  try {
    baseURL = new URL(baseURL);
    currentURL = new URL(currentURL);

    initPageCounter(pages);

    if (!isSameDomain(baseURL, currentURL)) {
      return pages;
    }

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
      console.log(`Ignoring non-HTML content: ${currentURL}`);
      return pages;
    }

    const html = await res.text();
    const linksFromCurrentPage = getURLsFromHTML(html, baseURL);

    // Slower crawling
    // for (const link of linksFromCurrentPage) {
    //   await crawlPage(baseURL, link, pages);
    // }

    // Fast crawling
    await Promise.all(
      linksFromCurrentPage.map((link) => crawlPage(baseURL, link, pages))
    );

    pages['total_links'] += linksFromCurrentPage.length;
    return pages;
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
    return pages;
  }
};

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
};
