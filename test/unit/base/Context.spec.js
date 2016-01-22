/**
 * Context.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */
/* jshint unused: false */
define([
  'chai',
  'spies',
  'helper',
  'jquery',
  'summernote/lite/settings',
  'summernote/base/core/agent',
  'summernote/base/core/dom',
  'summernote/base/Context'
], function (chai, spies, helper, $, settings, agent, dom, Context) {
  'use strict';

  var expect = chai.expect;
  chai.use(spies);

  describe('Context', function () {
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

    it('should preserve disabled status after reset', function () {
      var options = $.extend({}, $.summernote.options);
      options.langInfo = $.extend(true, {}, $.summernote.lang['en-US'], $.summernote.lang[options.lang]);

      var $note = $('<div><p>hello</p></div>');
      var context = new Context($note, options);

      expect(context.isDisabled()).to.be.false;
      context.disable();
      expect(context.isDisabled()).to.be.true;
      context.reset();
      expect(context.isDisabled()).to.be.true;
    });
  });
});
