/**
 * HintPopover.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */

import { describe, it, expect, vi } from 'vitest';
import { nextTick } from '/test/util';
import $ from 'jquery';
import Context from '@/js/Context';
import range from '@/js/core/range';
import env from '@/js/core/env';
import key from '@/js/core/key';
import '@/styles/lite/summernote-lite';

describe('HintPopover', () => {
  var $note, editor, context, $editable;

  function expectContents(context, markup) {
    expect(context.layoutInfo.editable.html()).to.equalsIgnoreCase(markup);
  }

  describe('Single word hint', () => {
    beforeEach(function() {
      $('body').empty(); // important !
      $note = $('<div><p>hello world</p></div>');
      $note.appendTo('body');

      var options = $.extend({}, $.summernote.options, {
        hint: {
          mentions: ['jayden', 'sam', 'alvin', 'david'],
          match: /\B#(\w*)$/,
          search: function(keyword, callback) {
            callback(
              $.grep(this.mentions, function(item) {
                return item.indexOf(keyword) === 0;
              }),
            );
          },
          content: function(item) {
            return '#' + item;
          },
        },
      });

      context = new Context($note, options);
      editor = context.modules.editor;
      $editable = context.layoutInfo.editable;

      // [workaround]
      //  - Safari does not popup hintpopover
      //  - IE8-11 can't create range in headless mode
      if (env.isMSIE || env.isSafari) {
        this.skip();
      }
    });

    it('should not be shown without matches', () => {
      $editable.trigger('keyup');
      expect($('.note-hint-popover').css('display')).to.equals('none');
    });

    it('should be shown when it matches the given condition', async() => {
      var textNode = $editable.find('p')[0].firstChild;
      editor.setLastRange(range.create(textNode, 5, textNode, 5).select());
      editor.insertText(' #');
      $editable.trigger('keyup');

      await nextTick();
      expect($('.note-hint-popover').css('display')).to.equals('block');
    });

    it('should select the best matched item with the given condition', async() => {
      var textNode = $editable.find('p')[0].firstChild;
      editor.setLastRange(range.create(textNode, 5, textNode, 5).select());
      editor.insertText(' #al');
      $editable.trigger('keyup');

      await nextTick();
      // alvin should be activated
      const item = $('.note-hint-popover').find('.note-hint-item');
      expect(item.text()).to.equals('alvin');
      expect(item.hasClass('active')).to.be.true;
    });

    it('should be replaced with the selected hint', async() => {
      var textNode = $editable.find('p')[0].firstChild;
      editor.setLastRange(range.create(textNode, 5, textNode, 5).select());
      editor.insertText(' #');
      $editable.trigger('keyup');

      var onChange = vi.fn();
      $note.on('summernote.change', onChange);

      await nextTick();
      var e = $.Event('keydown');
      e.keyCode = key.code.ENTER;
      $note.trigger('summernote.keydown', e);

      await nextTick();
      expectContents(context, '<p>hello #jayden world</p>');
      expect(onChange).toHaveBeenCalledOnce();
    });

    it('should move selection by pressing arrow key', async() => {
      var textNode = $editable.find('p')[0].firstChild;
      editor.setLastRange(range.create(textNode, 5, textNode, 5).select());
      editor.insertText(' #');
      $editable.trigger('keyup');

      await nextTick();
      var e = $.Event('keydown');
      e.keyCode = key.code.DOWN;
      $note.trigger('summernote.keydown', e);
      e.keyCode = key.code.ENTER;
      $note.trigger('summernote.keydown', e);

      await nextTick();
      expectContents(context, '<p>hello #sam world</p>');
    });
  });

  describe('Multiple words hint', () => {
    beforeEach(function() {
      $('body').empty();
      $note = $('<div><p>hello world</p></div>');
      $note.appendTo('body');

      var options = $.extend({}, $.summernote.options, {
        hintMode: 'words',
        hintSelect: 'next',
        hint: {
          mentions: [
            {
              name: 'Jayden Smith',
              url: 'http://example.org/person/jayden-smith',
            },
            {
              name: 'Peter Pan',
              url: 'http://example.org/person/peter-pan',
            },
            {
              name: 'Lorca',
              url: 'http://example.org/person/lorca',
            },
            {
              name: 'David Summer',
              url: 'http://example.org/person/david-summer',
            },
          ],
          match: /\B@([a-z ]*)/i,
          search: function(keyword, callback) {
            callback(
              $.grep(this.mentions, function(item) {
                return item.name.toLowerCase().indexOf(keyword.toLowerCase()) === 0;
              }),
            );
          },
          template: function(item) {
            return item.name;
          },
          content: function(item) {
            return $('<a>')
              .attr('href', item.url)
              .text('@' + item.name)
              .get(0);
          },
        },
      });

      context = new Context($note, options);
      editor = context.modules.editor;
      $editable = context.layoutInfo.editable;

      // [workaround]
      //  - Safari does not popup hintpopover
      //  - IE8-11 can't create range in headless mode
      if (env.isMSIE || env.isSafari) {
        this.skip();
      }
    });

    it('should select the best matched item with the given condition', async() => {
      var textNode = $editable.find('p')[0].firstChild;
      editor.setLastRange(range.create(textNode, 5, textNode, 5).select());
      editor.insertText(' @David S');
      $editable.trigger('keyup');

      await nextTick();
      // David Summer should be activated
      const item = $('.note-hint-popover').find('.note-hint-item');
      expect(item.text()).to.equals('David Summer');
      expect(item.hasClass('active')).to.be.true;
    });

    it('should render hint result with given content', async() => {
      var textNode = $editable.find('p')[0].firstChild;
      editor.setLastRange(range.create(textNode, 5, textNode, 5).select());
      editor.insertText(' @David S');
      $editable.trigger('keyup');

      await nextTick();
      // alvin should be activated
      var e = $.Event('keydown');
      e.keyCode = key.code.ENTER;
      $note.trigger('summernote.keydown', e);

      await nextTick();
      expectContents(context, '<p>hello <a href="http://example.org/person/david-summer">@David Summer</a> world</p>');
    });
  });
});
