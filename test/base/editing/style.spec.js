/**
 * Style.spec.js
 * (c) 2015-present Summernote Team
 * (c) 2026-present Jürgen Schwind
 * Summernote Next may be freely distributed under the MIT license.
 */
import { afterEach, describe, it, expect, vi } from 'vitest';
import $$ from '@/js/core/dom-query.js';
import range from '@/js/core/range';
import Style from '@/js/editing/Style';

describe('base:editing.Style', () => {
  var style = new Style();
  var originalQueryCommandState = document.queryCommandState;
  var originalQueryCommandValue = document.queryCommandValue;

  afterEach(() => {
    document.queryCommandState = originalQueryCommandState;
    document.queryCommandValue = originalQueryCommandValue;
  });

  describe('fromNode', () => {
    it('reads style properties from a DomQuery node without legacy helpers', () => {
      var $node = $$('<p style="font-size: 18px; text-align: center; line-height: 1.5;">Alpha</p>');
      var styleInfo = style.fromNode($node);

      expect(styleInfo['font-size']).to.equal(18);
      expect(styleInfo['font-size-unit'][0]).to.equal('px');
      expect(styleInfo['text-align']).to.equal('center');
      expect(styleInfo['line-height']).to.equal('1.5');
    });

    it('reads style properties from plain elements and ignores missing nodes', () => {
      var node = $$('<p style="font-size: 20px; line-height: normal;">Beta</p>')[0];
      var styleInfo = style.fromNode(node);

      expect(style.readStyleProperties(null, ['font-size'])).to.deep.equal({});
      expect(styleInfo['font-size']).to.equal(20);
      expect(styleInfo['font-size-unit'][0]).to.equal('px');
    });

    it('falls back to computed font sizes when inline styles are absent', () => {
      var styleTag = document.createElement('style');
      var node = document.createElement('p');
      var styleInfo;

      styleTag.textContent = '.computed-font-size { font-size: 22px; }';
      node.className = 'computed-font-size';
      document.head.appendChild(styleTag);
      document.body.appendChild(node);

      styleInfo = style.fromNode(node);

      expect(styleInfo['font-size']).to.equal(22);
      expect(styleInfo['font-size-unit'][0]).to.equal('px');

      node.remove();
      styleTag.remove();
    });

    it('handles empty DomQuery inputs without computed font data', () => {
      var styleInfo = style.fromNode($$());

      expect(Number.isNaN(styleInfo['font-size'])).to.equal(true);
      expect(styleInfo['font-size-unit']).to.equal(null);
    });
  });

  describe('styleNodes', () => {
    it('should wrap selected text with span', () => {
      var $cont = $$('<div class="note-editable"><p>text</p></div>');
      var $p = $cont.find('p');
      var rng = range.create($p[0].firstChild, 0, $p[0].firstChild, 4);
      style.styleNodes(rng);

      expect($cont.html()).to.deep.equal('<p><span>text</span></p>');
    });

    it('should split text and wrap selected text with span', () => {
      var $cont = $$('<div class="note-editable"><p>text</p></div>');
      var $p = $cont.find('p');
      var rng = range.create($p[0].firstChild, 1, $p[0].firstChild, 3);
      style.styleNodes(rng);

      expect($cont.html()).to.deep.equal('<p>t<span>ex</span>t</p>');
    });

    it('should split text and insert span', () => {
      var $cont = $$('<div class="note-editable"><p>text</p></div>');
      var $p = $cont.find('p');
      var rng = range.create($p[0].firstChild, 2, $p[0].firstChild, 2);
      style.styleNodes(rng);

      expect($cont.html()).to.deep.equal('<p>te<span></span>xt</p>');
    });

    it('should just return a parent span', () => {
      var $cont = $$('<div class="note-editable"><p><span>text</span></p></div>');
      var $span = $cont.find('span');
      var rng = range.create($span[0].firstChild, 0, $span[0].firstChild, 4);
      style.styleNodes(rng);

      expect($cont.html()).to.deep.equal('<p><span>text</span></p>');
    });

    it('should wrap each texts with span', () => {
      var $cont = $$('<div class="note-editable"><p><b>bold</b><span>span</span></p></div>');
      var $b = $cont.find('b');
      var $span = $cont.find('span');
      var rng = range.create($b[0].firstChild, 2, $span[0].firstChild, 2);
      style.styleNodes(rng);

      expect($cont.html()).to.deep.equal('<p><b>bo<span>ld</span></b><span><span>sp</span>an</span></p>');
    });

    it('should wrap each texts with span except not a single blood line', () => {
      var $cont = $$('<div class="note-editable"><p><b>bold</b><span>span</span></p></div>');
      var $b = $cont.find('b');
      var $span = $cont.find('span');
      var rng = range.create($b[0].firstChild, 2, $span[0].firstChild, 4);
      style.styleNodes(rng);

      expect($cont.html()).to.deep.equal('<p><b>bo<span>ld</span></b><span>span</span></p>');
    });

    it('should expand b tag when providing the expandClosestSibling option', () => {
      var $cont = $$('<div class="note-editable"><p>text<b>bold</b></p></div>');
      var $p = $cont.find('p');
      var rng = range.create($p[0].firstChild, 0, $p[0].firstChild, 4);
      style.styleNodes(rng, { nodeName: 'B', expandClosestSibling: true });

      expect($cont.html()).to.deep.equal('<p><b>textbold</b></p>');
    });

    it('should not expand b tag when providing the onlyPartialContains option', () => {
      var $cont = $$('<div class="note-editable"><p>text<b>bold</b></p></div>');
      var $p = $cont.find('p');
      var rng = range.create($p[0].firstChild, 0, $p[0].firstChild, 4);
      style.styleNodes(rng, {
        nodeName: 'B',
        expandClosestSibling: true,
        onlyPartialContains: true,
      });

      expect($cont.html()).to.deep.equal('<p><b>text</b><b>bold</b></p>');
    });
  });

  describe('stylePara', () => {
    it('applies styles to paragraph nodes in range order', () => {
      var $cont = $$('<div class="note-editable"><p>one</p><p>two</p></div>');
      var paraNodes = $cont.find('p');
      var paras = [paraNodes[0], paraNodes[1]];

      style.stylePara({
        nodes: function() {
          return paras;
        },
      }, {
        textAlign: 'right',
      });

      expect(paras[0].style.textAlign).to.equal('right');
      expect(paras[1].style.textAlign).to.equal('right');
    });
  });

  describe('current', () => {
    it('reads command state, list state, line height, anchors, and ancestors', () => {
      var $editable = $$('<div class="note-editable"><ul><li><p style="line-height: 24px;"><a href="#"><span style="font-size: 12px;">text</span></a></p></li></ul></div>');
      var textNode = $editable.find('span')[0].firstChild;

      document.queryCommandState = vi.fn((command) => command === 'bold' || command === 'underline');
      document.queryCommandValue = vi.fn(() => 'Arial');

      var info = style.current({
        sc: textNode,
        isOnList: function() {
          return true;
        },
        isOnAnchor: function() {
          return true;
        },
      });

      expect(info['font-bold']).to.equal('bold');
      expect(info['font-italic']).to.equal('normal');
      expect(info['font-underline']).to.equal('underline');
      expect(info['font-family']).to.equal('Arial');
      expect(info['list-style']).to.equal('ordered');
      expect(info['line-height']).to.equal('24px');
      expect(info.anchor.nodeName).to.equal('A');
      expect(Array.isArray(info.ancestors)).to.equal(true);
      expect(info.range.sc).to.equal(textNode);
    });

    it('falls back when queryCommand APIs throw and normalizes numeric line height ratios', () => {
      var $editable = $$('<div class="note-editable"><p><span style="font-size: 10px; line-height: 15px;">text</span></p></div>');
      var textNode = $editable.find('span')[0].firstChild;

      document.queryCommandState = vi.fn(() => {
        throw new Error('unsupported');
      });
      document.queryCommandValue = vi.fn(() => '');

      var info = style.current({
        sc: textNode,
        isOnList: function() {
          return false;
        },
        isOnAnchor: function() {
          return false;
        },
      });

      expect(info['list-style']).to.equal('none');
      expect(info['line-height']).to.equal('1.5');
      expect(info.anchor).to.equal(false);
    });

    it('uses element containers, unordered list styles, and command fallbacks', () => {
      var $editable = $$('<div class="note-editable"><ul><li style="font-family: serif; font-size: 14px; list-style-type: disc;">text</li></ul></div>');
      var item = $editable.find('li')[0];

      document.queryCommandState = vi.fn((command) => ['italic', 'subscript', 'superscript', 'strikethrough'].indexOf(command) > -1);
      document.queryCommandValue = vi.fn(() => '');

      var info = style.current({
        sc: item,
        isOnList: function() {
          return true;
        },
        isOnAnchor: function() {
          return false;
        },
      });

      expect(info['font-bold']).to.equal('normal');
      expect(info['font-italic']).to.equal('italic');
      expect(info['font-subscript']).to.equal('subscript');
      expect(info['font-superscript']).to.equal('superscript');
      expect(info['font-strikethrough']).to.equal('strikethrough');
      expect(info['font-family']).to.equal('serif');
      expect(info['list-style']).to.equal('unordered');
    });

    it('keeps numeric line heights unchanged when the font size is unavailable', () => {
      var $editable = $$('<div class="note-editable"><p><span style="line-height: 15px;">text</span></p></div>');
      var textNode = $editable.find('span')[0].firstChild;

      document.queryCommandState = vi.fn(() => false);
      document.queryCommandValue = vi.fn(() => '');

      var info = style.current({
        sc: textNode,
        isOnList: function() {
          return false;
        },
        isOnAnchor: function() {
          return false;
        },
      });

      expect(info['line-height']).to.equal('15px');
    });

    it('keeps numeric line heights unchanged when the font size is zero', () => {
      var $editable = $$('<div class="note-editable"><p><span style="font-size: 0px; line-height: 15px;">text</span></p></div>');
      var textNode = $editable.find('span')[0].firstChild;

      document.queryCommandState = vi.fn(() => false);
      document.queryCommandValue = vi.fn(() => '');

      var info = style.current({
        sc: textNode,
        isOnList: function() {
          return false;
        },
        isOnAnchor: function() {
          return false;
        },
      });

      expect(info['line-height']).to.equal('15px');
    });

    it('keeps numeric line heights unchanged when the font size is not positive', () => {
      var $editable = $$('<div class="note-editable"><p><span>text</span></p></div>');
      var textNode = $editable.find('span')[0].firstChild;
      var originalFromNode = style.fromNode;

      document.queryCommandState = vi.fn(() => false);
      document.queryCommandValue = vi.fn(() => '');
      style.fromNode = vi.fn(() => ({
        'font-family': '',
        'font-size': -1,
        'line-height': '15px',
        'list-style-type': '',
      }));

      var info = style.current({
        sc: textNode,
        isOnList: function() {
          return false;
        },
        isOnAnchor: function() {
          return false;
        },
      });

      style.fromNode = originalFromNode;

      expect(info['line-height']).to.equal('15px');
    });
  });
});
