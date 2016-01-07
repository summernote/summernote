/**
 * Typing.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */
/* jshint unused: false */
/* jshint -W101 */
define([
  'chai',
  'helper',
  'summernote/base/core/range',
  'summernote/base/editing/Typing'
], function (chai, helper, range, Typing) {
  'use strict';

  var expect = chai.expect;

  function typing(level) {
    return new Typing({ options: { blockquoteBreakingLevel: level } });
  }

  describe('base:editing.Typing', function () {

    describe('insertParagraph', function () {

      describe('blockquote breaking support', function () {

        var $editable, quote;

        function check(html) {
          helper.equalsToUpperCase($editable.html(), html, expect);
        }

        beforeEach(function () {
          $editable = $('<div class="note-editable"><blockquote id="1">Part1<blockquote id="2">Part2.1<br>Part2.2</blockquote>Part3</blockquote></div>');
        });

        it('should not break blockquote if blockquoteBreakingLevel=0', function () {
          typing(0).insertParagraph($editable, range.create($('#2', $editable)[0].firstChild, 1));

          check('<blockquote id="1">Part1<blockquote id="2"><p>P</p><p>art2.1<br>Part2.2</p></blockquote>Part3</blockquote>');
        });

        it('should break the first blockquote if blockquoteBreakingLevel=1', function () {
          typing(1).insertParagraph($editable, range.create($('#2', $editable)[0].firstChild, 1));

          check('<blockquote id="1">Part1<blockquote id="2"><p>P</p></blockquote><p><br></p><blockquote id="2"><p>art2.1<br>Part2.2</p></blockquote>Part3</blockquote>');
        });

        it('should break all blockquotes if blockquoteBreakingLevel=2', function () {
          typing(2).insertParagraph($editable, range.create($('#2', $editable)[0].firstChild, 1));

          check('<blockquote id="1">Part1<blockquote id="2"><p>P</p></blockquote></blockquote><p><br></p><blockquote id="1"><blockquote id="2"><p>art2.1<br>Part2.2</p></blockquote>Part3</blockquote>');
        });

        it('should break all blockquotes if option is not defined', function () {
          typing().insertParagraph($editable, range.create($('#2', $editable)[0].firstChild, 1));

          check('<blockquote id="1">Part1<blockquote id="2"><p>P</p></blockquote></blockquote><p><br></p><blockquote id="1"><blockquote id="2"><p>art2.1<br>Part2.2</p></blockquote>Part3</blockquote>');
        });

        it('should break all blockquotes if context is not given', function () {
          new Typing().insertParagraph($editable, range.create($('#2', $editable)[0].firstChild, 1));

          check('<blockquote id="1">Part1<blockquote id="2"><p>P</p></blockquote></blockquote><p><br></p><blockquote id="1"><blockquote id="2"><p>art2.1<br>Part2.2</p></blockquote>Part3</blockquote>');
        });

        it('should remove leading BR from split, when breaking is on the right edge of a line', function () {
          typing(1).insertParagraph($editable, range.create($('#2', $editable)[0].firstChild, 7));

          check('<blockquote id="1">Part1<blockquote id="2"><p>Part2.1</p></blockquote><p><br></p><blockquote id="2"><p>Part2.2</p></blockquote>Part3</blockquote>');
        });

        it('should insert new paragraph after the blockquote, if break happens at the end of the blockquote', function () {
          typing().insertParagraph($editable, range.create($('#1', $editable)[0].lastChild, 5));

          check('<blockquote id="1"><p>Part1<blockquote id="2">Part2.1<br>Part2.2</blockquote>Part3</p></blockquote><p><br></p>');
        });

        it('should insert new paragraph before the blockquote, if break happens at the beginning of the blockquote', function () {
          typing().insertParagraph($editable, range.create($('#1', $editable)[0].firstChild, 0));

          check('<p><br></p><blockquote id="1"><p>Part1<blockquote id="2">Part2.1<br>Part2.2</blockquote>Part3</p></blockquote>');
        });

      });

    });

  });

});
