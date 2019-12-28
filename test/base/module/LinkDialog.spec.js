/**
 * LinkDialog.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */
import chai from 'chai';
import $ from 'jquery';
import range from '../../../src/js/base/core/range';
import Context from '../../../src/js/base/Context';
import LinkDialog from '../../../src/js/base/module/LinkDialog';
import '../../../src/js/bs4/settings';

describe('LinkDialog', () => {
  var expect = chai.expect;
  var context, dialog, $editable;

  beforeEach(() => {
    var options = $.extend({}, $.summernote.options);
    options.toolbar = [
      ['insert', ['link']],
    ];
    context = new Context(
      $('<div>' +
        '<p><a href="https://summernote.org/" target="_blank">hello</a></p>' +
        '<p><a href="https://summernote.org/">world</a></p>' +
        '<p><a href="summernote.org/">summer</a></p>' +
        '<p>summer</p>' +
        '<p>http://summer</p>' +
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
    // open-in-new-window
    it('should check new window when target=_blank', () => {
      range.createFromNode($editable.find('a')[0]).normalize().select();
      context.invoke('editor.setLastRange');
      dialog.show();

      var checked = dialog.$dialog
        .find('.sn-checkbox-open-in-new-window input[type=checkbox]')
        .is(':checked');
      expect(checked).to.be.true;
    });

    it('should uncheck new window without target=_blank', () => {
      range.createFromNode($editable.find('a')[1]).normalize().select();
      context.invoke('editor.setLastRange');
      dialog.show();

      var checked = dialog.$dialog
        .find('.sn-checkbox-open-in-new-window input[type=checkbox]')
        .is(':checked');
      expect(checked).to.be.false;
    });

    // use default protocol
    it('should uncheck default protocol if link (with protocol) exists', () => {
      range.createFromNode($editable.find('a')[1]).normalize().select();
      context.invoke('editor.setLastRange');
      dialog.show();

      var checked = dialog.$dialog
        .find('.sn-checkbox-use-protocol input[type=checkbox]')
        .is(':checked');
      expect(checked).to.be.false;
    });

    it('should uncheck default protocol if link (without protocol) exists', () => {
      range.createFromNode($editable.find('a')[2]).normalize().select();
      context.invoke('editor.setLastRange');
      dialog.show();

      var checked = dialog.$dialog
        .find('.sn-checkbox-use-protocol input[type=checkbox]')
        .is(':checked');
      expect(checked).to.be.false;
    });

    it('should check default protocol if link not exists', () => {
      range.createFromNode($editable.find('p')[3]).normalize().select();
      context.invoke('editor.setLastRange');
      dialog.show();

      var checked = dialog.$dialog
        .find('.sn-checkbox-use-protocol input[type=checkbox]')
        .is(':checked');
      expect(checked).to.be.true;
    });

    it('should check default protocol if link not exists although it has protocol', () => {
      range.createFromNode($editable.find('p')[4]).normalize().select();
      context.invoke('editor.setLastRange');
      dialog.show();

      var checked = dialog.$dialog
        .find('.sn-checkbox-use-protocol input[type=checkbox]')
        .is(':checked');
      expect(checked).to.be.true;
    });
  });
});
