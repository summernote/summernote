/**
 * Context.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */
define([
  'chai',
  'spies',
  'chaidom',
  'jquery',
  'summernote/base/core/agent',
  'summernote/base/core/dom',
  'summernote/base/Context'
], function (chai, spies, chaidom, $, agent, dom, Context) {
  'use strict';

  var expect = chai.expect;
  chai.use(spies);
  chai.use(chaidom);

  describe('Context lifecycle', function () {
    it('should be initialized without calling callback', function () {
      var options = $.extend({}, $.summernote.options);
      options.langInfo = $.extend(true, {}, $.summernote.lang['en-US'], $.summernote.lang[options.lang]);

      var spy = chai.spy();
      var $note = $('<div><p>hello</p></div>');
      $note.on('summernote.change', spy);

      var context = new Context($note, options);
      expect(spy).to.have.not.been.called();

      // [workaround]
      //  - IE8-11 can't create range in headless mode
      if (!agent.isMSIE) {
        context.invoke('insertText', 'hello');
        expect(spy).to.have.been.called();
      }
    });

    it('should preserve user events handler after destroy', function () {
      var options = $.extend({}, $.summernote.options);
      options.langInfo = $.extend(true, {}, $.summernote.lang['en-US'], $.summernote.lang[options.lang]);

      var spy = chai.spy();
      var $note = $('<div><p>hello</p></div>');
      $note.on('click', spy);

      var context = new Context($note, options);
      context.destroy();

      $note.trigger('click');
      expect(spy).to.have.been.called();
    });
  });

  describe('Context', function () {
    var context;
    beforeEach(function () {
      var options = $.extend({}, $.summernote.options);
      options.langInfo = $.extend(true, {}, $.summernote.lang['en-US'], $.summernote.lang[options.lang]);
      context = new Context($('<div><p>hello</p></div>'), options);
    });

    it('should get or set contents with code', function () {
      expect(context.code()).to.equalsIgnoreCase('<p>hello</p>');
      context.code('<p>hello2</p>');
      expect(context.code()).to.equalsIgnoreCase('<p>hello2</p>');
    });

    it('should enable or disable editor', function () {
      expect(context.isDisabled()).to.be.false;
      context.disable();
      expect(context.isDisabled()).to.be.true;
      context.enable();
      expect(context.isDisabled()).to.be.false;
    });

    it('should preserve disabled status after reset', function () {
      expect(context.isDisabled()).to.be.false;
      context.disable();
      expect(context.isDisabled()).to.be.true;
      context.reset();
      expect(context.isDisabled()).to.be.true;
    });
  });
});
