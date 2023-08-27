const { crawlPage } = require('./crawl.js');
const { URL } = require('url');
const { printReport, writeCsvFile } = require('./report.js');

const main = async () => {
  const args = process.argv.slice(2);
  if (args.length < 1 || args.length > 1) {
    throw new Error('expected one argument, received not enough or too many.');
  }
  const baseURL = new URL(args[0]);

  console.log(`Starting crawl on ${baseURL}`);

  const startTime = new Date().getTime();
  const links = await crawlPage(baseURL);
  const endTime = new Date().getTime();

  const elapsedTime = endTime - startTime;
  console.log(`Crawl completed. Took ${elapsedTime}ms to complete.`);

  printReport(links);
  writeCsvFile(baseURL.host, links);
};

main();
