/**
 * func.spec.js
 * (c) 2013~ Alan Hong
 * summernote may be freely distributed under the MIT license./
 */
define([
  'chai',
  'summernote/base/core/func'
], function (chai, func) {
  'use strict';

  var expect = chai.expect;

  describe('base:core.func', function () {
    describe('eq', function () {
      it('should return true if two values are same', function () {
        expect(func.eq(1)(1)).to.be.ok;
      });
    });

    describe('eq2', function () {
      it('should return true if two values are same', function () {
        expect(func.eq2(1, 1)).to.be.ok;
      });

      it('should return false if two values are not same', function () {
        expect(func.eq2(1, '1')).to.be.not.ok;
      });
    });

    describe('peq2', function () {
      it('should return true when two properties are same', function () {
        expect(func.peq2('prop')({ prop: 'hello' }, { prop: 'hello' })).to.be.ok;
      });

      it('should return false when two properties are not same', function () {
        expect(func.peq2('prop')({ prop: 'hello' }, { prop: 'world' })).to.be.not.ok;
      });
    });

    describe('ok', function () {
      it('should return true', function () {
        expect(func.ok()).to.be.ok;
      });
    });

    describe('fail', function () {
      it('should return false', function () {
        expect(func.fail()).to.be.not.ok;
      });
    });

    describe('not', function () {
      it('should return opposite function', function () {
        expect(func.not(func.ok)()).to.be.not.ok;
        expect(func.not(func.fail)()).to.be.ok;
      });
    });

    describe('and', function () {
      it('should return composite function', function () {
        expect(func.and(func.ok, func.ok)()).to.be.ok;
        expect(func.and(func.fail, func.ok)()).to.be.not.ok;
        expect(func.and(func.fail, func.fail)()).to.be.not.ok;
      });
    });

    describe('invoke', function () {
      it('should return function which invoke the method', function () {
        expect(func.invoke(func, 'ok')()).to.be.ok;
        expect(func.invoke(func, 'fail')()).to.be.not.ok;
      });
    });

    describe('uniqueId', function () {
      it('should return uniqueId with the prefix as a parameter', function () {
        expect(func.uniqueId('note-')).to.be.equal('note-1');
        expect(func.uniqueId('note-')).to.be.equal('note-2');
        expect(func.uniqueId('note-')).to.be.equal('note-3');
      });
    });

    describe('invertObject', function () {
      it('should return inverted object between keys and values', function () {
        expect(func.invertObject({ keyA: 'valueA', keyB: 'valueB' }))
                  .to.deep.equal({ valueA: 'keyA', valueB: 'keyB'});
      });
    });

    describe('namespaceToCamel', function () {
      it('should return camelcase text', function () {
        expect(func.namespaceToCamel('upload.image')).to.be.equal('UploadImage');
      });

      it('should return prefixed camelcase text', function () {
        expect(func.namespaceToCamel('upload.image', 'summernote')).to.be.equal('summernoteUploadImage');
      });
    });
  });
});
