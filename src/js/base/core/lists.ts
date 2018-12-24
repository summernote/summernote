import func from './func';

/**
 * returns the first item of an array.
 *
 * @param {Array} array
 */
export function head<V>(array: Array<V>): V {
  return array[0];
}

/**
 * returns the last item of an array.
 *
 * @param {Array} array
 */
export function last<V>(array: Array<V>): V {
  return array[array.length - 1];
}

/**
 * returns everything but the last entry of the array.
 *
 * @param {Array} array
 */
export function initial<V>(array: Array<V>): Array<V> {
  return array.slice(0, array.length - 1);
}

/**
 * returns the rest of the items in an array.
 *
 * @param {Array} array
 */
export function tail<V>(array: Array<V>): Array<V> {
  return array.slice(1);
}

/**
 * returns item of array
 */
export function find<V>(array: Array<V>, pred: (V) => boolean): V {
  for (let idx = 0, len = array.length; idx < len; idx++) {
    const item = array[idx];
    if (pred(item)) {
      return item;
    }
  }
}

/**
 * returns true if all of the values in the array pass the predicate truth test.
 */
export function all<V>(array: Array<V>, pred: (V) => boolean): boolean {
  for (let idx = 0, len = array.length; idx < len; idx++) {
    if (!pred(array[idx])) {
      return false;
    }
  }
  return true;
}

/**
 * returns index of item
 */
export function indexOf<V>(array: Array<V>, item: V): number {
  for (let idx = 0; idx < array.length; idx++) {
    if (array[idx] === item) {
      return idx;
    }
  }
  return -1;
}

/**
 * returns true if the value is present in the list.
 */
export function contains<V>(array: Array<V>, item: V): boolean {
  return indexOf(array, item) !== -1;
}

/**
 * get sum from a list
 *
 * @param {Array} array - array
 * @param {Function} fn - iterator
 */
export function sum<V>(array: Array<V>, fn: (V) => number): number {
  fn = fn || func.self;
  return array.reduce(function(memo, v) {
    return memo + fn(v);
  }, 0);
}

/**
 * returns a copy of the collection with array type.
 * @param {Collection} collection - collection eg) node.childNodes, ...
 */
export function from<V>(collection: any): Array<V> {
  const result = [];
  const length = collection.length;
  let idx = -1;
  while (++idx < length) {
    result[idx] = collection[idx];
  }
  return result;
}

/**
 * returns whether list is empty or not
 */
export function isEmpty<V>(array: Array<V>): boolean {
  return !array || !array.length;
}

/**
 * cluster elements by predicate function.
 *
 * @param {Array} array - array
 * @param {Function} fn - predicate function for cluster rule
 * @param {Array[]}
 */
export function clusterBy<V>(array: Array<V>, fn): Array<Array<V>> {
  if (!array.length) { return []; }
  return tail(array).reduce(function(memo, v) {
    const aLast = last(memo);
    if (fn(last(aLast), v)) {
      aLast[aLast.length] = v;
    } else {
      memo[memo.length] = [v];
    }
    return memo;
  }, [[head(array)]]);
}

/**
 * returns a copy of the array with all false values removed
 *
 * @param {Array} array - array
 * @param {Function} fn - predicate function
 */
export function compact<V>(array: Array<V>): Array<V> {
  const aResult = [];
  for (let idx = 0, len = array.length; idx < len; idx++) {
    if (array[idx]) { aResult.push(array[idx]); }
  }
  return aResult;
}

/**
 * produces a duplicate-free version of the array
 */
export function unique<V>(array: Array<V>): Array<V> {
  const results = [];

  for (let idx = 0, len = array.length; idx < len; idx++) {
    if (!contains(results, array[idx])) {
      results.push(array[idx]);
    }
  }

  return results;
}

/**
 * returns next item.
 */
export function next<V>(array: Array<V>, item: V): V {
  const idx = indexOf(array, item);
  if (idx === -1) { return null; }

  return array[idx + 1];
}

/**
 * returns prev item.
 */
export function prev<V>(array: Array<V>, item: V): V {
  const idx = indexOf(array, item);
  if (idx === -1) { return null; }

  return array[idx - 1];
}
