/**
 * Style.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */

import chai from 'chai';
import $ from 'jquery';
import range from 'src/js/base/core/range';
import Style from 'src/js/base/editing/Style';

var expect = chai.expect;

describe('base:editing.Style', () => {
  var style = new Style();

  describe('styleNodes', () => {
    it('should wrap selected text with span', () => {
      var $cont = $('<div class="note-editable"><p>text</p></div>');
      var $p = $cont.find('p');
      var rng = range.create($p[0].firstChild, 0, $p[0].firstChild, 4);
      style.styleNodes(rng);

      expect($cont.html()).to.deep.equal('<p><span>text</span></p>');
    });

    it('should split text and wrap selected text with span', () => {
      var $cont = $('<div class="note-editable"><p>text</p></div>');
      var $p = $cont.find('p');
      var rng = range.create($p[0].firstChild, 1, $p[0].firstChild, 3);
      style.styleNodes(rng);

      expect($cont.html()).to.deep.equal('<p>t<span>ex</span>t</p>');
    });

    it('should split text and insert span', () => {
      var $cont = $('<div class="note-editable"><p>text</p></div>');
      var $p = $cont.find('p');
      var rng = range.create($p[0].firstChild, 2, $p[0].firstChild, 2);
      style.styleNodes(rng);

      expect($cont.html()).to.deep.equal('<p>te<span></span>xt</p>');
    });

    it('should just return a parent span', () => {
      var $cont = $('<div class="note-editable"><p><span>text</span></p></div>');
      var $span = $cont.find('span');
      var rng = range.create($span[0].firstChild, 0, $span[0].firstChild, 4);
      style.styleNodes(rng);

      expect($cont.html()).to.deep.equal('<p><span>text</span></p>');
    });

    it('should wrap each texts with span', () => {
      var $cont = $('<div class="note-editable"><p><b>bold</b><span>span</span></p></div>');
      var $b = $cont.find('b');
      var $span = $cont.find('span');
      var rng = range.create($b[0].firstChild, 2, $span[0].firstChild, 2);
      style.styleNodes(rng);

      expect($cont.html()).to.deep.equal('<p><b>bo<span>ld</span></b><span><span>sp</span>an</span></p>');
    });

    it('should wrap each texts with span except not a single blood line', () => {
      var $cont = $('<div class="note-editable"><p><b>bold</b><span>span</span></p></div>');
      var $b = $cont.find('b');
      var $span = $cont.find('span');
      var rng = range.create($b[0].firstChild, 2, $span[0].firstChild, 4);
      style.styleNodes(rng);

      expect($cont.html()).to.deep.equal('<p><b>bo<span>ld</span></b><span>span</span></p>');
    });

    it('should expand b tag when providing the expandClosestSibling option', () => {
      var $cont = $('<div class="note-editable"><p>text<b>bold</b></p></div>');
      var $p = $cont.find('p');
      var rng = range.create($p[0].firstChild, 0, $p[0].firstChild, 4);
      style.styleNodes(rng, { nodeName: 'B', expandClosestSibling: true });

      expect($cont.html()).to.deep.equal('<p><b>textbold</b></p>');
    });

    it('should not expand b tag when providing the onlyPartialContains option', () => {
      var $cont = $('<div class="note-editable"><p>text<b>bold</b></p></div>');
      var $p = $cont.find('p');
      var rng = range.create($p[0].firstChild, 0, $p[0].firstChild, 4);
      style.styleNodes(rng, { nodeName: 'B', expandClosestSibling: true, onlyPartialContains: true });

      expect($cont.html()).to.deep.equal('<p><b>text</b><b>bold</b></p>');
    });
  });
});
