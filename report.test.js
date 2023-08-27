const { sortObject } = require('./report.js');
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

    const sorted = sortObject(testObj);
    expect(sorted).toEqual(expected);
  });

  test('sorts empty object', () => {
    const input = {};
    const expected = {};
    expect(sortObject(input)).toEqual(expected);
  });

  test('sorts object with one key-val pair', () => {
    const input = { a: 1 };
    const expected = { a: 1 };
    expect(sortObject(input)).toEqual(expected);
  });

  test('sorts object with identical values', () => {
    const input = { a: 2, b: 2, c: 1 };
    const expected = { a: 2, b: 2, c: 1 };
    expect(sortObject(input)).toEqual(expected);
  });

  test('sorts object with non-numeric values', () => {
    const input = { a: 'z', b: 'a', c: 'm' };
    const expected = { a: 'z', c: 'm', b: 'a' };
    expect(sortObject(input)).toEqual(expected);
  });
});
