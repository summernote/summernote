/**
 * HintPopover.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */
import chai from 'chai';
import $ from 'jquery';
import Context from '../../../src/js/base/Context';
import range from '../../../src/js/base/core/range';
import env from '../../../src/js/base/core/env';
import key from '../../../src/js/base/core/key';
import '../../../src/js/bs4/settings';

describe('HintPopover', () => {
  var expect = chai.expect;
  var $note, editor, context, $editable;

  function expectContents(context, markup) {
    expect(context.layoutInfo.editable.html()).to.equalsIgnoreCase(markup);
  }

  beforeEach(function() {
    $('body').empty(); // important !
    $note = $('<div><p>hello world</p></div>');
    $note.appendTo('body');

    var options = $.extend({}, $.summernote.options, {
      hint: {
        mentions: ['jayden', 'sam', 'alvin', 'david'],
        match: /^\w*#(\w*)$/,
        search: function(keyword, callback) {
          callback($.grep(this.mentions, function(item) {
            return item.indexOf(keyword) === 0;
          }));
        },
        content: function(item) {
          return item;
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
    expect($('.note-hint-popover').css('display')).to.equals('none');
  });

  it('should be shown when it matches the given condition', (done) => {
    var textNode = $editable.find('p')[0].firstChild;
    editor.setLastRange(range.create(textNode, 5, textNode, 5).select());
    editor.insertText(' #');
    $editable.keyup();

    setTimeout(() => {
      expect($('.note-hint-popover').css('display')).to.equals('block');
      done();
    }, 10);
  });

  it('should be replaced with the selected hint', (done) => {
    var textNode = $editable.find('p')[0].firstChild;
    editor.setLastRange(range.create(textNode, 5, textNode, 5).select());
    editor.insertText(' #');
    $editable.keyup();

    setTimeout(() => {
      var e = $.Event('keydown');
      e.keyCode = key.code.ENTER;
      $note.trigger('summernote.keydown', e);

      setTimeout(() => {
        expectContents(context, '<p>hello #jayden world</p>');
        done();
      }, 10);
    }, 10);
  });

  it('should move selection by pressing arrow key', (done) => {
    var textNode = $editable.find('p')[0].firstChild;
    editor.setLastRange(range.create(textNode, 5, textNode, 5).select());
    editor.insertText(' #');
    $editable.keyup();

    setTimeout(() => {
      var e = $.Event('keydown');
      e.keyCode = key.code.DOWN;
      $note.trigger('summernote.keydown', e);
      e.keyCode = key.code.ENTER;
      $note.trigger('summernote.keydown', e);

      setTimeout(() => {
        expectContents(context, '<p>hello #sam world</p>');
        done();
      }, 10);
    }, 10);
  });
});
