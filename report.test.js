const { sortPages } = require('./report.js');
const { expect, test } = require('@jest/globals');

describe('Test sorting of pages object', () => {
  test('test object gets properly sorted', () => {
    const testObj = {
      a: 1,
      b: 4,
      c: 39,
      d: 30,
      e: 10,
      f: 3,
      g: 9,
    };

    const expected = {
      c: 39,
      d: 30,
      e: 10,
      g: 9,
      b: 4,
      f: 3,
      a: 1,
    };

    const sorted = sortPages(testObj);
    expect(sorted).toEqual(expected);
  });
});
