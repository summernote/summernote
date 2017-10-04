/**
 * lists.spec.js
 * (c) 2013~ Alan Hong
 * summernote may be freely distributed under the MIT license./
 */
import chai from 'chai';
import $ from 'jquery';
import lists from '../../../../src/js/base/core/lists';

var expect = chai.expect;

describe('base:core.lists', () => {
  describe('head', () => {
    it('should return the first element', () => {
      expect(lists.head([1, 2, 3])).to.be.equal(1);
    });
  });

  describe('last', () => {
    it('should return the last element', () => {
      expect(lists.last([1, 2, 3])).to.be.equal(3);
    });
  });

  describe('initial', () => {
    it('should exclude last element', () => {
      expect(lists.initial([1, 2, 3])).to.deep.equal([1, 2]);
    });
  });

  describe('tail', () => {
    it('should exclude first element', () => {
      expect(lists.tail([1, 2, 3])).to.deep.equal([2, 3]);
    });
  });

  function isEven(num) {
    return num % 2 === 0;
  }

  describe('find', () => {
    it('should return first matched element', () => {
      expect(lists.find([1, 2, 3], isEven)).to.be.equal(2);
    });
  });

  describe('all', () => {
    it('should return false if all elements are not even', () => {
      expect(lists.all([1, 2, 3], isEven)).to.be.false;
    });

    it('should return true if all elements are even', () => {
      expect(lists.all([2, 4], isEven)).to.be.true;
    });
  });

  describe('all', () => {
    it('should return false if the element is not contained', () => {
      expect(lists.contains([1, 2, 3], 4)).to.be.false;
    });

    it('should return true if the element is contained', () => {
      expect(lists.contains([1, 2, 4], 4)).to.be.true;
    });
  });

  describe('sum', () => {
    it('should return sum of all elements', () => {
      expect(lists.sum([1, 2, 3])).to.be.equal(6);
    });

    it('should return sum of all elements iterated', () => {
      var result = lists.sum([1, 2, 3], (v) => { return v * 2; });
      expect(result).to.be.equal(12);
    });
  });

  describe('from', () => {
    it('should return an array of childNodes', () => {
      var $cont, $b, $u, $s, $i;
      $cont = $('<div><b>b</b><u>u</u><s>s</s><i>i</i></div>'); // busi
      $b = $cont.find('b');
      $u = $cont.find('u');
      $s = $cont.find('s');
      $i = $cont.find('i');

      expect(lists.from($cont[0].childNodes)).to.deep.equal([$b[0], $u[0], $s[0], $i[0]]);
    });
  });

  describe('clusterBy', () => {
    it('should cluster by equality 1', () => {
      var aaClustered = lists.clusterBy([1, 1, 2, 2, 3], (itemA, itemB) => {
        return itemA === itemB;
      });
      expect(aaClustered).to.deep.equal([[1, 1], [2, 2], [3]]);
    });

    it('should cluster by equality 2', () => {
      var aaClustered = lists.clusterBy([1, 2, 2, 1, 3], (itemA, itemB) => {
        return itemA === itemB;
      });
      expect(aaClustered).to.deep.equal([[1], [2, 2], [1], [3]]);
    });
  });

  describe('compact', () => {
    it('should remove all elements has false value', () => {
      expect(lists.compact([0, 1, false, 2, '', 3])).to.deep.equal([1, 2, 3]);
    });
  });

  describe('unique', () => {
    it('should return duplicate-free version of array', () => {
      expect(lists.unique([1, 2, 3, 3, 2, 1])).to.deep.equal([1, 2, 3]);
    });
  });
});
