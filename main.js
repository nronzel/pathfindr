const { crawlPage } = require('./crawl.js');

const main = () => {
  const args = process.argv.slice(2);
  if (args.length < 1 || args.length > 1) {
    throw new Error('expected one argument, received not enough or too many.');
  }

  console.log(`Starting crawl on ${args[0]}`);
  crawlPage(args[0]);
};

main();
