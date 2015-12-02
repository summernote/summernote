/**
 * dom.spec.js
 * (c) 2013~ Alan Hong
 * summernote may be freely distributed under the MIT license./
 */
define([
  'summernote/base/core/func'
], function (func) {
  return function () {
    test('func.eq2', function () {
      ok(func.eq2(1, 1), 'should return true');
      ok(!func.eq2(1, '1'), 'should return false');
    });

    test('func.peq2', function () {
      ok(func.peq2('prop')({
        prop: 'hello'
      }, {
        prop: 'hello'
      }), 'should return true');

      ok(!func.peq2('prop')({
        prop: 'hello'
      }, {
        prop: 'world'
      }), 'should return false');
    });

    test('func.uniqueId', function () {
      equal(func.uniqueId('note-'), 'note-1', 'should returns uniqueId with prefix');
      equal(func.uniqueId('note-'), 'note-2', 'should returns uniqueId with prefix');
      equal(func.uniqueId('note-'), 'note-3', 'should returns uniqueId with prefix');
    });

    test('func.invertObject', function () {
      deepEqual(func.invertObject({
        keyA: 'valueA',
        keyB: 'valueB'
      }), {
        valueA: 'keyA',
        valueB: 'keyB'
      }, 'should returns inverted object');
    });

    test('func.namespaceToCamel', function () {
      equal(
        func.namespaceToCamel('upload.image'),
        'UploadImage',
        'should returns camel text'
      );

      equal(
        func.namespaceToCamel('upload.image', 'summernote'),
        'summernoteUploadImage',
        'should returns camel text with prefix'
      );
    });
  };
});
