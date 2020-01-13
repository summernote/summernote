/**
 * range.spec.js
 * (c) 2013~ Alan Hong
 * summernote may be freely distributed under the MIT license./
 */

import chai from 'chai';
import chaidom from '../../chaidom';
import $ from 'jquery';
import dom from '../../../src/js/base/core/dom';
import range from '../../../src/js/base/core/range';

var expect = chai.expect;
chai.use(chaidom);

describe('base:core.range', () => {
  describe('nodes', () => {
    describe('1 depth', () => {
      var $para;
      before(() => {
        var $cont = $('<div class="note-editable"><p>para1</p><p>para2</p></div>');
        $para = $cont.find('p');
      });

      it('should return array of two paragraphs', () => {
        var rng = range.create($para[0].firstChild, 0, $para[1].firstChild, 1);
        expect(rng.nodes(dom.isPara, { includeAncestor: true })).to.have.length(2);
      });

      it('should return array of a paragraph', () => {
        var rng = range.create($para[0].firstChild, 0, $para[0].firstChild, 0);
        expect(rng.nodes(dom.isPara, { includeAncestor: true })).to.have.length(1);
      });
    });

    describe('multi depth', () => {
      it('should return array of a paragraph', () => {
        var $cont = $('<div class="note-editable"><p>p<b>ar</b>a1</p><p>para2</p></div>');
        var $b = $cont.find('b');
        var rng = range.create($b[0].firstChild, 0, $b[0].firstChild, 0);

        expect(rng.nodes(dom.isPara, { includeAncestor: true })).to.have.length(1);
      });
    });

    describe('on list, on heading', () => {
      it('should return array of list paragraphs', () => {
        var $cont = $('<div class="note-editable"><ul><li>para1</li><li>para2</li></ul></div>');
        var $li = $cont.find('li');
        var rng = range.create($li[0].firstChild, 0, $li[1].firstChild, 1);

        expect(rng.nodes(dom.isPara, { includeAncestor: true })).to.have.length(2);
      });

      it('should return array of list paragraphs', () => {
        var $cont = $('<div class="note-editable"><h1>heading1</h1><h2>heading2</h2></div>');
        var $h1 = $cont.find('h1');
        var $h2 = $cont.find('h2');
        var rng = range.create($h1[0].firstChild, 0, $h2[0].firstChild, 1);

        expect(rng.nodes(dom.isPara, { includeAncestor: true })).to.have.length(2);
      });
    });
  });

  describe('commonAncestor', () => {
    var $cont;
    before(() => {
      $cont = $('<div><span><b>b</b><u>u</u></span></div>');
    });

    it('should return <span> for <b>|b</b> and <u>u|</u>', () => {
      var $span = $cont.find('span');
      var $b = $cont.find('b');
      var $u = $cont.find('u');

      var rng = range.create($b[0].firstChild, 0, $u[0].firstChild, 1);
      expect(rng.commonAncestor()).to.deep.equal($span[0]);
    });

    it('should return b(#textNode) for <b>|b|</b>', () => {
      var $b = $cont.find('b');

      var rng = range.create($b[0].firstChild, 0, $b[0].firstChild, 1);
      expect(rng.commonAncestor()).to.deep.equal($b[0].firstChild);
    });
  });

  describe('expand', () => {
    it('should return <b>|b</b> ~ <u>u|</u> for <b>|b</b> with isAnchor', () => {
      var $cont = $('<div><a><b>b</b><u>u</u></a></div>');
      var $anchor = $cont.find('a');
      var $b = $cont.find('b');

      var rng = range.create($b[0].firstChild, 0, $b[0].firstChild, 0).expand(dom.isAnchor);
      expect(rng.sc).to.deep.equal($anchor[0]);
      expect(rng.so).to.equal(0);
      expect(rng.ec).to.deep.equal($anchor[0]);
      expect(rng.eo).to.equal(2);
    });
  });

  describe('collapse', () => {
    it('should return <u>u|</u> for <b>|b</b> ~ <u>u|</u>', () => {
      var $cont = $('<div><b>b</b><u>u</u></div>');
      var $b = $cont.find('b');
      var $u = $cont.find('u');

      var rng = range.create($b[0].firstChild, 0, $u[0].firstChild, 1).collapse();
      expect(rng.sc).to.deep.equal($u[0].firstChild);
      expect(rng.so).to.equal(1);
      expect(rng.ec).to.deep.equal($u[0].firstChild);
      expect(rng.eo).to.equal(1);
    });
  });

  describe('normalize', () => {
    var $cont;
    before(() => {
      $cont = $('<div><p><b>b</b><u>u</u><s>s</s></p></div>');
    });

    it('should return <b>|b</b> ~ <u>u|</u> for |<b>b</b> ~ <u>u</u>|', () => {
      var $p = $cont.find('p');
      var $b = $cont.find('b');
      var $u = $cont.find('u');

      var rng = range.create($p[0], 0, $p[0], 2).normalize();
      expect(rng.sc).to.deep.equal($b[0].firstChild);
      expect(rng.so).to.equal(0);
      expect(rng.ec).to.deep.equal($u[0].firstChild);
      expect(rng.eo).to.equal(1);
    });

    it('should return <b>b|</b><u>u</u> for <b>b</b>|<u>u</u>', () => {
      var $p = $cont.find('p');
      var $b = $cont.find('b');

      var rng = range.create($p[0], 1, $p[0], 1).normalize();
      expect(rng.sc).to.deep.equal($b[0].firstChild);
      expect(rng.so).to.equal(1);
      expect(rng.ec).to.deep.equal($b[0].firstChild);
      expect(rng.eo).to.equal(1);
    });

    it('should return <b>b</b><u>|u|</u><s>s</s> for <b>b|</b><u>u</u><s>|s</s>', () => {
      var $b = $cont.find('b');
      var $u = $cont.find('u');
      var $s = $cont.find('s');

      var rng = range.create($b[0].firstChild, 1, $s[0].firstChild, 0).normalize();
      expect(rng.sc).to.deep.equal($u[0].firstChild);
      expect(rng.so).to.equal(0);
      expect(rng.ec).to.deep.equal($u[0].firstChild);
      expect(rng.eo).to.equal(1);
    });

    it('should return <b>b|</b><u>u</u><s>s</s> for <b>b|</b><u>u</u><s>s</s>', () => {
      var $b = $cont.find('b');

      var rng = range.create($b[0].firstChild, 1, $b[0].firstChild, 1).normalize();
      expect(rng.sc).to.deep.equal($b[0].firstChild);
      expect(rng.so).to.equal(1);
      expect(rng.ec).to.deep.equal($b[0].firstChild);
      expect(rng.eo).to.equal(1);
    });
  });

  describe('normalize (block mode)', () => {
    it('should return <p>text</p><p>|<br></p> for <p>text</p><p>|<br></p>', () => {
      var $cont = $('<div><p>text</p><p><br></p></div>');
      var $p = $cont.find('p');

      var rng = range.create($p[1], 0, $p[1], 0).normalize();
      expect(rng.sc).to.deep.equal($p[1]);
      expect(rng.so).to.equal(0);
      expect(rng.ec).to.deep.equal($p[1]);
      expect(rng.eo).to.equal(0);
    });

    it('should return <p>text</p><p>|text</p> for <p>text</p><p>|text</p>', () => {
      var $cont = $('<div><p>text</p><p>text</p></div>');
      var $p = $cont.find('p');

      var rng = range.create($p[1], 0, $p[1], 0).normalize();
      expect(rng.sc).to.deep.equal($p[1].firstChild);
      expect(rng.so).to.equal(0);
      expect(rng.ec).to.deep.equal($p[1].firstChild);
      expect(rng.eo).to.equal(0);
    });

    it('should return <p>|text</p><p>text|</p> for |<p>text</p><p>text</p>|', () => {
      var $cont = $('<div class="note-editable"><p>text</p><p>text</p></div>');
      var $p = $cont.find('p');

      var rng = range.create($cont[0], 0, $cont[0], 2).normalize();
      expect(rng.sc).to.deep.equal($p[0].firstChild);
      expect(rng.so).to.equal(0);
      expect(rng.ec).to.deep.equal($p[1].firstChild);
      expect(rng.eo).to.equal(4);
    });
  });

  describe('normalize (void element)', () => {
    it('should return <p><img>|<b>bold</b></p> for <p><img>|<b>bold</b></p>', () => {
      var $cont = $('<div><p><img><b>bold</b></p></div>');
      var $p = $cont.find('p');
      var $b = $cont.find('b');

      var rng = range.create($p[0], 1, $p[0], 1).normalize();
      expect(rng.sc).to.deep.equal($b[0].firstChild);
      expect(rng.so).to.equal(0);
      expect(rng.ec).to.deep.equal($b[0].firstChild);
      expect(rng.eo).to.equal(0);
    });

    it('should return <p><img>|text></p> for <p><img>|text></p>', () => {
      var $cont = $('<div><p><img>bold</p></div>');
      var $img = $cont.find('img');
      var text = $img[0].nextSibling;

      var rng = range.create(text, 0, text, 0).normalize();
      expect(rng.sc).to.equal(text);
      expect(rng.so).to.equal(0);
      expect(rng.isCollapsed()).to.true;
    });
  });

  describe('insertNode', () => {
    it('should split paragraph when inserting a block element', () => {
      var $cont = $('<div class="note-editable"><p><b>bold</b></p></div>');
      var $b = $cont.find('b');
      var $p2 = $('<p>p</p>');

      var rng = range.create($b[0].firstChild, 2, $b[0].firstChild, 2);
      rng.insertNode($p2[0]);

      expect($cont.html()).to.equalsIgnoreCase('<p><b>bo</b></p><p>p</p><p><b>ld</b></p>');
    });

    it('should not split paragraph when inserting an inline element', () => {
      var $cont = $('<div class="note-editable"><p>text</p></div>');
      var $p = $cont.find('p');
      var $u = $('<u>u</u>');

      var rng = range.create($p[0].firstChild, 2, $p[0].firstChild, 2);
      rng.insertNode($u[0]);
      expect($cont.html()).to.equalsIgnoreCase('<p>te<u>u</u>xt</p>');
    });

    it('should not split paragraph when inserting an inline element case 2', () => {
      var $cont = $('<div class="note-editable"><p><b>bold</b></p></div>');
      var $b = $cont.find('b');
      var $u = $('<u>u</u>');

      var rng = range.create($b[0].firstChild, 2, $b[0].firstChild, 2);
      rng.insertNode($u[0]);
      expect($cont.html()).to.equalsIgnoreCase('<p><b>bo</b><u>u</u><b>ld</b></p>');
    });
  });

  describe('pasteHTML', () => {
    it('should not split a block element when inserting inline elements into it', () => {
      var $cont = $('<div class="note-editable"><p>text</p></div>');
      var $p = $cont.find('p');
      var markup = '<span>span</span><i>italic</i>';

      var rng = range.create($p[0].firstChild, 2);
      rng.pasteHTML(markup);

      expect($cont.html()).to.equalsIgnoreCase('<p>te<span>span</span><i>italic</i>xt</p>');
    });

    it('should split an inline element when pasting inline elements into it', () => {
      var $cont = $('<div class="note-editable"><p><b>bold</b></p></div>');
      var $b = $cont.find('b');
      var markup = '<span>span</span><i>italic</i>';

      var rng = range.create($b[0].firstChild, 2);
      rng.pasteHTML(markup);

      expect($cont.html()).to.equalsIgnoreCase('<p><b>bo</b><span>span</span><i>italic</i><b>ld</b></p>');
    });

    it('should split inline node when pasting an inline node and a block node into it', () => {
      var $cont = $('<div class="note-editable"><p><b>bold</b></p></div>');
      var $b = $cont.find('b');
      var markup = '<span>span</span><p><i>italic</i></p>';

      var rng = range.create($b[0].firstChild, 2);
      rng.pasteHTML(markup);

      expect($cont.html()).to.equalsIgnoreCase('<p><b>bo</b><span>span</span></p><p><i>italic</i></p><p><b>ld</b></p>');
    });
  });

  describe('deleteContents', () => {
    var $cont, $b;
    beforeEach(() => {
      $cont = $('<div class="note-editable"><p><b>bold</b><u>u</u></p></div>');
      $b = $cont.find('b');
    });

    it('should remove text only for partial text', () => {
      var rng = range.create($b[0].firstChild, 1, $b[0].firstChild, 3);
      rng.deleteContents();

      expect($cont.html()).to.equalsIgnoreCase('<p><b>bd</b><u>u</u></p>');
    });

    it('should remove text for entire text', () => {
      var rng = range.create($b[0].firstChild, 0, $b[0].firstChild, 4);
      rng.deleteContents();

      expect($cont.html()).to.equalsIgnoreCase('<p><b></b><u>u</u></p>');
    });
  });

  describe('wrapBodyInlineWithPara', () => {
    it('should insert an empty paragraph when there is no contents', () => {
      var $cont = $('<div class="note-editable"></div>');

      var rng = range.create($cont[0], 0);
      rng.wrapBodyInlineWithPara();

      expect($cont.html()).to.equalsIgnoreCase('<p><br></p>');
    });

    it('should wrap text with paragraph for text', () => {
      var $cont = $('<div class="note-editable">text</div>');

      var rng = range.create($cont[0].firstChild, 2);
      rng.wrapBodyInlineWithPara();

      expect($cont.html()).to.equalsIgnoreCase('<p>text</p>');
    });

    it('should wrap an inline node with paragraph when selecting text in the inline node', () => {
      var $cont = $('<div class="note-editable"><b>bold</b></div>');
      var $b = $cont.find('b');

      var rng = range.create($b[0].firstChild, 2);
      rng.wrapBodyInlineWithPara();

      expect($cont.html()).to.equalsIgnoreCase('<p><b>bold</b></p>');
    });

    it('should wrap inline nodes with paragraph when selecting text in the inline nodes', () => {
      var $cont = $('<div class="note-editable"><b>b</b><i>i</i></div>');

      var rng = range.create($cont[0], 0);
      rng.wrapBodyInlineWithPara();

      expect($cont.html()).to.equalsIgnoreCase('<p><b>b</b><i>i</i></p>');
    });

    it('should wrap inline nodes with paragraph when selection some of text in the inline nodes #1', () => {
      var $cont = $('<div class="note-editable"><b>b</b><i>i</i></div>');

      var rng = range.create($cont[0], 1);
      rng.wrapBodyInlineWithPara();

      expect($cont.html()).to.equalsIgnoreCase('<p><b>b</b><i>i</i></p>');
    });

    it('should wrap inline nodes with paragraph when selection some of text in the inline nodes #2', () => {
      var $cont = $('<div class="note-editable"><b>b</b><i>i</i></div>');

      var rng = range.create($cont[0], 2);
      rng.wrapBodyInlineWithPara();

      expect($cont.html()).to.equalsIgnoreCase('<p><b>b</b><i>i</i></p>');
    });
  });

  describe('getWordRange', () => {
    var $cont;
    before(() => {
      $cont = $('<div class="note-editable">super simple wysiwyg editor</div>');
    });

    it('should return the range itself when there is no word before cursor', () => {
      var rng = range.create($cont[0].firstChild, 0).getWordRange();

      expect(rng.sc).to.deep.equal($cont[0].firstChild);
      expect(rng.so).to.equal(0);
      expect(rng.ec).to.deep.equal($cont[0].firstChild);
      expect(rng.eo).to.equal(0);
    });

    it('should return expanded range when there is a word before cursor', () => {
      var rng = range.create($cont[0].firstChild, 5).getWordRange();

      expect(rng.sc).to.deep.equal($cont[0].firstChild);
      expect(rng.so).to.equal(0);
      expect(rng.ec).to.deep.equal($cont[0].firstChild);
      expect(rng.eo).to.equal(5);
    });

    it('should return expanded range when there is a half word before cursor', () => {
      var rng = range.create($cont[0].firstChild, 3).getWordRange();

      expect(rng.sc).to.deep.equal($cont[0].firstChild);
      expect(rng.so).to.equal(0);
      expect(rng.ec).to.deep.equal($cont[0].firstChild);
      expect(rng.eo).to.equal(3);
    });

    it('should return expanded range when there are words before cursor', () => {
      var rng = range.create($cont[0].firstChild, 12).getWordRange();

      expect(rng.sc).to.deep.equal($cont[0].firstChild);
      expect(rng.so).to.equal(6);
      expect(rng.ec).to.deep.equal($cont[0].firstChild);
      expect(rng.eo).to.equal(12);
    });
  });

  describe('getWordsRange', () => {
    var $cont;
    before(() => {
      $cont = $('<div class="note-editable">super &nbsp; simple wysiwyg editor</div>');
    });

    it('should return the range itself when there is no word before cursor', () => {
      var rng = range.create($cont[0].firstChild, 0).getWordsRange();

      expect(rng.sc).to.deep.equal($cont[0].firstChild);
      expect(rng.so).to.equal(0);
      expect(rng.ec).to.deep.equal($cont[0].firstChild);
      expect(rng.eo).to.equal(0);
    });

    it('should return expanded range when there is a word before cursor', () => {
      var rng = range.create($cont[0].firstChild, 5).getWordsRange();

      expect(rng.sc).to.deep.equal($cont[0].firstChild);
      expect(rng.so).to.equal(0);
      expect(rng.ec).to.deep.equal($cont[0].firstChild);
      expect(rng.eo).to.equal(5);
    });

    it('should return expanded range when there is a half word before cursor', () => {
      var rng = range.create($cont[0].firstChild, 3).getWordsRange();

      expect(rng.sc).to.deep.equal($cont[0].firstChild);
      expect(rng.so).to.equal(0);
      expect(rng.ec).to.deep.equal($cont[0].firstChild);
      expect(rng.eo).to.equal(3);
    });

    it('should return expanded range when there are words before cursor', () => {
      var rng = range.create($cont[0].firstChild, 14).getWordsRange();

      expect(rng.sc).to.deep.equal($cont[0].firstChild);
      expect(rng.so).to.equal(0);
      expect(rng.ec).to.deep.equal($cont[0].firstChild);
      expect(rng.eo).to.equal(14);
    });
  });

  describe('getWordsMatchRange', () => {
    var $cont, regex;
    before(() => {
      $cont = $('<div class="note-editable">hi @Peter Pan. How are you?</div>');
      regex = /@[a-z ]+/i;
    });

    it('should return null when there is no word before cursor', () => {
      var rng = range.create($cont[0].firstChild, 0).getWordsMatchRange(regex);
      expect(rng).to.be.a('null');
    });

    it('should return expanded range when there are words before cursor', () => {
      var rng = range.create($cont[0].firstChild, 13).getWordsMatchRange(regex);

      // range: 'hi @Peter Pan'
      // matched range: '@Peter Pan'
      expect(rng.sc).to.deep.equal($cont[0].firstChild);
      expect(rng.so).to.equal(3);
      expect(rng.ec).to.deep.equal($cont[0].firstChild);
      expect(rng.eo).to.equal(13);
    });

    it('should return null when can not match', () => {
      var rng = range.create($cont[0].firstChild, 14).getWordsMatchRange(regex);

      // range: 'hi @Peter Pan.'
      expect(rng).to.be.a('null');
    });
  });
});
