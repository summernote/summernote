/**
 * dom.spec.js
 * (c) 2013~ Alan Hong
 * summernote may be freely distributed under the MIT license./
 */
define([
  'chai',
  'summernote/base/core/func'
], function (chai, func) {
  'use strict';

  var expect = chai.expect;

  describe('core.func', function () {
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
