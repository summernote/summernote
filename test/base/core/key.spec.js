import { describe, it, expect } from 'vitest';
import key from '@/js/core/key';

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
