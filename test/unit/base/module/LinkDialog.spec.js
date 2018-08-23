/**
 * LinkDialog.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */
import chai from 'chai';
import $ from 'jquery';
import range from '../../../../src/js/base/core/range';
import Context from '../../../../src/js/base/Context';
import LinkDialog from '../../../../src/js/base/module/LinkDialog';

describe('LinkDialog', () => {
  var expect = chai.expect;
  var context, dialog, $editable;

  beforeEach(() => {
    var options = $.extend({}, $.summernote.options);
    options.langInfo = $.extend(true, {}, $.summernote.lang['en-US'], $.summernote.lang[options.lang]);
    options.toolbar = [
      ['insert', ['link']]
    ];
    context = new Context(
      $('<div>' +
        '<p><a href="https://summernote.org/" target="_blank">hello</a></p>' +
        '<p><a href="https://summernote.org/">world</a></p>' +
        '</div>'),
      options
    );
    context.initialize();

    dialog = new LinkDialog(context);
    dialog.initialize();

    $editable = context.layoutInfo.editable;
    $editable.appendTo('body');
  });

  describe('LinkDialog', () => {
    it('should check new window when target=_blank', () => {
      range.createFromNode($editable.find('a')[0]).normalize().select();
      dialog.show();

      var checked = dialog.$dialog.find('#sn-checkbox-open-in-new-window').is(':checked');
      expect(checked).to.be.true;
    });

    it('should uncheck new window without target=_blank', () => {
      range.createFromNode($editable.find('a')[1]).normalize().select();
      dialog.show();

      var checked = dialog.$dialog.find('#sn-checkbox-open-in-new-window').is(':checked');
      expect(checked).to.be.false;
    });
  });
});
