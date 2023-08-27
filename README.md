# Pathfindr

Pathfindr helps you analyze internal linking within your website by generating
a comprehensive report.

## Features

- Crawls a given base URL to enumerate internal links.
- Ignores pages with `Content-Type` other than `text/html`.
- Uses concurrent crawling for improved performance.

## Quick Start

### Installation

Clone the repository:

```bash
git clone https://github.com/nronzel/pathfindr.git
```

Naviate to the project directory:

```bash
cd pathfindr
```

Install the required dependencies:

```bash
npm install
```

### Usage

Run Pathfindr by providing the base URL you wish to crawl. This URL serves as
both the starting point and scope limiter for the crawl.

```bash
npm start https://url-to-crawl.com
```

A report will be printed to your console upon completion.

## Tests

To run the available unit tests:

```bash
npm test
```

## Coming Soon

- [ ] CSV export

## Future Roadmap

- Enhance error handling to accommodate larger, more complex sites.
- Include external link counts in report.
- ~~Add CSV export functionality.~~ _coming soon_
- Implement logging for comprehensive crawling records.
- Incorporate data visualization to represent internal linking graphically.
