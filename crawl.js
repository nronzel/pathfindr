const url = require('node:url');

const normalizeURL = (url) => {
  const urlObj = new URL(url);
  let path = removeTrailingSlash(urlObj.pathname);
  const normalized = urlObj.hostname + path;

  return normalized;
};

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
};
