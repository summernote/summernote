/**
 * Buttons.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */
define([
  'chai',
  'jquery',
  'summernote/base/core/agent',
  'summernote/base/core/range',
  'summernote/base/Context'
], function (chai, $, agent, range, Context) {
  'use strict';

  var expect = chai.expect;

  // [workaround]
  //  - IE8~11 can't create range in headless mode
  if (agent.isMSIE || agent.isEdge) {
    return;
  }

  describe('Buttons', function () {
    var context, $toolbar, $editable;

    beforeEach(function () {
      var $note = $('<div><p>hello</p></div>').appendTo('body');

      var options = $.extend({}, $.summernote.options);
      options.langInfo = $.extend(true, {}, $.summernote.lang['en-US'], $.summernote.lang[options.lang]);
      options.toolbar = [
        ['font1', ['style', 'clear']],
        ['font2', ['bold', 'underline', 'italic', 'superscript', 'subscript', 'strikethrough']],
        ['font3', ['fontname', 'fontsize']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['table', ['table']],
        ['insert', ['link', 'picture', 'video']],
        ['view', ['fullscreen', 'codeview', 'help']]
      ];
      context = new Context($note, options);
      context.initialize();

      $toolbar = context.layoutInfo.toolbar;
      $editable = context.layoutInfo.editable;
    });

    describe('bold button', function () {
      it('should execute bold command when it is clicked', function () {
        range.createFromNode($editable.find('p')[0]).normalize().select();

        $toolbar.find('.note-btn-bold').click();
        expect($editable.html()).to.equalsIgnoreCase('<p><b>hello</b></p>');
      });
    });

    describe('italic button', function () {
      it('should execute italic command when it is clicked', function () {
        range.createFromNode($editable.find('p')[0]).normalize().select();

        $toolbar.find('.note-btn-italic').click();
        expect($editable.html()).to.equalsIgnoreCase('<p><i>hello</i></p>');
      });
    });

    describe('underline button', function () {
      it('should execute underline command when it is clicked', function () {
        range.createFromNode($editable.find('p')[0]).normalize().select();

        $toolbar.find('.note-btn-underline').click();
        expect($editable.html()).to.equalsIgnoreCase('<p><u>hello</u></p>');
      });
    });

    describe('superscript button', function () {
      it('should execute superscript command when it is clicked', function () {
        range.createFromNode($editable.find('p')[0]).normalize().select();

        $toolbar.find('.note-btn-superscript').click();
        expect($editable.html()).to.equalsIgnoreCase('<p><sup>hello</sup></p>');
      });
    });

    describe('subscript button', function () {
      it('should execute subscript command when it is clicked', function () {
        range.createFromNode($editable.find('p')[0]).normalize().select();

        $toolbar.find('.note-btn-subscript').click();
        expect($editable.html()).to.equalsIgnoreCase('<p><sub>hello</sub></p>');
      });
    });

    describe('strikethrough button', function () {
      it('should execute strikethrough command when it is clicked', function () {
        range.createFromNode($editable.find('p')[0]).normalize().select();

        $toolbar.find('.note-btn-strikethrough').click();
        expect($editable.html()).to.equalsIgnoreCase('<p><strike>hello</strike></p>');
      });
    });

    describe('recent color button', function () {
      it('should execute color command when it is clicked', function () {
        range.createFromNode($editable.find('p')[0]).normalize().select();

        $toolbar.find('.note-current-color-button').click();

        var $span = $editable.find('span');
        expect($span).to.be.equalsStyle('#FFFF00', 'background-color');
      });
    });

    describe('fore color button', function () {
      it('should execute fore color command when it is clicked', function () {
        range.createFromNode($editable.find('p')[0]).normalize().select();

        var $button = $toolbar.find('[data-event=foreColor]').eq(10);
        $button.click();

        // TODO <font> tag deprecated in HTML5
        //  - https://github.com/summernote/summernote/issues/745
        var $font = $editable.find('font');
        expect($font).to.be.equalsStyle($button.data('value'), 'color');
      });
    });

    describe('back color button', function () {
      it('should execute back color command when it is clicked', function () {
        range.createFromNode($editable.find('p')[0]).normalize().select();

        var $button = $toolbar.find('[data-event=backColor]').eq(10);
        $button.click();

        var $span = $editable.find('span');
        expect($span).to.be.equalsStyle($button.data('value'), 'background-color');
      });
    });
  });
});
