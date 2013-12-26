define(['core/func'], function (func) {
  /**
   * list utils
   */
  var list = (function () {
    var head = function (array) { return array[0]; };
    var last = function (array) { return array[array.length - 1]; };
    var initial = function (array) { return array.slice(0, array.length - 1); };
    var tail = function (array) { return array.slice(1); };
  
    /**
     * get sum from a list
     * @param {array} array - array
     * @param {function} fn - iterator
     */
    var sum = function (array, fn) {
      fn = fn || func.self;
      return array.reduce(function (memo, v) {
        return memo + fn(v);
      }, 0);
    };
  
    /**
     * returns a copy of the collection with array type.
     * @param {collection} collection - collection eg) node.childNodes, ...
     */
    var from = function (collection) {
      var result = [], idx = -1, length = collection.length;
      while (++idx < length) {
        result[idx] = collection[idx];
      }
      return result;
    };
  
    /**
     * cluster item by second function
     * @param {array} array - array
     * @param {function} fn - predicate function for cluster rule
     */
    var clusterBy = function (array, fn) {
      if (array.length === 0) { return []; }
      var aTail = tail(array);
      return aTail.reduce(function (memo, v) {
        var aLast = last(memo);
        if (fn(last(aLast), v)) {
          aLast[aLast.length] = v;
        } else {
          memo[memo.length] = [v];
        }
        return memo;
      }, [[head(array)]]);
    };
  
    /**
     * returns a copy of the array with all falsy values removed
     * @param {array} array - array
     * @param {function} fn - predicate function for cluster rule
     */
    var compact = function (array) {
      var aResult = [];
      for (var idx = 0, sz = array.length; idx < sz; idx ++) {
        if (array[idx]) { aResult.push(array[idx]); }
      }
      return aResult;
    };
  
    return { head: head, last: last, initial: initial, tail: tail,
             sum: sum, from: from, compact: compact, clusterBy: clusterBy };
  })();

  return list;
});
