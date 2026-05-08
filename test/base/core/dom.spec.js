import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import $$ from '@/js/core/dom-query.js';
import dom from '@/js/core/dom';
import func from '@/js/core/func';

describe('base:core.dom', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    $$('body').empty();
  });

  describe('ancestor', () => {
    let $cont, $b, txtB;
    beforeAll(() => {
      // basic case
      $cont = $$('<div class="note-editable"><b>b</b><u>u</u><s>s</s><i>i</i></div>'); // busi
      $b = $cont.find('b');
      txtB = $b[0].firstChild;
    });

    it('should find ancestor B', () => {
      expect(dom.ancestor(txtB, dom.isB)).to.deep.equal($b[0]);
    });

    it('should find ancestor DIV', () => {
      expect(dom.ancestor(txtB, dom.isDiv)).to.deep.equal($cont[0]);
    });

    it('should return null when finding ancestor U does not exist', () => {
      expect(dom.ancestor(txtB, dom.isU)).to.be.null;
    });

    it('should return null when finding paragraph ancestor outsider note-editable', () => {
      expect(dom.ancestor(txtB, dom.isLi)).to.be.null;
    });
  });

  describe('listAncestor', () => {
    let $cont, $b, $u, $s, $i;
    beforeAll(() => {
      $cont = $$('<div class="note-editable"><i><s><u><b>b</b></u></s></i></div>'); // busi
      $b = $cont.find('b');
      $u = $cont.find('u');
      $s = $cont.find('s');
      $i = $cont.find('i');
    });

    it('should return [$b, $u, $s, $i] from b to i', () => {
      let result = dom.listAncestor($b[0], (node) => {
        return node === $i[0];
      });
      expect(result).to.deep.equal([$b[0], $u[0], $s[0], $i[0]]);
    });

    it('should return [$u, $s] from u to s', () => {
      let result = dom.listAncestor($u[0], (node) => {
        return node === $s[0];
      });
      expect(result).to.deep.equal([$u[0], $s[0]]);
    });
  });

  describe('listDescendant', () => {
    let $cont, $b, $u, $s, $i;
    beforeAll(() => {
      $cont = $$('<div class="note-editable"><b></b><u></u><s></s><i></i></div>'); // busi
      $b = $cont.find('b');
      $u = $cont.find('u');
      $s = $cont.find('s');
      $i = $cont.find('i');
    });

    it('should return an array of descendant elements', () => {
      expect(dom.listDescendant($cont[0])).to.deep.equal([$b[0], $u[0], $s[0], $i[0]]);
    });

    it('should filter an array of descendant elements', () => {
      let result = dom.listDescendant($cont[0], (node) => {
        return node.nodeName === 'B' || node.nodeName === 'S';
      });
      expect(result).to.deep.equal([$b[0], $s[0]]);
    });
  });

  describe('commonAncestor', () => {
    let $cont, $span, $div, $b, $u, $s;
    beforeAll(() => {
      $cont = $$(
        '<div class="note-editable"><div><span><b>b</b><u>u</u></span><span><s>s</s><i>i</i></span></div></div>',
      );
      $span = $cont.find('span');
      $div = $cont.find('div');
      $b = $cont.find('b');
      $u = $cont.find('u');
      $s = $cont.find('s');
    });

    it('should return a common element in ancestors', () => {
      expect(dom.commonAncestor($b[0], $u[0])).to.deep.equal($span[0]);
    });

    it('should return a common element in ancestors even if they have same nodeName', () => {
      expect(dom.commonAncestor($b[0], $s[0])).to.deep.equal($div[0]);
    });
  });

  describe('predicates and emptiness helpers', () => {
    it('detects control sizing and inline paragraph states', () => {
      const $fixture = $$([
        '<div class="note-editable">',
        '  <div class="note-control-sizing"></div>',
        '  <p><span class="inside-para">text</span></p>',
        '  <span class="body-inline">outside</span>',
        '  <ul><li>item</li></ul>',
        '</div>',
      ].join(''));

      expect(dom.isControlSizing($fixture.find('.note-control-sizing')[0])).to.be.true;
      expect(dom.isPurePara($fixture.find('p')[0])).to.be.true;
      expect(dom.isPurePara($fixture.find('li')[0])).to.be.false;
      expect(dom.isParaInline($fixture.find('.inside-para')[0])).to.be.true;
      expect(dom.isBodyInline($fixture.find('.body-inline')[0])).to.be.true;
      expect(dom.isInline($fixture.find('p')[0])).to.be.false;
    });

    it('detects empty nodes, nested emptiness, and blank padding', () => {
      const $empty = $$('<p></p>');
      const $blank = $$('<p><br></p>');
      const $nested = $$('<div><span></span></div>');
      const textOnlyEmpty = document.createElement('span');
      textOnlyEmpty.appendChild(document.createTextNode(''));

      expect(dom.isEmpty($empty[0])).to.be.true;
      expect(dom.isEmpty($blank[0])).to.be.true;
      expect(dom.isEmpty(textOnlyEmpty)).to.be.true;
      expect(dom.deepestChildIsEmpty($nested[0])).to.be.false;

      dom.appendChildNodes($empty[0], [document.createTextNode('filled')], true);
      expect(dom.isEmpty($empty[0])).to.be.false;
    });
  });

  describe('listNext', () => {
    let $cont, $u, $s, $i;
    beforeAll(() => {
      $cont = $$('<div class="note-editable"><b>b</b><u>u</u><s>s</s><i>i</i></div>'); // busi
      $u = $cont.find('u');
      $s = $cont.find('s');
      $i = $cont.find('i');
    });

    it('should return an array of next sibling elements including itself', () => {
      expect(dom.listNext($u[0])).to.deep.equal([$u[0], $s[0], $i[0]]);
    });

    it('should return itself if there are no next sibling', () => {
      expect(dom.listNext($i[0])).to.deep.equal([$i[0]]);
    });

    it('should return an array of next sibling elements before predicate is true', () => {
      expect(dom.listNext($s[0], func.eq($i[0]))).to.deep.equal([$s[0]]);
    });
  });

  describe('listPrev', () => {
    let $cont, $b, $u, $s, $i;
    beforeAll(() => {
      $cont = $$('<div class="note-editable"><b>b</b><u>u</u><s>s</s><i>i</i></div>'); // busi
      $b = $cont.find('b');
      $u = $cont.find('u');
      $s = $cont.find('s');
      $i = $cont.find('i');
    });

    it('should return an array of previous sibling elements including itself', () => {
      expect(dom.listPrev($s[0])).to.deep.equal([$s[0], $u[0], $b[0]]);
    });

    it('should return itself if there are no previous sibling', () => {
      expect(dom.listPrev($b[0])).to.deep.equal([$b[0]]);
    });

    it('should return an array of previous sibling elements before predicate is true', () => {
      expect(dom.listPrev($i[0], func.eq($s[0]))).to.deep.equal([$i[0]]);
    });
  });

  describe('position', () => {
    let $cont, $b, $u, $s, $i;
    beforeAll(() => {
      $cont = $$('<div class="note-editable"><b>b</b><u>u</u><s>s</s><i>i</i></div>'); // busi
      $b = $cont.find('b');
      $u = $cont.find('u');
      $s = $cont.find('s');
      $i = $cont.find('i');
    });

    it('should return the position of element', () => {
      expect(dom.position($b[0])).to.be.equal(0);
      expect(dom.position($u[0])).to.be.equal(1);
      expect(dom.position($s[0])).to.be.equal(2);
      expect(dom.position($i[0])).to.be.equal(3);
    });

    it('should return position 0 for text node in b', () => {
      expect(dom.position($b[0].firstChild)).to.be.equal(0);
    });
  });

  describe('makeOffsetPath', () => {
    let $cont, $b, $u, $s, $i;
    beforeAll(() => {
      $cont = $$('<div class="note-editable"><b>b</b><u>u</u><s>s</s><i>i</i></div>'); // busi
      $b = $cont.find('b');
      $u = $cont.find('u');
      $s = $cont.find('s');
      $i = $cont.find('i');
    });

    it('should return empty array if two elements are same', () => {
      expect(dom.makeOffsetPath($cont[0], $cont[0])).to.deep.equal([]);
    });

    it('should return offset path array between two elements #1', () => {
      expect(dom.makeOffsetPath($cont[0], $b[0])).to.deep.equal([0]);
      expect(dom.makeOffsetPath($cont[0], $b[0].firstChild)).to.deep.equal([0, 0]);
    });

    it('should return offset path array between two elements #2', () => {
      expect(dom.makeOffsetPath($cont[0], $u[0])).to.deep.equal([1]);
      expect(dom.makeOffsetPath($cont[0], $u[0].firstChild)).to.deep.equal([1, 0]);
    });

    it('should return offset path array between two elements #3', () => {
      expect(dom.makeOffsetPath($cont[0], $s[0])).to.deep.equal([2]);
      expect(dom.makeOffsetPath($cont[0], $s[0].firstChild)).to.deep.equal([2, 0]);
    });

    it('should return offset path array between two elements #2', () => {
      expect(dom.makeOffsetPath($cont[0], $i[0])).to.deep.equal([3]);
      expect(dom.makeOffsetPath($cont[0], $i[0].firstChild)).to.deep.equal([3, 0]);
    });
  });

  describe('fromOffsetPath', () => {
    let $cont, $b, $u, $s, $i;
    beforeAll(() => {
      $cont = $$('<div class="note-editable"><b>b</b><u>u</u><s>s</s><i>i</i></div>'); // busi
      $b = $cont.find('b');
      $u = $cont.find('u');
      $s = $cont.find('s');
      $i = $cont.find('i');
    });

    it('should return the element by offsetPath', () => {
      let cont = $cont[0];
      [$b[0], $u[0], $s[0], $i[0]].forEach((node) => {
        expect(dom.fromOffsetPath(cont, dom.makeOffsetPath(cont, node))).to.deep.equal(node);
        let child = node.firstChild;
        expect(dom.fromOffsetPath(cont, dom.makeOffsetPath(cont, child))).to.deep.equal(child);
      });
    });
  });

  describe('splitTree', () => {
    let $para;
    beforeEach(() => {
      let $busi = $$('<div class="note-editable"><p><b>b</b><u>u</u><s>strike</s><i>i</i></p></div>'); // busi
      $para = $busi.clone().find('p');
    });

    describe('element pivot case', () => {
      it('should be split by u tag with offset 0', () => {
        let $u = $para.find('u');
        dom.splitTree($para[0], { node: $u[0], offset: 0 });

        expect($para.html()).to.equalsIgnoreCase('<b>b</b><u><br></u>');
        expect($para.next().html()).to.equalsIgnoreCase('<u>u</u><s>strike</s><i>i</i>');
      });

      it('should be split by u tag with offset 1', () => {
        let $u = $para.find('u');
        dom.splitTree($para[0], { node: $u[0], offset: 1 });

        expect($para.html()).to.equalsIgnoreCase('<b>b</b><u>u</u>');
        expect($para.next().html()).to.equalsIgnoreCase('<u><br></u><s>strike</s><i>i</i>');
      });

      it('should be split by b tag with offset 0 (left edge case)', () => {
        let $b = $para.find('b');
        dom.splitTree($para[0], { node: $b[0], offset: 0 });

        expect($para.html()).to.equalsIgnoreCase('<b><br></b>');
        expect($para.next().html()).to.equalsIgnoreCase('<b>b</b><u>u</u><s>strike</s><i>i</i>');
      });

      it('should be split by i tag with offset 1 (right edge case)', () => {
        let $i = $para.find('i');
        dom.splitTree($para[0], { node: $i[0], offset: 1 });

        expect($para.html()).to.equalsIgnoreCase('<b>b</b><u>u</u><s>strike</s><i>i</i>');
        expect($para.next().html()).to.equalsIgnoreCase('<i><br></i>');
      });

      it('should discard first split if empty and isDiscardEmptySplits=true', () => {
        var $u = $para.find('u');
        dom.splitTree($para[0], { node: $u[0], offset: 0 }, { isDiscardEmptySplits: true });

        expect($para.html()).to.equalsIgnoreCase('<b>b</b>');
        expect($para.next().html()).to.equalsIgnoreCase('<u>u</u><s>strike</s><i>i</i>');
      });

      it('should discard second split if empty and isDiscardEmptySplits=true', () => {
        var $u = $para.find('u');
        dom.splitTree($para[0], { node: $u[0], offset: 1 }, { isDiscardEmptySplits: true });

        expect($para.html()).to.equalsIgnoreCase('<b>b</b><u>u</u>');
        expect($para.next().html()).to.equalsIgnoreCase('<s>strike</s><i>i</i>');
      });
    });

    describe('textNode case', () => {
      it('should be split by s tag with offset 3 (middle case)', () => {
        let $s = $para.find('s');
        dom.splitTree($para[0], { node: $s[0].firstChild, offset: 3 });

        expect($para.html()).to.equalsIgnoreCase('<b>b</b><u>u</u><s>str</s>');
        expect($para.next().html()).to.equalsIgnoreCase('<s>ike</s><i>i</i>');
      });

      it('should be split by s tag with offset 0 (left edge case)', () => {
        let $s = $para.find('s');
        dom.splitTree($para[0], { node: $s[0].firstChild, offset: 0 });

        expect($para.html()).to.equalsIgnoreCase('<b>b</b><u>u</u><s><br></s>');
        expect($para.next().html()).to.equalsIgnoreCase('<s>strike</s><i>i</i>');
      });

      it('should be split by s tag with offset 6 (right edge case)', () => {
        let $s = $para.find('s');
        dom.splitTree($para[0], { node: $s[0].firstChild, offset: 6 });

        expect($para.html()).to.equalsIgnoreCase('<b>b</b><u>u</u><s>strike</s><i><br></i>');
        expect($para.next().html()).to.equalsIgnoreCase('<i>i</i>');
      });

      it('should be split by s tag with offset 3 (2 depth case)', () => {
        let $s = $para.find('s');
        dom.splitTree($s[0], { node: $s[0].firstChild, offset: 3 });

        expect($para.html()).to.equalsIgnoreCase('<b>b</b><u>u</u><s>str</s><s>ike</s><i>i</i>');
      });

      it('should be split by s tag with offset 3 (1 depth and textNode case)', () => {
        let $s = $para.find('s');
        dom.splitTree($s[0].firstChild, { node: $s[0].firstChild, offset: 3 });

        expect($para.html()).to.equalsIgnoreCase('<b>b</b><u>u</u><s>strike</s><i>i</i>');
      });

      it('should be split by span tag with offset 2 (1 depth and element case)', () => {
        let $cont = $$('<div class="note-editable"><p><span><b>b</b><u>u</u><s>s</s><i>i</i></span></p></div>'); // busi
        let $span = $cont.find('span');
        dom.splitTree($span[0], { node: $span[0], offset: 2 });

        expect($cont.html()).to.equalsIgnoreCase('<p><span><b>b</b><u>u</u></span><span><s>s</s><i>i</i></span></p>');
      });
    });
  });

  describe('splitPoint', () => {
    it('should return rightNode and container for empty paragraph with inline', () => {
      let $editable = $$('<div class="note-editable"><p><br></p></div>');
      let $para = $editable.clone().find('p');
      let $br = $para.find('br');

      let result = dom.splitPoint({ node: $para[0], offset: 0 }, true);
      expect(result).to.deep.equal({ rightNode: $br[0], container: $para[0] });
    });
  });

  describe('appendChildNodes and point helpers', () => {
    it('adds a placeholder br before appending a nested list to an empty li', () => {
      const li = document.createElement('li');
      const ul = document.createElement('ul');

      dom.appendChildNodes(li, [ul]);

      expect(li.firstChild.tagName).to.equal('BR');
      expect(li.lastChild.tagName).to.equal('UL');
    });

    it('walks previous and next points across text and editable boundaries', () => {
      const $editable = $$('<div class="note-editable"><p>ab</p><p>cd</p></div>');
      const firstText = $editable.find('p')[0].firstChild;
      const secondText = $editable.find('p')[1].firstChild;

      expect(dom.prevPoint({ node: firstText, offset: 0 }).node.nodeName).to.equal('P');
      expect(dom.nextPoint({ node: firstText, offset: 2 }).node.nodeName).to.equal('P');
      expect(dom.nextPointWithEmptyNode({ node: $editable[0], offset: 2 })).to.be.null;
      expect(dom.isCharPoint({ node: firstText, offset: 1 })).to.be.true;
      expect(dom.isSpacePoint({ node: document.createTextNode('a '), offset: 2 })).to.be.true;
      expect(dom.prevPointUntil({ node: secondText, offset: 2 }, (point) => point.offset === 1).offset).to.equal(1);
      expect(dom.nextPointUntil({ node: firstText, offset: 0 }, (point) => point.node === secondText).node).to.equal(secondText);
    });
  });

  describe('isVisiblePoint', () => {
    it('should detect as visible when there is a table inside a div', () => {
      let $editable = $$('<div><table></table></div>');
      let $point = $editable.clone().find('div');

      let result = dom.isVisiblePoint($point);
      expect(result).to.be.true;
    });
  });

  describe('additional helper coverage', () => {
    it('covers predicates, sibling helpers, and ancestor edge cases', () => {
      const $fixture = $$([
        '<div class="note-editable">',
        '  <h2>heading</h2>',
        '  <p><span><em>only</em></span></p>',
        '  <p><span>a</span><span>b</span></p>',
        '  <video></video>',
        '  <iframe class="note-video-clip"></iframe>',
        '  <style class="note-styletag"></style>',
        '</div>',
      ].join(''));
      const heading = $fixture.find('h2')[0];
      const emText = $fixture.find('em')[0].firstChild;
      const spanNodes = $fixture.find('p').eq(1).find('span');

      expect(dom.isElement(heading)).to.be.true;
      expect(dom.isElement(emText)).to.be.false;
      expect(dom.isHeading(heading)).to.be.true;
      expect(dom.isHeading(spanNodes[0])).to.be.false;
      expect(dom.isClosestSibling(spanNodes[0], spanNodes[1])).to.be.true;
      expect(dom.isClosestSibling(spanNodes[0], heading)).to.be.false;
      expect(dom.withClosestSiblings(spanNodes[0])).to.deep.equal([spanNodes[0], spanNodes[1]]);
      expect(dom.withClosestSiblings(spanNodes[0], dom.isSpan)).to.deep.equal([spanNodes[0], spanNodes[1]]);
      expect(dom.withClosestSiblings(spanNodes[1], dom.isSpan)).to.deep.equal([spanNodes[0], spanNodes[1]]);
      expect(dom.withClosestSiblings(spanNodes[1], dom.isB)).to.deep.equal([spanNodes[1]]);
      expect(dom.singleChildAncestor(emText, dom.isSpan)).to.equal($fixture.find('em')[0].parentNode);
      expect(dom.lastAncestor(emText, dom.isInline)).to.equal($fixture.find('span')[0]);
      expect(dom.singleChildAncestor($$('<div class=\"note-editable\"><span><em>a</em></span></div>').find('em')[0].firstChild, dom.isB)).to.equal(null);
      expect(dom.nodeLength(null)).to.equal(0);
      expect(dom.isLeftEdgeOf(emText, $fixture.find('em')[0])).to.be.true;
      expect(dom.isRightEdgeOf($fixture.find('em')[0], null)).to.be.false;
      expect(dom.isLeftEdgePointOf({ node: emText, offset: 0 }, $fixture.find('em')[0])).to.be.true;
      expect(dom.isRightEdgePointOf({ node: emText, offset: emText.nodeValue.length }, $fixture.find('em')[0])).to.be.true;
      expect(dom.isVideoMedia($fixture.find('video')[0])).to.be.true;
      expect(dom.isVideoMedia($fixture.find('iframe')[0])).to.be.true;
      expect(dom.isVideoMedia(document.createElement('iframe'))).to.be.false;
      expect(dom.isCustomStyleTag($fixture.find('style')[0])).to.be.true;
      expect(dom.isCustomStyleTag(document.createTextNode('x'))).to.be.false;
      expect(dom.deepestChildIsEmpty($$('<div><span><br></span></div>')[0])).to.be.true;
    });

    it('covers traversal, visibility, and point walking branches', () => {
      const textHost = document.createElement('div');
      const firstText = document.createTextNode('a');
      const secondText = document.createTextNode('b');
      textHost.appendChild(firstText);
      textHost.appendChild(secondText);

      expect(dom.nextPoint({ node: firstText, offset: 1 }).node).to.equal(secondText);
      firstText.parent = { id: 'a' };
      secondText.parent = { id: 'b' };
      expect(dom.nextPoint({ node: firstText, offset: 1 }).node).to.equal(textHost);
      expect(dom.prevPoint({ node: secondText, offset: 1 }, true).offset).to.equal(0);
      expect(dom.nextPoint({ node: secondText, offset: 0 }, true).offset).to.equal(1);
      expect(dom.prevPointUntil(null, () => true)).to.be.null;
      expect(dom.nextPointUntil(null, () => true)).to.be.null;

      const $editable = $$('<div class="note-editable"><span></span><span>t</span></div>');
      expect(dom.nextPointWithEmptyNode({ node: $editable.find('span')[0], offset: 0 }).node).to.equal($editable.find('span')[1]);
      expect(dom.isVisiblePoint({ node: $$('<div><span>a</span><span>b</span></div>')[0], offset: 1 })).to.be.false;

      const visited = [];
      const start = { node: $editable[0], offset: 0 };
      const end = { node: $editable[0], offset: 2 };
      dom.walkPoint(start, end, (point) => visited.push(point.node.nodeName), true);
      expect(visited[0]).to.equal('DIV');
      expect(visited).to.include('SPAN');
    });

    it('covers create/remove/replace/value/html/position/event helpers', () => {
      const textNode = dom.createText('abc');
      expect(textNode.nodeValue).to.equal('abc');

      const parent = document.createElement('div');
      const wrapper = document.createElement('div');
      const keep = document.createElement('span');
      keep.textContent = 'kept';
      wrapper.appendChild(keep);
      parent.appendChild(wrapper);
      dom.remove(wrapper, false);
      expect(parent.firstChild).to.equal(keep);

      const removeNodeParent = { removeChild: vi.fn(), insertBefore: vi.fn() };
      const removable = { parentNode: removeNodeParent, removeNode: vi.fn() };
      dom.remove(removable, true);
      expect(removable.removeNode).toHaveBeenCalledWith(true);
      expect(dom.remove(null)).to.equal(undefined);
      const plainParent = document.createElement('div');
      const plainChild = document.createElement('span');
      plainParent.appendChild(plainChild);
      dom.remove(plainChild, true);
      expect(plainParent.childNodes.length).to.equal(0);

      const $editable = $$('<div class="note-editable"><div class="chain"><span><b>z</b></span></div></div>');
      dom.removeWhile($editable.find('b')[0], (node) => ['B', 'SPAN', 'DIV'].includes(node.nodeName));
      expect($editable.find('.chain').length).to.equal(0);

      const $same = $$('<p><span>x</span></p>');
      expect(dom.replace($same[0], 'p')).to.equal($same[0]);
      const $unstyled = $$('<p><span>y</span></p>');
      expect(dom.replace($unstyled[0], 'div').style.cssText).to.equal('');
      const $styled = $$('<p style="color:red"><span>x</span></p>');
      const replaced = dom.replace($styled[0], 'div');
      expect(replaced.tagName).to.equal('DIV');
      expect(replaced.style.cssText).to.contain('color');

      const $textarea = $$('<textarea>line1\nline2</textarea>');
      expect(dom.value($textarea, true)).to.equal('line1line2');
      const emptyTextarea = document.createElement('textarea');
      expect(dom.value({ get: () => emptyTextarea, val: () => 'fallback' })).to.equal('fallback');
      const plainDiv = document.createElement('div');
      plainDiv.innerHTML = '<p>plain</p>';
      expect(dom.value({ 0: plainDiv, html: () => plainDiv.innerHTML })).to.contain('plain');

      const $markup = $$('<div><p>one</p><ul><li>two</li></ul></div>');
      expect(dom.value($markup)).to.contain('<p>one</p>');
      expect(dom.html($markup)).to.contain('<ul>');
      expect(dom.html($markup, true)).to.contain('</p>\n');

      const placeholder = document.createElement('span');
      placeholder.style.display = 'block';
      placeholder.style.marginTop = '0px';
      placeholder.style.marginBottom = '0px';
      document.body.appendChild(placeholder);
      Object.defineProperty(placeholder, 'offsetHeight', { configurable: true, value: 10 });
      vi.spyOn(placeholder, 'getBoundingClientRect').mockReturnValue({ top: 20, left: 30 });
      expect(dom.posFromPlaceholder(placeholder)).to.deep.equal({ left: 30, top: 30 });
      expect(dom.commonAncestor(document.createElement('p'), document.createElement('p'))).to.be.null;
      expect(dom.singleChildAncestor($$('<p><span>a</span><span>b</span></p>').find('span')[0].firstChild, dom.isDiv)).to.be.null;
      const overflowRoot = $$('<div><span>one</span><span>two</span></div>')[0];
      expect(dom.fromOffsetPath(overflowRoot, [99])).to.equal(overflowRoot.lastChild);
      expect(dom.splitTree(document.createElement('div'), { node: null, offset: 0 })).to.equal(null);

      const $textSibling = $$('<div class="note-editable"><p><span><b>ab</b></span>cd</p></div>');
      expect(dom.splitTree($textSibling.find('p')[0], { node: $textSibling.find('b')[0].firstChild, offset: 2 })).to.exist;
      const blockSplit = dom.splitPoint({ node: $textSibling.find('p')[0], offset: 1 }, false);
      expect(blockSplit.container.nodeName).to.equal('DIV');
      const $newlineSibling = $$('<div class="note-editable"><p><span><b>ab</b></span>\n<i>x</i></p></div>');
      expect(dom.splitTree($newlineSibling.find('p')[0], { node: $newlineSibling.find('b')[0].firstChild, offset: 2 })).to.exist;

      const $button = $$('<button type="button"></button>').appendTo('body');
      const click = vi.fn();
      const focus = vi.fn();
      dom.attachEvents($button, { click, focus });
      $button.trigger('click').trigger('focus');
      expect(click).toHaveBeenCalledTimes(1);
      expect(focus).toHaveBeenCalledTimes(1);
      dom.detachEvents($button, { click, focus });
      $button.trigger('click').trigger('focus');
      expect(click).toHaveBeenCalledTimes(1);
      expect(focus).toHaveBeenCalledTimes(1);
    });
  });
});
