const fs = require('fs');

const printReport = (pages) => {
  // Prints out a nice report of the `pages` object.
  console.log('\n\nStarting report.');
  const sortedPages = sortObject(pages);

  Object.keys(sortedPages).forEach((key) => {
    let value = sortedPages[key];
    if (key === 'total_links') {
      console.log(`Found ${value} total links.`);
    } else if (value === 0) {
      console.log(`Found external link to ${key}`);
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
  const sortedObject = sortObject(data);
  const dataArray = Object.keys(sortedObject).map((link) => ({
    Link: link,
    Count: sortedObject[link],
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
  filename = processFileName(filename);
  const csvData = objectToCsv(data);

  if (csvData === null) {
    console.error('Invalid data');
    return;
  }

  const directory = './crawled';

  fs.mkdir(directory, { recursive: true }, (err) => {
    if (err) {
      console.error(`Could not create directory: ${err}`);
      return;
    }
  });

  fs.writeFile(`./crawled/${filename}.csv`, csvData, (err) => {
    if (err) {
      console.error(`Could not save data to file: ${err}`);
    }
    console.log(`Data saved to ./crawled/${filename}.csv`);
  });
};

const processFileName = (fileName) => {
  return fileName.replaceAll('.', '-');
};

module.exports = {
  printReport,
  sortObject,
  writeCsvFile,
};
