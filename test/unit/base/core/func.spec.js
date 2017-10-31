/**
 * func.spec.js
 * (c) 2013~ Alan Hong
 * summernote may be freely distributed under the MIT license./
 */
import chai from 'chai';
import func from '../../../../src/js/base/core/func';

var expect = chai.expect;

describe('base:core.func', () => {
  describe('eq', () => {
    it('should return true if two values are same', () => {
      expect(func.eq(1)(1)).to.be.ok;
    });
  });

  describe('eq2', () => {
    it('should return true if two values are same', () => {
      expect(func.eq2(1, 1)).to.be.ok;
    });

    it('should return false if two values are not same', () => {
      expect(func.eq2(1, '1')).to.be.not.ok;
    });
  });

  describe('peq2', () => {
    it('should return true when two properties are same', () => {
      expect(func.peq2('prop')({ prop: 'hello' }, { prop: 'hello' })).to.be.ok;
    });

    it('should return false when two properties are not same', () => {
      expect(func.peq2('prop')({ prop: 'hello' }, { prop: 'world' })).to.be.not.ok;
    });
  });

  describe('ok', () => {
    it('should return true', () => {
      expect(func.ok()).to.be.ok;
    });
  });

  describe('fail', () => {
    it('should return false', () => {
      expect(func.fail()).to.be.not.ok;
    });
  });

  describe('not', () => {
    it('should return opposite function', () => {
      expect(func.not(func.ok)()).to.be.not.ok;
      expect(func.not(func.fail)()).to.be.ok;
    });
  });

  describe('and', () => {
    it('should return composite function', () => {
      expect(func.and(func.ok, func.ok)()).to.be.ok;
      expect(func.and(func.fail, func.ok)()).to.be.not.ok;
      expect(func.and(func.fail, func.fail)()).to.be.not.ok;
    });
  });

  describe('invoke', () => {
    it('should return function which invoke the method', () => {
      expect(func.invoke(func, 'ok')()).to.be.ok;
      expect(func.invoke(func, 'fail')()).to.be.not.ok;
    });
  });

  describe('uniqueId', () => {
    it('should return uniqueId with the prefix as a parameter', () => {
      expect(func.uniqueId('note-')).to.be.equal('note-1');
      expect(func.uniqueId('note-')).to.be.equal('note-2');
      expect(func.uniqueId('note-')).to.be.equal('note-3');
    });
  });

  describe('invertObject', () => {
    it('should return inverted object between keys and values', () => {
      expect(func.invertObject({ keyA: 'valueA', keyB: 'valueB' }))
        .to.deep.equal({ valueA: 'keyA', valueB: 'keyB' });
    });
  });

  describe('namespaceToCamel', () => {
    it('should return camelcase text', () => {
      expect(func.namespaceToCamel('upload.image')).to.be.equal('UploadImage');
    });

    it('should return prefixed camelcase text', () => {
      expect(func.namespaceToCamel('upload.image', 'summernote')).to.be.equal('summernoteUploadImage');
    });
  });

  describe('debounce', () => {
    it('shouldnt execute immediately', () => {
      var hasHappened = false;
      var fn = func.debounce(() => {
        hasHappened = true;
      }, 100);

      expect(hasHappened).to.be.false;
      fn();
      expect(hasHappened).to.be.false;
    });

    it('should execute after delay', (done) => {
      var hasHappened = false;
      var fn = func.debounce(() => {
        hasHappened = true;
      }, 100);

      fn();

      setTimeout(() => {
        expect(hasHappened).to.be.true;
        done();
      }, 101);
    });

    it('should only happen once', (done) => {
      var count = 0;
      var fn = func.debounce(() => {
        count += 1;
      }, 100);

      fn();
      fn();
      fn();

      setTimeout(() => {
        expect(count).to.be.equal(1);
        done();
      }, 101);
    });
  });
});
