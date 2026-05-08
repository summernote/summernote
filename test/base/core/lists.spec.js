import { describe, it, expect } from 'vitest';
import $$ from '@/js/core/dom-query.js';
import lists from '@/js/core/lists';

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

    it('should use a contains method when indexOf is unavailable', () => {
      const collection = {
        length: 1,
        contains: (value) => value === 'checked',
      };

      expect(lists.contains(collection, 'checked')).to.be.true;
    });

    it('should return false for falsy collections or items', () => {
      expect(lists.contains(null, 'checked')).to.be.false;
      expect(lists.contains(['checked'], '')).to.be.false;
    });

    it('should return false when neither indexOf nor contains is available', () => {
      expect(lists.contains({ length: 1 }, 'checked')).to.be.false;
    });
  });

  describe('sum', () => {
    it('should return sum of all elements', () => {
      expect(lists.sum([1, 2, 3])).to.be.equal(6);
    });

    it('should return sum of all elements iterated', () => {
      var result = lists.sum([1, 2, 3], (v) => {
        return v * 2;
      });
      expect(result).to.be.equal(12);
    });
  });

  describe('from', () => {
    it('should return an array of childNodes', () => {
      var $cont, $b, $u, $s, $i;
      $cont = $$('<div><b>b</b><u>u</u><s>s</s><i>i</i></div>'); // busi
      $b = $cont.find('b');
      $u = $cont.find('u');
      $s = $cont.find('s');
      $i = $cont.find('i');

      expect(lists.from($cont[0].childNodes)).to.deep.equal([$b[0], $u[0], $s[0], $i[0]]);
    });
  });

  describe('clusterBy', () => {
    it('should return an empty array for empty input', () => {
      expect(lists.clusterBy([], () => true)).to.deep.equal([]);
    });

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

  describe('isEmpty', () => {
    it('should detect empty collections', () => {
      expect(lists.isEmpty([])).to.be.true;
      expect(lists.isEmpty(null)).to.be.true;
      expect(lists.isEmpty([1])).to.be.false;
    });
  });

  describe('next', () => {
    it('should return the next item or null when not available', () => {
      expect(lists.next(['a', 'b', 'c'], 'b')).to.equal('c');
      expect(lists.next(['a', 'b', 'c'], 'missing')).to.be.null;
      expect(lists.next(['a'], 'a')).to.equal(undefined);
      expect(lists.next(null, 'a')).to.be.null;
    });
  });

  describe('prev', () => {
    it('should return the previous item or null when not available', () => {
      expect(lists.prev(['a', 'b', 'c'], 'b')).to.equal('a');
      expect(lists.prev(['a', 'b', 'c'], 'missing')).to.be.null;
      expect(lists.prev(['a'], 'a')).to.equal(undefined);
      expect(lists.prev(null, 'a')).to.be.null;
    });
  });
});
