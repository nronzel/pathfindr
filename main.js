const { crawlPage } = require('./crawl.js');
const { URL } = require('url');

const main = async () => {
  const args = process.argv.slice(2);
  if (args.length < 1 || args.length > 1) {
    throw new Error('expected one argument, received not enough or too many.');
  }
  const baseURL = new URL(args[0]);

  console.log(`Starting crawl on ${baseURL}`);
  const links = await crawlPage(baseURL);
  console.log(links);
};

main();
