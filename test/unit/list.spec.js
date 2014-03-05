/**
 * list.spec.js
 * (c) 2013~ Alan Hong
 * summernote may be freely distributed under the MIT license./
 */
define(['jquery', 'summernote/core/list'], function ($, list) {
  return function () {
    test('list.head', function () {
      deepEqual(list.head([1, 2, 3]), 1, 'should return the first element');
    });

    test('list.last', function () {
      deepEqual(list.last([1, 2, 3]), 3, 'should return the last element');
    });

    test('list.initial', function () {
      deepEqual(list.initial([1, 2, 3]), [1, 2], 'should exclude last element');
    });

    test('list.tail', function () {
      deepEqual(list.tail([1, 2, 3]), [2, 3], 'should exclude first element');
    });

    test('list.sum', function () {
      deepEqual(list.sum([1, 2, 3]), 6, 'should return 6');
      deepEqual(list.sum([1, 2, 3], function (v) { return v * 2; }), 12, 'should return 12');
    });

    test('list.from', function () {
      var $cont, $b, $u, $s, $i;
      $cont = $('<div><b>b</b><u>u</u><s>s</s><i>i</i></div>'); //busi
      $b = $cont.find('b');
      $u = $cont.find('u');
      $s = $cont.find('s');
      $i = $cont.find('i');

      deepEqual(list.from($cont[0].childNodes),
                [$b[0], $u[0], $s[0], $i[0]], 'should return array of childNodes');
    });

    test('list.clusterBy', function () {
      var aaClustered = list.clusterBy([1, 1, 2, 2, 3], function (itemA, itemB) {
        return itemA === itemB;
      });
      deepEqual([[1, 1], [2, 2], [3]], aaClustered, 'should cluster by equality 1');

      aaClustered = list.clusterBy([1, 2, 2, 1, 3], function (itemA, itemB) {
        return itemA === itemB;
      });
      deepEqual([[1], [2, 2], [1], [3]], aaClustered, 'should cluster by equality 2');
    });

    test('list.compact', function () {
      deepEqual(list.compact([0, 1, false, 2, '', 3]), [1, 2, 3], 'falsey values of `array` removed');
    });
  };
});
