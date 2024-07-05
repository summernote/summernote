/**
 * LinkDialog.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */

import { describe, it, expect } from 'vitest';
import $ from 'jquery';
import range from '@/js/core/range';
import Context from '@/js/Context';
import LinkDialog from '@/js/module/LinkDialog';
import '@/styles/lite/summernote-lite';

describe('LinkDialog', () => {
  var context, dialog, $editable;

  beforeEach(() => {
    var options = $.extend({}, $.summernote.options);
    options.toolbar = [['insert', ['link']]];
    context = new Context(
      $(
        '<div>' +
          '<p><a href="https://summernote.org/" target="_blank">hello</a></p>' +
          '<p><a href="https://summernote.org/">world</a></p>' +
          '<p>http://summernote.org</p>' +
          '<p>summernote.org</p>' +
          '<p>summernote</p>' +
          '</div>',
      ),
      options,
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

      var checked = dialog.$dialog.find('.sn-checkbox-open-in-new-window input[type=checkbox]').is(':checked');
      expect(checked).to.be.true;
    });

    it('should uncheck new window without target=_blank', () => {
      range.createFromNode($editable.find('a')[1]).normalize().select();
      context.invoke('editor.setLastRange');
      dialog.show();

      var checked = dialog.$dialog.find('.sn-checkbox-open-in-new-window input[type=checkbox]').is(':checked');
      expect(checked).to.be.false;
    });

    // add protocol automatically
    it('should not modify linkInfo.url when initializing the dialog if linkInfo.url is defined and protocol exists', () => {
      range.createFromNode($editable.find('p')[2]).normalize().select();
      context.invoke('editor.setLastRange');
      dialog.show();

      var linkUrl = dialog.$dialog.find('.note-link-url').val();
      expect(linkUrl).to.equal('http://summernote.org');
    });

    it('should add protocol when initializing the dialog if linkInfo.url is defined and protocol not exists', () => {
      range.createFromNode($editable.find('p')[3]).normalize().select();
      context.invoke('editor.setLastRange');
      dialog.show();

      var linkUrl = dialog.$dialog.find('.note-link-url').val();
      expect(linkUrl).to.equal('http://summernote.org');
    });

    it('should add http protocol during the onChange event if linkInfo.url is undefined and protocol not exists', () => {
      range.createFromNode($editable.find('p')[4]).normalize().select();
      context.invoke('editor.setLastRange');
      dialog.show();

      var $input = dialog.$dialog.find('.note-link-url');
      expect($input.val()).to.equal('');
      $input.val('summernote').blur();
      expect($input.val()).to.equal('http://summernote');
    });

    it('should add mailto protocol during the onchange event if linkinfo.url is undefined and protocol not exists', () => {
      range.createFromNode($editable.find('p')[4]).normalize().select();
      context.invoke('editor.setLastRange');
      dialog.show();

      var $input = dialog.$dialog.find('.note-link-url');
      expect($input.val()).to.equal('');
      $input.val('email@example.com').blur();
      expect($input.val()).to.equal('mailto://email@example.com');
    });

    it('should add tel protocol during the onchange event if linkinfo.url is undefined and protocol not exists', () => {
      range.createFromNode($editable.find('p')[4]).normalize().select();
      context.invoke('editor.setLastRange');
      dialog.show();

      var $input = dialog.$dialog.find('.note-link-url');
      expect($input.val()).to.equal('');

      $input.val('03-1234-5678').blur();
      expect($input.val()).to.equal('tel://03-1234-5678');

      $input.val('090-1234-5678').blur();
      expect($input.val()).to.equal('tel://090-1234-5678');

      $input.val('03 1234 5678').blur();
      expect($input.val()).to.equal('tel://03 1234 5678');

      $input.val('090 1234 5678').blur();
      expect($input.val()).to.equal('tel://090 1234 5678');

      $input.val('0312345678').blur();
      expect($input.val()).to.equal('tel://0312345678');

      $input.val('09012345678').blur();
      expect($input.val()).to.equal('tel://09012345678');

      $input.val('+81-3-1234-5678').blur();
      expect($input.val()).to.equal('tel://+81-3-1234-5678');

      $input.val('81-3-1234-5678').blur();
      expect($input.val()).to.equal('tel://81-3-1234-5678');

      $input.val('+81-90-1234-5678').blur();
      expect($input.val()).to.equal('tel://+81-90-1234-5678');

      $input.val('81-90-1234-5678').blur();
      expect($input.val()).to.equal('tel://81-90-1234-5678');

      $input.val('+81 3 1234 5678').blur();
      expect($input.val()).to.equal('tel://+81 3 1234 5678');

      $input.val('81 3 1234 5678').blur();
      expect($input.val()).to.equal('tel://81 3 1234 5678');

      $input.val('+81 90 1234 5678').blur();
      expect($input.val()).to.equal('tel://+81 90 1234 5678');

      $input.val('81 90 1234 5678').blur();
      expect($input.val()).to.equal('tel://81 90 1234 5678');

      $input.val('+81 3-1234-5678').blur();
      expect($input.val()).to.equal('tel://+81 3-1234-5678');

      $input.val('81 3-1234-5678').blur();
      expect($input.val()).to.equal('tel://81 3-1234-5678');

      $input.val('+81 90-1234-5678').blur();
      expect($input.val()).to.equal('tel://+81 90-1234-5678');

      $input.val('81 90-1234-5678').blur();
      expect($input.val()).to.equal('tel://81 90-1234-5678');
    });
  });
});
