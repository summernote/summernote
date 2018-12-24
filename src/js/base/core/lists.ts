import * as func from './func';

export class Lists {
  /**
   * returns the first item of an array.
   *
   * @param {Array} array
   */
  public static head<V>(array: Array<V>): V {
    return array[0];
  }

  /**
   * returns the last item of an array.
   *
   * @param {Array} array
   */
  public static last<V>(array: Array<V>): V {
    return array[array.length - 1];
  }

  /**
   * returns everything but the last entry of the array.
   *
   * @param {Array} array
   */
  public static initial<V>(array: Array<V>): Array<V> {
    return array.slice(0, array.length - 1);
  }

  /**
   * returns the rest of the items in an array.
   *
   * @param {Array} array
   */
  public static tail<V>(array: Array<V>): Array<V> {
    return array.slice(1);
  }

  /**
   * returns item of array
   */
  public static find<V>(array: Array<V>, pred: (V) => boolean): V {
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
  public static all<V>(array: Array<V>, pred: (V) => boolean): boolean {
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
  public static indexOf<V>(array: Array<V>, item: V): number {
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
  public static contains<V>(array: Array<V>, item: V): boolean {
    return Lists.indexOf(array, item) !== -1;
  }

  /**
   * get sum from a list
   *
   * @param {Array} array - array
   * @param {Function} fn - iterator
   */
  public static sum<V>(array: Array<V>, fn: (V) => number): number {
    fn = fn || func.self;
    return array.reduce(function(memo, v) {
      return memo + fn(v);
    }, 0);
  }

  /**
   * returns a copy of the collection with array type.
   * @param {Collection} collection - collection eg) node.childNodes, ...
   */
  public static from<V>(collection: any): Array<V> {
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
  public static isEmpty<V>(array: Array<V>): boolean {
    return !array || !array.length;
  }

  /**
   * cluster elements by predicate function.
   *
   * @param {Array} array - array
   * @param {Function} fn - predicate function for cluster rule
   * @param {Array[]}
   */
  public static clusterBy<V>(array: Array<V>, fn): Array<Array<V>> {
    if (!array.length) { return []; }
    return Lists.tail(array).reduce(function(memo, v) {
      const aLast = Lists.last(memo);
      if (fn(Lists.last(aLast), v)) {
        aLast[aLast.length] = v;
      } else {
        memo[memo.length] = [v];
      }
      return memo;
    }, [[Lists.head(array)]]);
  }

  /**
   * returns a copy of the array with all false values removed
   *
   * @param {Array} array - array
   * @param {Function} fn - predicate function
   */
  public static compact<V>(array: Array<V>): Array<V> {
    const aResult = [];
    for (let idx = 0, len = array.length; idx < len; idx++) {
      if (array[idx]) { aResult.push(array[idx]); }
    }
    return aResult;
  }

  /**
   * produces a duplicate-free version of the array
   */
  public static unique<V>(array: Array<V>): Array<V> {
    const results = [];

    for (let idx = 0, len = array.length; idx < len; idx++) {
      if (!Lists.contains(results, array[idx])) {
        results.push(array[idx]);
      }
    }

    return results;
  }

  /**
   * returns next item.
   */
  public static next<V>(array: Array<V>, item: V): V {
    const idx = Lists.indexOf(array, item);
    if (idx === -1) { return null; }

    return array[idx + 1];
  }

  /**
   * returns prev item.
   */
  public static prev<V>(array: Array<V>, item: V): V {
    const idx = Lists.indexOf(array, item);
    if (idx === -1) { return null; }

    return array[idx - 1];
  }
}
