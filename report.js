const printReport = (pages) => {
  // Prints out a nice report of the `pages` object.
  console.log('\n\nStarting report.');
  const sortedPages = sortPages(pages);

  Object.keys(sortedPages).forEach((key) => {
    let value = sortedPages[key];
    if (key === 'total_links') {
      console.log(`Found ${value} total internal links.`);
    } else {
      console.log(`Found ${value} internal links to ${key}`);
    }
  });
};

const sortPages = (pages) => {
  const entries = Object.entries(pages);
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  const sortedObj = Object.fromEntries(sorted);

  return sortedObj;
};

module.exports = {
  printReport,
};
