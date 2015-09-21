/**
 * dom.spec.js
 * (c) 2013~ Alan Hong
 * summernote may be freely distributed under the MIT license./
 */
define([
  'summernote/base/core/key'
], function (key) {
  return function () {
    test('key.isEdit', function () {
      ok(key.isEdit(key.code.BACKSPACE), 'isEdit with BACKSPACE should returns true');
    });

    test('key.isMove', function () {
      ok(key.isMove(key.code.LEFT), 'isEdit with LEFT should returns true');
    });
  };
});
