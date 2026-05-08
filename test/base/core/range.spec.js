import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import $$ from '@/js/core/dom-query.js';
import dom from '@/js/core/dom';
import env from '@/js/core/env';
import range from '@/js/core/range';

describe('base:core.range', () => {
  const originalW3CRangeSupport = env.isW3CRangeSupport;

  afterEach(() => {
    env.isW3CRangeSupport = originalW3CRangeSupport;
    delete document.selection;
    delete document.body.createTextRange;
    vi.restoreAllMocks();
    $$('body').empty();
  });

  describe('nodes', () => {
    describe('1 depth', () => {
      var $para;
      beforeAll(() => {
        var $cont = $$('<div class="note-editable"><p>para1</p><p>para2</p></div>');
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
        var $cont = $$('<div class="note-editable"><p>p<b>ar</b>a1</p><p>para2</p></div>');
        var $b = $cont.find('b');
        var rng = range.create($b[0].firstChild, 0, $b[0].firstChild, 0);

        expect(rng.nodes(dom.isPara, { includeAncestor: true })).to.have.length(1);
      });
    });

    describe('on list, on heading', () => {
      it('should return array of list paragraphs', () => {
        var $cont = $$('<div class="note-editable"><ul><li>para1</li><li>para2</li></ul></div>');
        var $li = $cont.find('li');
        var rng = range.create($li[0].firstChild, 0, $li[1].firstChild, 1);

        expect(rng.nodes(dom.isPara, { includeAncestor: true })).to.have.length(2);
      });

      it('should return array of list paragraphs', () => {
        var $cont = $$('<div class="note-editable"><h1>heading1</h1><h2>heading2</h2></div>');
        var $h1 = $cont.find('h1');
        var $h2 = $cont.find('h2');
        var rng = range.create($h1[0].firstChild, 0, $h2[0].firstChild, 1);

        expect(rng.nodes(dom.isPara, { includeAncestor: true })).to.have.length(2);
      });
    });
  });

  describe('commonAncestor', () => {
    var $cont;
    beforeAll(() => {
      $cont = $$('<div><span><b>b</b><u>u</u></span></div>');
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
      var $cont = $$('<div><a><b>b</b><u>u</u></a></div>');
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
      var $cont = $$('<div><b>b</b><u>u</u></div>');
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
    beforeAll(() => {
      $cont = $$('<div><p><b>b</b><u>u</u><s>s</s></p></div>');
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
      var $cont = $$('<div><p>text</p><p><br></p></div>');
      var $p = $cont.find('p');

      var rng = range.create($p[1], 0, $p[1], 0).normalize();
      expect(rng.sc).to.deep.equal($p[1]);
      expect(rng.so).to.equal(0);
      expect(rng.ec).to.deep.equal($p[1]);
      expect(rng.eo).to.equal(0);
    });

    it('should return <p>text</p><p>|text</p> for <p>text</p><p>|text</p>', () => {
      var $cont = $$('<div><p>text</p><p>text</p></div>');
      var $p = $cont.find('p');

      var rng = range.create($p[1], 0, $p[1], 0).normalize();
      expect(rng.sc).to.deep.equal($p[1].firstChild);
      expect(rng.so).to.equal(0);
      expect(rng.ec).to.deep.equal($p[1].firstChild);
      expect(rng.eo).to.equal(0);
    });

    it('should return <p>|text</p><p>text|</p> for |<p>text</p><p>text</p>|', () => {
      var $cont = $$('<div class="note-editable"><p>text</p><p>text</p></div>');
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
      var $cont = $$('<div><p><img><b>bold</b></p></div>');
      var $p = $cont.find('p');
      var $b = $cont.find('b');

      var rng = range.create($p[0], 1, $p[0], 1).normalize();
      expect(rng.sc).to.deep.equal($b[0].firstChild);
      expect(rng.so).to.equal(0);
      expect(rng.ec).to.deep.equal($b[0].firstChild);
      expect(rng.eo).to.equal(0);
    });

    it('should return <p><img>|text></p> for <p><img>|text></p>', () => {
      var $cont = $$('<div><p><img>bold</p></div>');
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
      var $cont = $$('<div class="note-editable"><p><b>bold</b></p></div>');
      var $b = $cont.find('b');
      var $p2 = $$('<p>p</p>');

      var rng = range.create($b[0].firstChild, 2, $b[0].firstChild, 2);
      rng.insertNode($p2[0]);

      expect($cont.html()).to.equalsIgnoreCase('<p><b>bo</b></p><p>p</p><p><b>ld</b></p>');
    });

    it('should not split paragraph when inserting an inline element', () => {
      var $cont = $$('<div class="note-editable"><p>text</p></div>');
      var $p = $cont.find('p');
      var $u = $$('<u>u</u>');

      var rng = range.create($p[0].firstChild, 2, $p[0].firstChild, 2);
      rng.insertNode($u[0]);
      expect($cont.html()).to.equalsIgnoreCase('<p>te<u>u</u>xt</p>');
    });

    it('should not split paragraph when inserting an inline element case 2', () => {
      var $cont = $$('<div class="note-editable"><p><b>bold</b></p></div>');
      var $b = $cont.find('b');
      var $u = $$('<u>u</u>');

      var rng = range.create($b[0].firstChild, 2, $b[0].firstChild, 2);
      rng.insertNode($u[0]);
      expect($cont.html()).to.equalsIgnoreCase('<p><b>bo</b><u>u</u><b>ld</b></p>');
    });
  });

  describe('pasteHTML', () => {
    it('should not split a block element when inserting inline elements into it', () => {
      var $cont = $$('<div class="note-editable"><p>text</p></div>');
      var $p = $cont.find('p');
      var markup = '<span>span</span><i>italic</i>';

      var rng = range.create($p[0].firstChild, 2);
      rng.pasteHTML(markup);

      expect($cont.html()).to.equalsIgnoreCase('<p>te<span>span</span><i>italic</i>xt</p>');
    });

    it('should split an inline element when pasting inline elements into it', () => {
      var $cont = $$('<div class="note-editable"><p><b>bold</b></p></div>');
      var $b = $cont.find('b');
      var markup = '<span>span</span><i>italic</i>';

      var rng = range.create($b[0].firstChild, 2);
      rng.pasteHTML(markup);

      expect($cont.html()).to.equalsIgnoreCase('<p><b>bo</b><span>span</span><i>italic</i><b>ld</b></p>');
    });

    it('should split inline node when pasting an inline node and a block node into it', () => {
      var $cont = $$('<div class="note-editable"><p><b>bold</b></p></div>');
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
      $cont = $$('<div class="note-editable"><p><b>bold</b><u>u</u></p></div>');
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
      var $cont = $$('<div class="note-editable"></div>');

      var rng = range.create($cont[0], 0);
      rng.wrapBodyInlineWithPara();

      expect($cont.html()).to.equalsIgnoreCase('<p><br></p>');
    });

    it('should wrap text with paragraph for text', () => {
      var $cont = $$('<div class="note-editable">text</div>');

      var rng = range.create($cont[0].firstChild, 2);
      rng.wrapBodyInlineWithPara();

      expect($cont.html()).to.equalsIgnoreCase('<p>text</p>');
    });

    it('should wrap an inline node with paragraph when selecting text in the inline node', () => {
      var $cont = $$('<div class="note-editable"><b>bold</b></div>');
      var $b = $cont.find('b');

      var rng = range.create($b[0].firstChild, 2);
      rng.wrapBodyInlineWithPara();

      expect($cont.html()).to.equalsIgnoreCase('<p><b>bold</b></p>');
    });

    it('should wrap inline nodes with paragraph when selecting text in the inline nodes', () => {
      var $cont = $$('<div class="note-editable"><b>b</b><i>i</i></div>');

      var rng = range.create($cont[0], 0);
      rng.wrapBodyInlineWithPara();

      expect($cont.html()).to.equalsIgnoreCase('<p><b>b</b><i>i</i></p>');
    });

    it('should wrap inline nodes with paragraph when selection some of text in the inline nodes #1', () => {
      var $cont = $$('<div class="note-editable"><b>b</b><i>i</i></div>');

      var rng = range.create($cont[0], 1);
      rng.wrapBodyInlineWithPara();

      expect($cont.html()).to.equalsIgnoreCase('<p><b>b</b><i>i</i></p>');
    });

    it('should wrap inline nodes with paragraph when selection some of text in the inline nodes #2', () => {
      var $cont = $$('<div class="note-editable"><b>b</b><i>i</i></div>');

      var rng = range.create($cont[0], 2);
      rng.wrapBodyInlineWithPara();

      expect($cont.html()).to.equalsIgnoreCase('<p><b>b</b><i>i</i></p>');
    });
  });

  describe('getWordRange', () => {
    var $cont;
    beforeAll(() => {
      $cont = $$('<div class="note-editable">super simple wysiwyg editor</div>');
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
    beforeAll(() => {
      $cont = $$('<div class="note-editable">super &nbsp; simple wysiwyg editor</div>');
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
    beforeAll(() => {
      $cont = $$('<div class="note-editable">hi @Peter Pan. How are you?</div>');
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

  describe('selection and helper utilities', () => {
    it('covers W3C selection helpers, bookmarks, scrolling, and predicates', () => {
      const $editable = $$('<div class="note-editable"><p><a>ab</a></p><p><img><br></p><ul><li>x</li></ul><data>42</data></div>').appendTo('body');
      const linkText = $editable.find('a')[0].firstChild;
      const img = $editable.find('img')[0];
      const br = $editable.find('br')[0];
      const liText = $editable.find('li')[0].firstChild;
      const dataText = $editable.find('data')[0].firstChild;
      const nativeRange = {
        setStart: vi.fn(),
        setEnd: vi.fn(),
        toString: vi.fn(() => 'b'),
        getClientRects: vi.fn(() => [{ left: 1 }]),
      };
      const selection = {
        rangeCount: 1,
        anchorNode: linkText,
        removeAllRanges: vi.fn(),
        addRange: vi.fn(),
        getRangeAt: vi.fn(() => ({
          startContainer: linkText,
          startOffset: 1,
          endContainer: linkText,
          endOffset: 2,
        })),
      };

      vi.spyOn(document, 'createRange').mockReturnValue(nativeRange);
      vi.spyOn(document, 'getSelection').mockReturnValue(selection);

      const fromSelection = range.createFromSelection();
      expect(fromSelection.sc).to.equal(linkText);
      expect(fromSelection.so).to.equal(1);
      expect(fromSelection.toString()).to.equal('b');
      expect(fromSelection.getClientRects()).to.deep.equal([{ left: 1 }]);

      fromSelection.select();
      expect(selection.removeAllRanges).toHaveBeenCalledTimes(1);
      expect(selection.addRange).toHaveBeenCalledWith(nativeRange);
      vi.spyOn(document, 'getSelection').mockReturnValue({
        rangeCount: 0,
        addRange: vi.fn(),
      });
      expect(() => fromSelection.select()).not.to.throw();

      const scrollContainer = document.createElement('div');
      Object.defineProperty(scrollContainer, 'offsetHeight', { configurable: true, value: 10 });
      Object.defineProperty(scrollContainer, 'scrollTop', { configurable: true, writable: true, value: 0 });
      const scrollRange = range.create(linkText.parentNode, 0, linkText.parentNode, 0);
      Object.defineProperty(linkText.parentNode, 'offsetTop', { configurable: true, value: 50 });
      scrollRange.scrollIntoView(scrollContainer);
      expect(scrollContainer.scrollTop).to.equal(40);
      scrollRange.scrollIntoView({ scrollTop: 100, offsetHeight: 20 });

      const bookmark = fromSelection.bookmark($editable[0]);
      const restored = range.createFromBookmark($editable[0], bookmark);
      expect(restored.so).to.equal(1);
      expect(restored.eo).to.equal(2);

      const paras = Array.from($editable.find('p'));
      const paraBookmark = range.create(paras[0].firstChild, 0, paras[1], 0).paraBookmark(paras);
      const restoredPara = range.createFromParaBookmark(paraBookmark, paras);
      expect(restoredPara.sc).to.equal(paras[0].firstChild);
      expect(restoredPara.ec).to.equal(paras[1]);

      expect(range.createFromNodeBefore(img).isCollapsed()).to.be.true;
      expect(range.createFromNodeAfter(br).isCollapsed()).to.be.true;
      expect(range.createFromBodyElement(paras[0], true).isCollapsed()).to.be.true;

      const anchorRange = range.create(linkText, 0, linkText, 2);
      expect(anchorRange.isOnEditable()).to.be.true;
      expect(anchorRange.isOnAnchor()).to.be.true;
      expect(range.create(liText, 0, liText, 1).isOnList()).to.be.true;
      expect(range.create(dataText, 0, dataText, 2).isOnData()).to.be.true;
      expect(range.create($editable.find('li')[0], 0, $editable.find('li')[0], 0).isLeftEdgeOf(dom.isList)).to.be.true;
      expect(anchorRange.expand(dom.isTable).sc).to.equal(linkText);
      expect(range.create(linkText, 0, liText, 1).expand(dom.isAnchor).ec).to.equal(liText);
      expect(range.create(linkText, 0, liText, 1).expand(dom.isAnchor).sc).to.equal($editable.find('a')[0]);
      expect(anchorRange.collapse(true).so).to.equal(0);
      expect(anchorRange.nodes().length).to.be.greaterThan(0);
      expect(range.create(linkText, 1).getWordRange(true).eo).to.equal(1);
      expect(range.create($$('<div class="note-editable">alpha beta</div>')[0].firstChild, 5).getWordsRange(true).eo).to.equal(1);
      expect(range.create($$('<div class="note-editable">say @john doe</div>')[0].firstChild, 13).getWordsMatchRange(/@[a-z ]+/i)).to.be.null;
      expect(range.create($editable[0], 0, $editable[0], $editable[0].childNodes.length).nodes(dom.isPara, { fullyContains: true }).length).to.be.greaterThan(0);
      const elementRange = range.create($editable.find('p')[0], 0, $editable.find('p')[1], 1);
      expect(() => elementRange.nativeRange()).not.to.throw();
      expect(range.create(linkText, 0, liText, 1).expand(dom.isList).ec).to.equal($editable.find('ul')[0]);
      const leftVisible = range.create($editable.find('p')[0], 0, $editable.find('p')[0], 0).normalize();
      expect(leftVisible.sc).to.exist;
    });

    it('covers create fallbacks and W3C selection null branches', () => {
      const emptySelection = { rangeCount: 0 };
      vi.spyOn(document, 'getSelection').mockReturnValue(emptySelection);
      expect(range.createFromSelection()).to.be.null;

      vi.spyOn(document, 'getSelection').mockReturnValue({
        rangeCount: 1,
        anchorNode: document.body,
      });
      expect(range.createFromSelection()).to.be.null;

      const originalCreateFromSelection = range.createFromSelection;
      range.createFromSelection = () => null;

      const $editable = $$(`<div class="note-editable">${dom.emptyPara}</div>`);
      const fallback = range.create($editable[0]);
      expect(fallback.isCollapsed()).to.be.true;
      expect(fallback.sc.nodeName).to.equal('P');

      const selected = { marker: true };
      range.createFromSelection = () => selected;
      expect(range.create()).to.equal(selected);
      range.createFromSelection = originalCreateFromSelection;
      const plainBody = document.createElement('p');
      expect(range.create(plainBody).isCollapsed()).to.be.true;
      expect(range.createFromBodyElement(plainBody).isCollapsed()).to.be.true;
    });

    it('covers legacy text range conversion branches', () => {
      env.isW3CRangeSupport = false;

      const paragraph = document.createElement('p');
      const leadingSpan = document.createElement('span');
      const firstTextNode = document.createTextNode('ab');
      const secondTextNode = document.createTextNode('cd');
      const trailingTextNode = document.createTextNode('e');
      const middleSpan = document.createElement('span');
      const endingElement = document.createElement('em');
      paragraph.append(leadingSpan, firstTextNode, secondTextNode, trailingTextNode, middleSpan, endingElement);
      const legacyTextRange = {
        parentElement: () => paragraph,
        collapse: vi.fn(),
        duplicate() {
          return {
            parentElement: () => paragraph,
            collapse: vi.fn(),
            duplicate: this.duplicate,
            setEndPoint: vi.fn(),
            text: 'abcd',
          };
        },
      };
      const createTextRangeMock = vi.fn();
      let compareCalls = 0;

      document.body.createTextRange = createTextRangeMock.mockImplementation(() => ({
        moveToElementText: vi.fn(),
        compareEndPoints: vi.fn(() => {
          compareCalls += 1;
          return compareCalls === 1 ? -1 : 0;
        }),
        collapse: vi.fn(),
        moveStart: vi.fn(),
        setEndPoint: vi.fn(),
        select: vi.fn(),
        text: 'legacy',
      }));

      document.selection = {
        createRange: () => legacyTextRange,
      };

      const legacySelection = range.createFromSelection();
      expect(legacySelection).to.exist;
      expect(typeof legacySelection.so).to.equal('number');

      const legacyRange = range.create(firstTextNode, 1, firstTextNode, 1);
      expect(legacyRange.toString()).to.equal('legacy');
      expect(() => legacyRange.select()).not.to.throw();
      expect(() => range.create(trailingTextNode, 1, trailingTextNode, 1).nativeRange()).not.to.throw();
      const soloParagraph = document.createElement('p');
      const soloText = document.createTextNode('xy');
      soloParagraph.appendChild(soloText);
      expect(() => range.create(soloText, 1, soloText, 1).nativeRange()).not.to.throw();

      const elementPointRange = range.create(paragraph, paragraph.childNodes.length, paragraph, paragraph.childNodes.length);
      expect(() => elementPointRange.nativeRange()).not.to.throw();
      expect(() => range.create(paragraph, 1, paragraph, 1).nativeRange()).not.to.throw();

      const collapsedParagraph = document.createElement('p');
      const collapsedFirst = document.createTextNode('ab');
      const collapsedSecond = document.createTextNode('cd');
      collapsedParagraph.append(collapsedFirst, collapsedSecond);
      document.body.createTextRange = vi.fn(() => ({
        moveToElementText: vi.fn(),
        compareEndPoints: vi.fn(() => 0),
        collapse: vi.fn(),
        moveStart: vi.fn(),
        setEndPoint: vi.fn(),
        select: vi.fn(),
        text: 'legacy',
      }));
      const collapsedSelection = {
        parentElement: () => collapsedParagraph,
        collapse: vi.fn(),
        duplicate() {
          return {
            parentElement: () => collapsedParagraph,
            collapse: vi.fn(),
            duplicate: this.duplicate,
            setEndPoint: vi.fn(),
            text: 'ab',
          };
        },
      };
      document.selection = {
        createRange: () => collapsedSelection,
      };
      const collapsedLegacy = range.createFromSelection();
      expect(collapsedLegacy.sc).to.equal(collapsedFirst);
      expect(collapsedLegacy.ec).to.equal(collapsedFirst);
      expect(collapsedLegacy.eo).to.equal(2);
      expect(collapsedLegacy.so).to.equal(2);
    });

    it('covers remaining insertion and wrapping branches', () => {
      const $editable = $$('<div class="note-editable"><div><span>text</span></div><p><br></p></div>');
      const wrapped = range.create($editable[0], 1).wrapBodyInlineWithPara();
      expect(wrapped.sc.nodeName).to.satisfy((name) => ['SPAN', 'DIV', 'P', '#text'].includes(name));

      const $container = $$('<div class="note-editable"><p><br></p></div>');
      range.create($container.find('p')[0], 0, $container.find('p')[0], 0).insertNode($$('<p>block</p>')[0]);
      expect($container.find('p').length).to.be.greaterThan(0);
      expect(!!range.create($container.find('p')[0], 0, $container.find('p')[0], 0).isLeftEdgeOf(dom.isAnchor)).to.be.false;
      expect(range.create($editable[0].firstChild, 0, $editable[0].firstChild, 0).wrapBodyInlineWithPara().sc).to.exist;
      expect(range.create($editable.find('span')[0].firstChild, 2).pasteHTML().length).to.equal(0);
      const differentContainers = range.create($editable.find('span')[0].firstChild, 1, $editable.find('p')[0], 0).splitText();
      expect(differentContainers.sc).to.exist;
      const $rootInline = $$('<div class="note-editable"><span>one</span><span>two</span></div>');
      expect(range.create($rootInline[0], 1, $rootInline[0], 1).wrapBodyInlineWithPara().sc).to.exist;
    });

    it('covers remaining normalize and wrapBodyInlineWithPara edge branches', () => {
      const $editable = $$('<div class="note-editable"><p><img></p><span>tail</span></div>');
      const rangeAtPara = range.create($editable.find('p')[0], 0, $editable.find('p')[0], 0);
      const visibleSpy = vi.spyOn(dom, 'isVisiblePoint')
        .mockImplementationOnce(() => false)
        .mockImplementation(() => true);
      expect(rangeAtPara.normalize().sc).to.exist;
      visibleSpy.mockRestore();

      const nextPointUntilSpy = vi.spyOn(dom, 'nextPointUntil').mockReturnValue(null);
      const prevPointUntilSpy = vi.spyOn(dom, 'prevPointUntil').mockReturnValue(null);
      const invisibleSpy = vi.spyOn(dom, 'isVisiblePoint').mockReturnValue(false);
      expect(range.create($editable.find('span')[0].firstChild, 1, $editable.find('span')[0].firstChild, 1).normalize().sc).to.exist;
      nextPointUntilSpy.mockRestore();
      prevPointUntilSpy.mockRestore();
      invisibleSpy.mockRestore();

      const $rootInline = $$('<div class="note-editable"><span>one</span></div>');
      const elseBranchRange = range.create($rootInline[0], 0, $rootInline[0], 0);
      elseBranchRange.normalize = () => ({ sc: $rootInline[0], so: 1 });
      expect(elseBranchRange.wrapBodyInlineWithPara().sc).to.exist;

      const noTopAncestorRange = range.create($rootInline[0], 0, $rootInline[0], 0);
      const emptyContainer = document.createElement('div');
      noTopAncestorRange.normalize = () => ({ sc: emptyContainer, so: 0 });
      expect(() => noTopAncestorRange.wrapBodyInlineWithPara()).not.to.throw();
    });

    it('covers deleteContents empty-parent cleanup and block child wrapping paths', () => {
      const $editable = $$('<div class="note-editable"><p><span><b>ab</b></span><i>x</i></p><div></div><span>tail</span></div>');
      const span = $editable.find('span')[0];

      range.create(span, 0, span, 1).deleteContents();
      expect($editable.find('p > span').length).to.equal(0);

      const wrapped = range.create($editable[0], 3, $editable[0], 3).wrapBodyInlineWithPara();
      expect(wrapped.sc).to.exist;
      expect(range.create($editable.find('i')[0].firstChild, 1, $editable.find('i')[0].firstChild, 1).isLeftEdgeOf(dom.isAnchor)).to.be.false;

      const $blockHost = $$('<div class="note-editable"><div></div><span>tail</span></div>');
      expect(range.create($blockHost[0], 2, $blockHost[0], 2).wrapBodyInlineWithPara().sc).to.exist;
    });
  });
});
