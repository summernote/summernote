/**
 * list.spec.js
 * (c) 2013~ Alan Hong
 * summernote may be freely distributed under the MIT license./
 */
define([
  'chai',
  'jquery',
  'summernote/base/core/list'
], function (chai, $, list) {
  'use strict';

  var expect = chai.expect;

  describe('base:core.list', function () {
    describe('head', function () {
      it('should return the first element', function () {
        expect(list.head([1, 2, 3])).to.be.equal(1);
      });
    });

    describe('last', function () {
      it('should return the last element', function () {
        expect(list.last([1, 2, 3])).to.be.equal(3);
      });
    });

    describe('initial', function () {
      it('should exclude last element', function () {
        expect(list.initial([1, 2, 3])).to.deep.equal([1, 2]);
      });
    });

    describe('tail', function () {
      it('should exclude first element', function () {
        expect(list.tail([1, 2, 3])).to.deep.equal([2, 3]);
      });
    });

    var isEven = function (num) {
      return num % 2 === 0;
    };

    describe('find', function () {
      it('should return first matched element', function () {
        expect(list.find([1, 2, 3], isEven)).to.be.equal(2);
      });
    });

    describe('all', function () {
      it('should return false if all elements are not even', function () {
        expect(list.all([1, 2, 3], isEven)).to.be.false;
      });

      it('should return true if all elements are even', function () {
        expect(list.all([2, 4], isEven)).to.be.true;
      });
    });

    describe('all', function () {
      it('should return false if the element is not contained', function () {
        expect(list.contains([1, 2, 3], 4)).to.be.false;
      });

      it('should return true if the element is contained', function () {
        expect(list.contains([1, 2, 4], 4)).to.be.true;
      });
    });

    describe('sum', function () {
      it('should return sum of all elements', function () {
        expect(list.sum([1, 2, 3])).to.be.equal(6);
      });

      it('should return sum of all elements iterated', function () {
        var result = list.sum([1, 2, 3], function (v) { return v * 2; });
        expect(result).to.be.equal(12);
      });
    });

    describe('from', function () {
      it('should return an array of childNodes', function () {
        var $cont, $b, $u, $s, $i;
        $cont = $('<div><b>b</b><u>u</u><s>s</s><i>i</i></div>'); //busi
        $b = $cont.find('b');
        $u = $cont.find('u');
        $s = $cont.find('s');
        $i = $cont.find('i');

        expect(list.from($cont[0].childNodes)).to.deep.equal([$b[0], $u[0], $s[0], $i[0]]);
      });
    });

    describe('clusterBy', function () {
      it('should cluster by equality 1', function () {
        var aaClustered = list.clusterBy([1, 1, 2, 2, 3], function (itemA, itemB) {
          return itemA === itemB;
        });
        expect(aaClustered).to.deep.equal([[1, 1], [2, 2], [3]]);
      });

      it('should cluster by equality 2', function () {
        var aaClustered = list.clusterBy([1, 2, 2, 1, 3], function (itemA, itemB) {
          return itemA === itemB;
        });
        expect(aaClustered).to.deep.equal([[1], [2, 2], [1], [3]]);
      });
    });

    describe('compact', function () {
      it('should remove all elements has false value', function () {
        expect(list.compact([0, 1, false, 2, '', 3])).to.deep.equal([1, 2, 3]);
      });
    });

    describe('unique', function () {
      it('should return duplicate-free version of array', function () {
        expect(list.unique([1, 2, 3, 3, 2, 1])).to.deep.equal([1, 2, 3]);
      });
    });
  });
});
