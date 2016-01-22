/**
 * Buttons.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */
/* jshint unused: false */
define([
  'chai',
  'helper',
  'jquery',
  'summernote/lite/settings',
  'summernote/base/core/agent',
  'summernote/base/core/dom',
  'summernote/base/core/range',
  'summernote/base/Context'
], function (chai, helper, $, settings, agent, dom, range, Context) {
  'use strict';

  var expect = chai.expect;

  describe('bs3:module.Buttons', function () {
    var editor, context, $note;

    beforeEach(function () {
      var $note = $('<div><p>hello</p></div>');

      $note.appendTo('body');

      var options = $.extend({}, $.summernote.options);
      options.langInfo = $.extend(true, {}, $.summernote.lang['en-US'], $.summernote.lang[options.lang]);
      context = new Context($note, options);
      editor = context.modules.editor;
    });


    describe('bold click', function () {
      it('should be clicked bold button ', function () {

        var p = context.layoutInfo.editable.find('p')[0];
        range.createFromNode(p).normalize().select();

        editor.bold();

        var count = $(context.invoke('code')).find('b').length;
        expect(count).to.be.equal(1);

      });
    });

  });

});
