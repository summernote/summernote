/**
 * Buttons.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */
define([
  'chai',
  'chaidom',
  'jquery',
  'bootstrap',
  'summernote/bs3/settings',
  'summernote/base/core/agent',
  'summernote/base/core/dom',
  'summernote/base/core/range',
  'summernote/base/Context'
], function (chai, chaidom, $, bootstrap, settings, agent, dom, range, Context) {
  'use strict';

  var expect = chai.expect;

  describe('bs3:module.Buttons', function () {
    var editor, context, $note, $toolbar, $editable, $dummy;

    beforeEach(function () {
      $note = $('<div><p>hello</p></div>');

      $note.appendTo('body');

      var options = $.extend({}, $.summernote.options);
      options.langInfo = $.extend(true, {}, $.summernote.lang['en-US'], $.summernote.lang[options.lang]);
      context = new Context($note, options);
      context.initialize();

      editor = context.modules.editor;
      $toolbar = context.layoutInfo.toolbar;
      $editable = context.layoutInfo.editable;

      $dummy = $('<div />');
    });


    describe('bold click', function () {
      it('should be clicked bold button ', function () {

        // select any node
        var p = $editable.find('p')[0];
        range.createFromNode(p).normalize().select();

        // bold click
        $toolbar.find('.note-btn-bold').click();

        // check element count
        var count = $(context.invoke('code')).find('b').length;
        expect(count).to.be.equal(1);

      });
    });

    describe('color button click', function () {
      it('should be clicked color button ', function () {

        // select any node
        var p = $editable.find('p')[0];
        range.createFromNode(p).normalize().select();

        // bold click
        $toolbar.find('.note-current-color-button').click();

        // check first current color
        $dummy.css('background-color', '#FFFF00');
        expect($(p).find('> :first').css('background-color')).to.be.equal($dummy.css('background-color'));

        // click fore color btn
        var $colorButton = $toolbar.find('[data-event=foreColor] .note-color-btn:nth-child(2)').eq(0);
        var selectColor = $colorButton.data('value');

        $colorButton.click();
        expect($(p).find('font[color=' + selectColor + ']').length).to.be.equal(1);

        // click back color btn
        var $backColorButton = $toolbar.find('[data-event=backColor] .note-color-btn:nth-child(2)').eq(0);
        var selectBackColor = $backColorButton.data('value');

        $backColorButton.click();

        // convert hex to rgb
        $dummy.css('background-color', selectBackColor);

        expect($(p).find('> :first').css('background-color')).to.be.equal($dummy.css('background-color'));
      });
    });

  });

});
