/**
 * key.spec.js
 * (c) 2013~ Alan Hong
 * summernote may be freely distributed under the MIT license./
 */
import chai from 'chai';
import { isEdit, isMove, KEY_MAP } from '../../../src/js/base/core/key';

var expect = chai.expect;

describe('base:core.key', () => {
  describe('isEdit', () => {
    it('should return true for BACKSPACE', () => {
      expect(isEdit(KEY_MAP.BACKSPACE)).to.be.true;
    });
    it('should return true for DELETE', () => {
      expect(isEdit(KEY_MAP.DELETE)).to.be.true;
    });
  });

  describe('isMove', () => {
    it('should return true for LEFT', () => {
      expect(isMove(KEY_MAP.LEFT)).to.be.true;
    });
  });
});
