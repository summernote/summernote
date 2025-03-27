/**
 * Buttons.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */

import { describe, it, expect, beforeEach, assert } from 'vitest';
import { nextTick } from '/test/util';
import $ from 'jquery';
import env from '@/js/core/env';
import range from '@/js/core/range';
import Context from '@/js/Context';
import '@/styles/lite/summernote-lite';

describe('Buttons', () => {
  var context, $toolbar, $editable;

  beforeEach(() => {
    $('body').empty(); // important !
    var $note = $('<div><p>hello</p></div>').appendTo('body');

    var options = $.extend({}, $.summernote.options);
    options.toolbar = [
      ['font1', ['style', 'clear']],
      ['font2', ['bold', 'underline', 'italic', 'superscript', 'subscript', 'strikethrough']],
      ['font3', ['fontname', 'fontsize']],
      ['color', ['color', 'forecolor', 'backcolor']],
      ['para', ['ul', 'ol', 'paragraph']],
      ['table', ['table']],
      ['insert', ['link', 'picture', 'video']],
      ['view', ['fullscreen', 'codeview', 'help']],
    ];
    context = new Context($note, options);
    context.initialize();

    $toolbar = context.layoutInfo.toolbar;
    $editable = context.layoutInfo.editable;

    // Select the first paragraph
    range.createFromNode($editable.find('p')[0]).normalize().select();

    // [workaround]
    //  - IE8~11 can't create range in headless mode
    if (env.isMSIE) {
      this.skip();
    }
  });

  describe('bold button', () => {
    it('should execute bold command when it is clicked', async() => {
      $toolbar.find('.note-btn-bold').trigger('click');
      await nextTick();
      expect($editable.html()).to.equalsIgnoreCase('<p><b>hello</b></p>');
    });
  });

  describe('bold button state updated', () => {
    it('should look toggled immediately when clicked', async() => {
      var $button = $toolbar.find('.note-btn-bold');
      assert.isTrue($button.length === 1);
      assert.isFalse($button.hasClass('active'));
      $button.trigger('click');
      await nextTick();
      expect($button.hasClass('active')).to.be.true;
    });
  });

  describe('italic button', () => {
    it('should execute italic command when it is clicked', async() => {
      $toolbar.find('.note-btn-italic').trigger('click');
      await nextTick();
      expect($editable.html()).to.equalsIgnoreCase('<p><i>hello</i></p>');
    });
  });

  describe('italic button state updated', () => {
    it('should look toggled immediately when clicked', async() => {
      var $button = $toolbar.find('.note-btn-italic');
      assert.isTrue($button.length === 1);
      assert.isFalse($button.hasClass('active'));
      $button.trigger('click');
      await nextTick();
      expect($button.hasClass('active')).to.be.true;
    });
  });

  describe('underline button', () => {
    it('should execute underline command when it is clicked', async() => {
      $toolbar.find('.note-btn-underline').trigger('click');
      await nextTick();
      expect($editable.html()).to.equalsIgnoreCase('<p><u>hello</u></p>');
    });
  });

  describe('underline button state updated', () => {
    it('should look toggled immediately when clicked', async() => {
      var $button = $toolbar.find('.note-btn-underline');
      assert.isTrue($button.length === 1);
      assert.isFalse($button.hasClass('active'));
      $button.trigger('click');
      await nextTick();
      expect($button.hasClass('active')).to.be.true;
    });
  });

  describe('superscript button', () => {
    it('should execute superscript command when it is clicked', async() => {
      $toolbar.find('.note-btn-superscript').trigger('click');
      await nextTick();
      expect($editable.html()).to.equalsIgnoreCase('<p><sup>hello</sup></p>');
    });
  });

  describe('superscript button state updated', () => {
    it('should look toggled immediately when clicked', async() => {
      var $button = $toolbar.find('.note-btn-superscript');
      assert.isTrue($button.length === 1);
      assert.isFalse($button.hasClass('active'));
      $button.trigger('click');
      await nextTick();
      expect($button.hasClass('active')).to.be.true;
    });
  });

  describe('subscript button', () => {
    it('should execute subscript command when it is clicked', async() => {
      $toolbar.find('.note-btn-subscript').trigger('click');
      await nextTick();
      expect($editable.html()).to.equalsIgnoreCase('<p><sub>hello</sub></p>');
    });
  });

  describe('subscript button state updated', () => {
    it('should look toggled immediately when clicked', async() => {
      var $button = $toolbar.find('.note-btn-subscript');
      assert.isTrue($button.length === 1);
      assert.isFalse($button.hasClass('active'));
      $button.trigger('click');
      await nextTick();
      expect($button.hasClass('active')).to.be.true;
    });
  });

  describe('strikethrough button', () => {
    it('should execute strikethrough command when it is clicked', async() => {
      $toolbar.find('.note-btn-strikethrough').trigger('click');
      await nextTick();
      expect($editable.html()).to.equalsIgnoreCase('<p><strike>hello</strike></p>');
    });
  });

  describe('strikethrough button state updated', () => {
    it('should look toggled immediately when clicked', async() => {
      var $button = $toolbar.find('.note-btn-strikethrough');
      assert.isTrue($button.length === 1);
      assert.isFalse($button.hasClass('active'));
      $button.trigger('click');
      await nextTick();
      expect($button.hasClass('active')).to.be.true;
    });
  });

  describe('clear button state not updated when clicked', () => {
    it('should never look toggled when clicked', async() => {
      var $button = $toolbar.find('i.note-icon-eraser').parent();
      assert.isTrue($button.length === 1);
      assert.isFalse($button.hasClass('active'));
      $button.trigger('click');
      await nextTick();
      expect($button.hasClass('active')).to.be.false;
    });
  });

  /* Below test cannot be passed under Firefox
  describe('font family button', () => {
    it('should select the right font family name in the dropdown list when it is clicked', async () => {
      var $li = $toolbar.find('.dropdown-fontname a[data-value="Comic Sans MS"]');
      var $span = $toolbar.find('span.note-current-fontname');
      assert.isTrue($li.length === 1);
      assert.isTrue($span.text() !== 'Comic Sans MS');
      $li.click();
      await nextTick();
      expect($span.text()).toEqual('Comic Sans MS');
    });
  });
  */

  describe('font family button', () => {
    it('should change font family (Courier New) when it is clicked', async() => {
      var $li = $toolbar.find('.dropdown-fontname a[data-value="Courier New"]');
      var $span = $toolbar.find('span.note-current-fontname');
      assert.isTrue($li.length === 1);
      assert.isTrue($span.text() !== 'Courier New');
      $li.trigger('click');
      await nextTick();
      expect($editable.find('p').children().first()).to.be.equalsStyle('"Courier New"', 'font-family');
    });
    it('should change font family (Arial) when it is clicked', async() => {
      var $li = $toolbar.find('.dropdown-fontname a[data-value="Arial"]');
      var $span = $toolbar.find('span.note-current-fontname');
      assert.isTrue($li.length === 1);
      assert.isTrue($span.text() !== 'Arial');
      $li.trigger('click');
      await nextTick();
      expect($editable.find('p').children().first()).to.be.equalsStyle('"Arial"', 'font-family');
    });
    it('should change font family (Helvetica) when it is clicked', async() => {
      var $li = $toolbar.find('.dropdown-fontname a[data-value="Helvetica"]');
      var $span = $toolbar.find('span.note-current-fontname');
      assert.isTrue($li.length === 1);
      assert.isTrue($span.text() !== 'Helvetica');
      $li.trigger('click');
      await nextTick();
      expect($editable.find('p').children().first()).to.be.equalsStyle('"Helvetica"', 'font-family');
    });
  });

  describe('recent color button in all color button', () => {
    it('should execute color command when it is clicked', async() => {
      $toolbar.find('.note-color-all').find('.note-current-color-button').trigger('click');
      await nextTick();
      expect($editable.find('p').children().first()).to.be.equalsStyle('#FFFF00', 'background-color');
    });
  });

  describe('fore color button in all color button', () => {
    it('should execute fore color command when it is clicked', async() => {
      var $button = $toolbar.find('.note-color-all .note-holder').find('.note-color-btn[data-event=foreColor]').eq(10);
      $button.trigger('click');
      await nextTick();
      expect($editable.find('p').children().first()).to.be.equalsStyle($button.data('value'), 'color');
    });
  });

  describe('back color button in all color button', () => {
    it('should execute back color command when it is clicked', async() => {
      var $button = $toolbar.find('.note-color-all .note-holder').find('.note-color-btn[data-event=backColor]').eq(10);
      $button.trigger('click');
      await nextTick();
      expect($editable.find('p').children().first()).to.be.equalsStyle($button.data('value'), 'background-color');
    });
  });

  describe('color button in fore color button', () => {
    it('should execute fore color command when it is clicked', async() => {
      var $button = $toolbar.find('.note-color-fore').find('.note-color-btn[data-event=foreColor]').eq(4);
      $button.trigger('click');
      await nextTick();
      expect($editable.find('p').children().first()).to.be.equalsStyle($button.data('value'), 'color');
    });
  });

  describe('back color button in back color button', () => {
    it('should execute back color command when it is clicked', async() => {
      var $button = $toolbar.find('.note-color-back').find('.note-color-btn[data-event=backColor]').eq(20);
      $button.trigger('click');
      await nextTick();
      expect($editable.find('p').children().first()).to.be.equalsStyle($button.data('value'), 'background-color');
    });
  });

  describe('font size button', () => {
    it('should update font size button value when changing font size', async() => {
      var $fontSizeDropdown = $toolbar.find('.dropdown-fontsize');
      var $fontSizeButton = $fontSizeDropdown.siblings('button');
      var $fontSizeList = $fontSizeDropdown.find('a');
      var selectedSize = '36';

      // click on dropdown button
      $fontSizeButton.trigger('click');
      // select a font size
      $fontSizeList.filter('[data-value="' + selectedSize + '"]').trigger('click');

      await nextTick();
      expect($fontSizeButton.text().trim()).to.equal(selectedSize);
    });
  });
});
