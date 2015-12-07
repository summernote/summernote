/**
 * key.spec.js
 * (c) 2013~ Alan Hong
 * summernote may be freely distributed under the MIT license./
 */
define([
  'chai',
  'summernote/base/core/key'
], function (chai, key) {
  'use strict';

  var expect = chai.expect;

  describe('base:core.key', function () {
    describe('isEdit', function () {
      it('should return true for BACKSPACE', function () {
        expect(key.isEdit(key.code.BACKSPACE)).to.be.true;
      });
    });
    describe('isMove', function () {
      it('should return true for LEFT', function () {
        expect(key.isMove(key.code.LEFT)).to.be.true;
      });
    });
  });
});
