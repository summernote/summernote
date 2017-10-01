/**
 * key.spec.js
 * (c) 2013~ Alan Hong
 * summernote may be freely distributed under the MIT license./
 */
import chai from 'chai';
import key from '../../../../src/js/base/core/key';

var expect = chai.expect;

describe('base:core.key', function () {
  describe('isEdit', function () {
    it('should return true for BACKSPACE', function () {
      expect(key.isEdit(key.code.BACKSPACE)).to.be.true;
    });
    it('should return true for DELETE', function () {
      expect(key.isEdit(key.code.DELETE)).to.be.true;
    });
  });
  describe('isMove', function () {
    it('should return true for LEFT', function () {
      expect(key.isMove(key.code.LEFT)).to.be.true;
    });
  });
});
