/**
 * key.spec.js
 * (c) 2013~ Alan Hong
 * summernote may be freely distributed under the MIT license./
 */
import chai from 'chai';
import key from 'src/js/core/key';

var expect = chai.expect;

describe('base:core.key', () => {
  describe('isEdit', () => {
    it('should return true for BACKSPACE', () => {
      expect(key.isEdit(key.code.BACKSPACE)).to.be.true;
    });
    it('should return true for DELETE', () => {
      expect(key.isEdit(key.code.DELETE)).to.be.true;
    });
  });
  describe('isMove', () => {
    it('should return true for LEFT', () => {
      expect(key.isMove(key.code.LEFT)).to.be.true;
    });
  });
});
