/**
 * dom.spec.js
 * (c) 2013~ Alan Hong
 * summernote may be freely distributed under the MIT license./
 */
define([
  'chai',
  'chaidom',
  'jquery',
  'summernote/base/core/dom',
  'summernote/base/core/func'
], function (chai, chaidom, $, dom, func) {
  'use strict';

  var expect = chai.expect;
  chai.use(chaidom);

  describe('base:core.dom', function () {
    describe('ancestor', function () {
      var $cont, $b, txtB;
      before(function () {
        // basic case
        $cont = $('<div class="note-editable"><b>b</b><u>u</u><s>s</s><i>i</i></div>'); //busi
        $b = $cont.find('b');
        txtB = $b[0].firstChild;
      });

      it('should find ancestor B', function () {
        expect(dom.ancestor(txtB, dom.isB)).to.deep.equal($b[0]);
      });

      it('should find ancestor DIV', function () {
        expect(dom.ancestor(txtB, dom.isDiv)).to.deep.equal($cont[0]);
      });

      it('should return null when finding ancestor U does not exist', function () {
        expect(dom.ancestor(txtB, dom.isU)).to.be.null;
      });

      it('should return null when finding paragraph ancestor outsider note-editable', function () {
        expect(dom.ancestor(txtB, dom.isLi)).to.be.null;
      });
    });

    describe('listAncestor', function () {
      var $cont, $b, $u, $s, $i;
      before(function () {
        $cont = $('<div class="note-editable"><i><s><u><b>b</b></u></s></i></div>'); //busi
        $b = $cont.find('b');
        $u = $cont.find('u');
        $s = $cont.find('s');
        $i = $cont.find('i');
      });

      it('should return [$b, $u, $s, $i] from b to i', function () {
        var result = dom.listAncestor($b[0], function (node) { return node === $i[0]; });
        expect(result).to.deep.equal([$b[0], $u[0], $s[0], $i[0]]);
      });

      it('should return [$u, $s] from u to s', function () {
        var result = dom.listAncestor($u[0], function (node) { return node === $s[0]; });
        expect(result).to.deep.equal([$u[0], $s[0]]);
      });
    });

    describe('listDescendant', function () {
      var $cont, $b, $u, $s, $i;
      before(function () {
        $cont = $('<div class="note-editable"><b></b><u></u><s></s><i></i></div>'); //busi
        $b = $cont.find('b');
        $u = $cont.find('u');
        $s = $cont.find('s');
        $i = $cont.find('i');
      });

      it('should return an array of descendant elements', function () {
        expect(dom.listDescendant($cont[0])).to.deep.equal([$b[0], $u[0], $s[0], $i[0]]);
      });

      it('should filter an array of descendant elements', function () {
        var result = dom.listDescendant($cont[0], function (node) {
          return node.nodeName === 'B' || node.nodeName === 'S';
        });
        expect(result).to.deep.equal([$b[0], $s[0]]);
      });
    });

    describe('commonAncestor', function () {
      var $cont, $span, $div, $b, $u, $s, $i;
      before(function () {
        $cont = $('<div class="note-editable"><div><span><b>b</b><u>u</u></span><span><s>s</s><i>i</i></span></div></div>');
        $span = $cont.find('span');
        $div = $cont.find('div');
        $b = $cont.find('b');
        $u = $cont.find('u');
        $s = $cont.find('s');
        $i = $cont.find('i');
      });

      it('should return a common element in ancestors', function () {
        expect(dom.commonAncestor($b[0], $u[0])).to.deep.equal($span[0]);
      });

      it('should return a common element in ancestors even if they have same nodeName', function () {
        expect(dom.commonAncestor($b[0], $s[0])).to.deep.equal($div[0]);
      });
    });

    describe('listNext', function () {
      var $cont, $b, $u, $s, $i;
      before(function () {
        $cont = $('<div class="note-editable"><b>b</b><u>u</u><s>s</s><i>i</i></div>'); //busi
        $b = $cont.find('b');
        $u = $cont.find('u');
        $s = $cont.find('s');
        $i = $cont.find('i');
      });

      it('should return an array of next sibling elements including itself', function () {
        expect(dom.listNext($u[0])).to.deep.equal([$u[0], $s[0], $i[0]]);
      });

      it('should return itself if there are no next sibling', function () {
        expect(dom.listNext($i[0])).to.deep.equal([$i[0]]);
      });

      it('should return an array of next sibling elements before predicate is true', function () {
        expect(dom.listNext($s[0], func.eq($i[0]))).to.deep.equal([$s[0]]);
      });
    });

    describe('listPrev', function () {
      var $cont, $b, $u, $s, $i;
      before(function () {
        $cont = $('<div class="note-editable"><b>b</b><u>u</u><s>s</s><i>i</i></div>'); //busi
        $b = $cont.find('b');
        $u = $cont.find('u');
        $s = $cont.find('s');
        $i = $cont.find('i');
      });

      it('should return an array of previous sibling elements including itself', function () {
        expect(dom.listPrev($s[0])).to.deep.equal([$s[0], $u[0], $b[0]]);
      });

      it('should return itself if there are no previous sibling', function () {
        expect(dom.listPrev($b[0])).to.deep.equal([$b[0]]);
      });

      it('should return an array of previous sibling elements before predicate is true', function () {
        expect(dom.listPrev($i[0], func.eq($s[0]))).to.deep.equal([$i[0]]);
      });
    });

    describe('position', function () {
      var $cont, $b, $u, $s, $i;
      before(function () {
        $cont = $('<div class="note-editable"><b>b</b><u>u</u><s>s</s><i>i</i></div>'); //busi
        $b = $cont.find('b');
        $u = $cont.find('u');
        $s = $cont.find('s');
        $i = $cont.find('i');
      });

      it('should return the position of element', function () {
        expect(dom.position($b[0])).to.be.equal(0);
        expect(dom.position($u[0])).to.be.equal(1);
        expect(dom.position($s[0])).to.be.equal(2);
        expect(dom.position($i[0])).to.be.equal(3);
      });

      it('should return position 0 for text node in b', function () {
        expect(dom.position($b[0].firstChild)).to.be.equal(0);
      });
    });

    describe('makeOffsetPath', function () {
      var $cont, $b, $u, $s, $i;
      before(function () {
        $cont = $('<div class="note-editable"><b>b</b><u>u</u><s>s</s><i>i</i></div>'); //busi
        $b = $cont.find('b');
        $u = $cont.find('u');
        $s = $cont.find('s');
        $i = $cont.find('i');
      });

      it('should return empty array if two elements are same', function () {
        expect(dom.makeOffsetPath($cont[0], $cont[0])).to.deep.equal([]);
      });

      it('should return offset path array between two elements #1', function () {
        expect(dom.makeOffsetPath($cont[0], $b[0])).to.deep.equal([0]);
        expect(dom.makeOffsetPath($cont[0], $b[0].firstChild)).to.deep.equal([0, 0]);
      });

      it('should return offset path array between two elements #2', function () {
        expect(dom.makeOffsetPath($cont[0], $u[0])).to.deep.equal([1]);
        expect(dom.makeOffsetPath($cont[0], $u[0].firstChild)).to.deep.equal([1, 0]);
      });

      it('should return offset path array between two elements #3', function () {
        expect(dom.makeOffsetPath($cont[0], $s[0])).to.deep.equal([2]);
        expect(dom.makeOffsetPath($cont[0], $s[0].firstChild)).to.deep.equal([2, 0]);
      });

      it('should return offset path array between two elements #2', function () {
        expect(dom.makeOffsetPath($cont[0], $i[0])).to.deep.equal([3]);
        expect(dom.makeOffsetPath($cont[0], $i[0].firstChild)).to.deep.equal([3, 0]);
      });
    });

    describe('fromOffsetPath', function () {
      var $cont, $b, $u, $s, $i;
      before(function () {
        $cont = $('<div class="note-editable"><b>b</b><u>u</u><s>s</s><i>i</i></div>'); //busi
        $b = $cont.find('b');
        $u = $cont.find('u');
        $s = $cont.find('s');
        $i = $cont.find('i');
      });

      it('should return the element by offsetPath', function () {
        var cont = $cont[0];
        $.each([$b[0], $u[0], $s[0], $i[0]], function (idx, node) {
          expect(dom.fromOffsetPath(cont, dom.makeOffsetPath(cont, node))).to.deep.equal(node);
          var child = node.firstChild;
          expect(dom.fromOffsetPath(cont, dom.makeOffsetPath(cont, child))).to.deep.equal(child);
        });
      });
    });

    describe('splitTree', function () {
      var $para;
      beforeEach(function () {
        var $busi = $('<div class="note-editable"><p><b>b</b><u>u</u><s>strike</s><i>i</i></p></div>'); //busi
        $para = $busi.clone().find('p');
      });

      describe('element pivot case', function () {
        it('should be split by u tag with offset 0', function () {
          var $u = $para.find('u');
          dom.splitTree($para[0], {node: $u[0], offset: 0 });

          expect($para.html()).to.equalsIgnoreCase('<b>b</b><u><br></u>');
          expect($para.next().html()).to.equalsIgnoreCase('<u>u</u><s>strike</s><i>i</i>');
        });

        it('should be split by u tag with offset 1', function () {
          var $u = $para.find('u');
          dom.splitTree($para[0], {node: $u[0], offset: 1 });

          expect($para.html()).to.equalsIgnoreCase('<b>b</b><u>u</u>');
          expect($para.next().html()).to.equalsIgnoreCase('<u><br></u><s>strike</s><i>i</i>');
        });

        it('should be split by b tag with offset 0 (left edge case)', function () {
          var $b = $para.find('b');
          dom.splitTree($para[0], {node: $b[0], offset: 0 });

          expect($para.html()).to.equalsIgnoreCase('<b><br></b>');
          expect($para.next().html()).to.equalsIgnoreCase('<b>b</b><u>u</u><s>strike</s><i>i</i>');
        });

        it('should be split by i tag with offset 1 (right edge case)', function () {
          var $i = $para.find('i');
          dom.splitTree($para[0], {node: $i[0], offset: 1 });

          expect($para.html()).to.equalsIgnoreCase('<b>b</b><u>u</u><s>strike</s><i>i</i>');
          expect($para.next().html()).to.equalsIgnoreCase('<i><br></i>');
        });
      });

      describe('textNode case', function () {
        it('should be split by s tag with offset 3 (middle case)', function () {
          var $s = $para.find('s');
          dom.splitTree($para[0], {node: $s[0].firstChild, offset: 3 });

          expect($para.html()).to.equalsIgnoreCase('<b>b</b><u>u</u><s>str</s>');
          expect($para.next().html()).to.equalsIgnoreCase('<s>ike</s><i>i</i>');
        });

        it('should be split by s tag with offset 0 (left edge case)', function () {
          var $s = $para.find('s');
          dom.splitTree($para[0], {node: $s[0].firstChild, offset: 0 });

          expect($para.html()).to.equalsIgnoreCase('<b>b</b><u>u</u><s><br></s>');
          expect($para.next().html()).to.equalsIgnoreCase('<s>strike</s><i>i</i>');
        });

        it('should be split by s tag with offset 6 (right edge case)', function () {
          var $s = $para.find('s');
          dom.splitTree($para[0], {node: $s[0].firstChild, offset: 6 });

          expect($para.html()).to.equalsIgnoreCase('<b>b</b><u>u</u><s>strike</s>');
          expect($para.next().html()).to.equalsIgnoreCase('<s><br></s><i>i</i>');
        });

        it('should be split by s tag with offset 3 (2 depth case)', function () {
          var $s = $para.find('s');
          dom.splitTree($s[0], {node: $s[0].firstChild, offset: 3 });

          expect($para.html()).to.equalsIgnoreCase('<b>b</b><u>u</u><s>str</s><s>ike</s><i>i</i>');
        });

        it('should be split by s tag with offset 3 (1 depth and textNode case)', function () {
          var $s = $para.find('s');
          dom.splitTree($s[0].firstChild, {node: $s[0].firstChild, offset: 3 });

          expect($para.html()).to.equalsIgnoreCase('<b>b</b><u>u</u><s>strike</s><i>i</i>');
        });

        it('should be split by span tag with offset 2 (1 depth and element case)', function () {
          var $cont = $('<div class="note-editable"><p><span><b>b</b><u>u</u><s>s</s><i>i</i></span></p></div>'); //busi
          var $span = $cont.find('span');
          dom.splitTree($span[0], {node: $span[0], offset: 2 });

          expect($cont.html()).to.equalsIgnoreCase('<p><span><b>b</b><u>u</u></span><span><s>s</s><i>i</i></span></p>');
        });
      });
    });

    describe('splitPoint', function () {
      it('should return rightNode and container for empty paragraph with inline', function () {
        var $editable = $('<div class="note-editable"><p><br></p></div>');
        var $para = $editable.clone().find('p');
        var $br = $para.find('br');

        var result = dom.splitPoint({ node: $para[0], offset: 0 }, true);
        expect(result).to.deep.equal({ rightNode: $br[0], container: $para[0] });

      });
    });
  });
});
