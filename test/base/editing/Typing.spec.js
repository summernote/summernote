/**
 * Typing.spec.js
 * (c) 2015-present Summernote Team
 * (c) 2026-present Jürgen Schwind
 * Summernote Next may be freely distributed under the MIT license.
 */
/* jshint unused: false */
/* jshint -W101 */
import { afterEach, describe, it, expect, vi } from 'vitest';
import $$ from '@/js/core/dom-query.js';
import dom from '@/js/core/dom';
import range from '@/js/core/range';
import Typing from '@/js/editing/Typing';

describe('base:editing.Style', () => {
  const originalCreate = range.create;
  const originalAncestor = dom.ancestor;
  const originalIsEmpty = dom.isEmpty;
  const originalDeepestChildIsEmpty = dom.deepestChildIsEmpty;

  function typing(level) {
    return new Typing({ options: { blockquoteBreakingLevel: level } });
  }

  afterEach(() => {
    range.create = originalCreate;
    dom.ancestor = originalAncestor;
    dom.isEmpty = originalIsEmpty;
    dom.deepestChildIsEmpty = originalDeepestChildIsEmpty;
  });

  describe('base:editing.Typing', () => {
    describe('insertTab', () => {
      it('replaces the selection with non-breaking spaces and moves the range', () => {
        var $editable = $$('<div class="note-editable"><p>text</p></div>');
        var textNode = $editable.find('p')[0].firstChild;
        var rng = range.create(textNode, 1, textNode, 3);

        typing(0).insertTab(rng, 3);

        expect($editable.html()).to.equal('<p>t&nbsp;&nbsp;&nbsp;t</p>');
      });
    });

    describe('insertParagraph', () => {
      it('toggles the list off when pressing enter on an empty list item', () => {
        var instance = typing(0);
        var $editable = $$('<div class="note-editable"><ul><li><br></li></ul></div>');
        var toggleList = vi.fn();

        instance.bullet.toggleList = toggleList;
        instance.insertParagraph($editable[0], range.create($editable.find('li')[0], 0, $editable.find('li')[0], 0));

        expect(toggleList).toHaveBeenCalledWith('UL');
      });

      it('toggles the list off when the deepest child is empty', () => {
        var instance = typing(0);
        var list = document.createElement('ul');
        var item = document.createElement('li');
        var toggleList = vi.fn();

        list.appendChild(item);
        dom.ancestor = vi.fn(() => item);
        dom.isEmpty = vi.fn(() => false);
        dom.deepestChildIsEmpty = vi.fn(() => true);
        instance.bullet.toggleList = toggleList;
        instance.insertParagraph(list, {
          deleteContents: function() {
            return this;
          },
          wrapBodyInlineWithPara: function() {
            return this;
          },
          sc: item,
        });

        expect(toggleList).toHaveBeenCalledWith('UL');
      });

      it('removes empty anchors and replaces empty headings with paragraphs', () => {
        var $editable = $$('<div class="note-editable"><h1><a href="#"></a></h1></div>');

        typing(0).insertParagraph($editable[0], range.create($editable.find('h1')[0], 0, $editable.find('h1')[0], 0));

        expect($editable.html()).to.equal('<h1><br></h1><p><br></p>');
      });

      it('inserts empty paragraphs before or after inline root content', () => {
        var beforeEditable = $$('<div class="note-editable">text</div>');
        var afterEditable = $$('<div class="note-editable"></div>');
        var chain = {
          normalize: function() {
            return this;
          },
          select: function() {
            return this;
          },
          scrollIntoView: function() {
            return this;
          },
        };

        range.create = vi.fn(() => chain);
        typing(0).insertParagraph(beforeEditable[0], {
          deleteContents: function() {
            return this;
          },
          wrapBodyInlineWithPara: function() {
            return this;
          },
          sc: beforeEditable[0],
          so: 0,
        });
        typing(0).insertParagraph(afterEditable[0], {
          deleteContents: function() {
            return this;
          },
          wrapBodyInlineWithPara: function() {
            return this;
          },
          sc: afterEditable[0],
          so: 0,
        });

        expect(beforeEditable.html()).to.equal('<p><br></p>text');
        expect(afterEditable.html()).to.equal('<p><br></p>');
      });

      it('creates the working range itself when no range is provided', () => {
        var $editable = $$('<div class="note-editable"><p>text</p></div>');
        var originalRangeCreate = range.create;
        var finalSelection = {
          normalize: function() {
            return this;
          },
          select: function() {
            return this;
          },
          scrollIntoView: function() {
            return this;
          },
        };
        var initialRange = {
          deleteContents: function() {
            return this;
          },
          wrapBodyInlineWithPara: function() {
            return this;
          },
          sc: $editable.find('p')[0].firstChild,
          so: 1,
          getStartPoint: function() {
            return { node: this.sc, offset: this.so };
          },
        };
        var callCount = 0;

        range.create = function() {
          callCount += 1;
          return callCount === 1 ? initialRange : finalSelection;
        };

        typing(0).insertParagraph($editable[0]);

        expect($editable.html()).to.equal('<p>t</p><p>ext</p>');
        range.create = originalRangeCreate;
      });

      describe('blockquote breaking support', () => {
        var $editable;

        function check(html) {
          expect($editable.html()).to.equalsIgnoreCase(html);
        }

        beforeEach(() => {
          $editable = $$(
            '<div class="note-editable"><blockquote id="1">Part1<blockquote id="2">Part2.1<br>Part2.2</blockquote>Part3</blockquote></div>',
          );
        });

        it('should not break blockquote if blockquoteBreakingLevel=0', () => {
          typing(0).insertParagraph($editable, range.create($$('#2', $editable)[0].firstChild, 1));

          check(
            '<blockquote id="1">Part1<blockquote id="2"><p>P</p><p>art2.1<br>Part2.2</p></blockquote>Part3</blockquote>',
          );
        });

        it('should break the first blockquote if blockquoteBreakingLevel=1', () => {
          typing(1).insertParagraph($editable, range.create($$('#2', $editable)[0].firstChild, 1));

          check(
            '<blockquote id="1">Part1<blockquote id="2"><p>P</p></blockquote><p><br></p><blockquote id="2"><p>art2.1<br>Part2.2</p></blockquote>Part3</blockquote>',
          );
        });

        it('should break all blockquotes if blockquoteBreakingLevel=2', () => {
          typing(2).insertParagraph($editable, range.create($$('#2', $editable)[0].firstChild, 1));

          check(
            '<blockquote id="1">Part1<blockquote id="2"><p>P</p></blockquote></blockquote><p><br></p><blockquote id="1"><blockquote id="2"><p>art2.1<br>Part2.2</p></blockquote>Part3</blockquote>',
          );
        });

        it('should remove leading BR from split, when breaking is on the right edge of a line', () => {
          typing(1).insertParagraph($editable, range.create($$('#2', $editable)[0].firstChild, 7));

          check(
            '<blockquote id="1">Part1<blockquote id="2"><p>Part2.1</p></blockquote><p><br></p><blockquote id="2"><p>Part2.2</p></blockquote>Part3</blockquote>',
          );
        });

        it('should insert new paragraph after the blockquote, if break happens at the end of the blockquote', () => {
          typing(2).insertParagraph($editable, range.create($$('#1', $editable)[0].lastChild, 5));

          check(
            '<blockquote id="1"><p>Part1<blockquote id="2">Part2.1<br>Part2.2</blockquote>Part3</p></blockquote><p><br></p>',
          );
        });

        it('should insert new paragraph before the blockquote, if break happens at the beginning of the blockquote', () => {
          typing(2).insertParagraph($editable, range.create($$('#1', $editable)[0].firstChild, 0));

          check(
            '<p><br></p><blockquote id="1"><p>Part1<blockquote id="2">Part2.1<br>Part2.2</blockquote>Part3</p></blockquote>',
          );
        });
      });
    });
  });
});
