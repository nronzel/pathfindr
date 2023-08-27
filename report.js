const fs = require('fs');

const printReport = (pages) => {
  // Prints out a nice report of the `pages` object.
  console.log('\n\nStarting report.');
  const sortedPages = sortObject(pages);

  Object.keys(sortedPages).forEach((key) => {
    let value = sortedPages[key];
    if (key === 'total_links') {
      console.log(`Found ${value} total internal links.`);
    } else {
      console.log(`Found ${value} internal links to ${key}`);
    }
  });
};

const sortObject = (object) => {
  const entries = Object.entries(object);
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  const sortedObj = Object.fromEntries(sorted);

  return sortedObj;
};

const objectToCsv = (data) => {
  // Transform the object into an array of objects
  const dataArray = Object.keys(data).map((link) => ({
    Link: link,
    Count: data[link],
  }));

  // If the resulting array is empty, return null
  if (dataArray.length === 0) {
    console.error('Data is empty');
    return null;
  }

  const csvRows = [];
  const headers = ['Link', 'Count']; // Manually set headers
  csvRows.push(headers.join(','));

  for (const row of dataArray) {
    const values = headers.map((header) => row[header]);
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
};

const writeCsvFile = (filename, data) => {
  const csvData = objectToCsv(data);

  if (csvData === null) {
    console.error('Invalid data');
    return;
  }

  fs.writeFile(`${filename}.csv`, csvData, (err) => {
    if (err) {
      console.error(`Could not save data to file: ${err}`);
    }
    console.log(`Data saved to ${filename}.csv`);
  });
};

module.exports = {
  printReport,
  sortObject,
  writeCsvFile,
};
