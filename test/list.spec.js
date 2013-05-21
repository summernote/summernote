/**
 * list.spec.js
 * (c) 2013~ Youngteac Hong
 * summernote may be freely distributed under the MIT license./
 */
var list = $.fn.summernoteInner().list;

test('list.compact', function() {
  deepEqual(list.compact([0, 1, false, 2, '', 3]), [1,2,3],
            'falsey values of `array` removed');
});

test('list.clusterBy', function() {
  var aaClustered = list.clusterBy([1, 1, 2, 2, 3], function(itemA, itemB) {
    return itemA === itemB;
  });
  deepEqual([[1, 1], [2, 2], [3]], aaClustered, 'clusterBy equality 1');
  
  var aaClustered = list.clusterBy([1, 2, 2, 1, 3], function(itemA, itemB) {
    return itemA === itemB;
  });
  deepEqual([[1], [2, 2], [1], [3]], aaClustered, 'clusterBy equality 2');
});
