/**
 * Buttons.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */

import $ from 'jquery';
import chai from 'chai';
import chaidom from 'test/chaidom';
import env from 'src/js/base/core/env';
import range from 'src/js/base/core/range';
import Context from 'src/js/base/Context';
import 'src/js/bs4/settings';

chai.use(chaidom);

describe('Buttons', () => {
  var expect = chai.expect;
  var assert = chai.assert;
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
    it('should execute bold command when it is clicked', (done) => {
      $toolbar.find('.note-btn-bold').click();
      expect($editable.html()).await(done).to.equalsIgnoreCase('<p><b>hello</b></p>');
    });
  });

  describe('bold button state updated', () => {
    it('should look toggled immediately when clicked', (done) => {
      var $button = $toolbar.find('.note-btn-bold');
      assert.isTrue($button.length === 1);
      assert.isFalse($button.hasClass('active'));
      $button.click();
      expect($button.hasClass('active')).await(done).to.be.true;
    });
  });

  describe('italic button', () => {
    it('should execute italic command when it is clicked', (done) => {
      $toolbar.find('.note-btn-italic').click();
      expect($editable.html()).await(done).to.equalsIgnoreCase('<p><i>hello</i></p>');
    });
  });

  describe('italic button state updated', () => {
    it('should look toggled immediately when clicked', (done) => {
      var $button = $toolbar.find('.note-btn-italic');
      assert.isTrue($button.length === 1);
      assert.isFalse($button.hasClass('active'));
      $button.click();
      expect($button.hasClass('active')).await(done).to.be.true;
    });
  });

  describe('underline button', () => {
    it('should execute underline command when it is clicked', (done) => {
      $toolbar.find('.note-btn-underline').click();
      expect($editable.html()).await(done).to.equalsIgnoreCase('<p><u>hello</u></p>');
    });
  });

  describe('underline button state updated', () => {
    it('should look toggled immediately when clicked', (done) => {
      var $button = $toolbar.find('.note-btn-underline');
      assert.isTrue($button.length === 1);
      assert.isFalse($button.hasClass('active'));
      $button.click();
      expect($button.hasClass('active')).await(done).to.be.true;
    });
  });

  describe('superscript button', () => {
    it('should execute superscript command when it is clicked', (done) => {
      $toolbar.find('.note-btn-superscript').click();
      expect($editable.html()).await(done).to.equalsIgnoreCase('<p><sup>hello</sup></p>');
    });
  });

  describe('superscript button state updated', () => {
    it('should look toggled immediately when clicked', (done) => {
      var $button = $toolbar.find('.note-btn-superscript');
      assert.isTrue($button.length === 1);
      assert.isFalse($button.hasClass('active'));
      $button.click();
      expect($button.hasClass('active')).await(done).to.be.true;
    });
  });

  describe('subscript button', () => {
    it('should execute subscript command when it is clicked', (done) => {
      $toolbar.find('.note-btn-subscript').click();
      expect($editable.html()).await(done).to.equalsIgnoreCase('<p><sub>hello</sub></p>');
    });
  });

  describe('subscript button state updated', () => {
    it('should look toggled immediately when clicked', (done) => {
      var $button = $toolbar.find('.note-btn-subscript');
      assert.isTrue($button.length === 1);
      assert.isFalse($button.hasClass('active'));
      $button.click();
      expect($button.hasClass('active')).await(done).to.be.true;
    });
  });

  describe('strikethrough button', () => {
    it('should execute strikethrough command when it is clicked', (done) => {
      $toolbar.find('.note-btn-strikethrough').click();
      expect($editable.html()).await(done).to.equalsIgnoreCase('<p><strike>hello</strike></p>');
    });
  });

  describe('strikethrough button state updated', () => {
    it('should look toggled immediately when clicked', (done) => {
      var $button = $toolbar.find('.note-btn-strikethrough');
      assert.isTrue($button.length === 1);
      assert.isFalse($button.hasClass('active'));
      $button.click();
      expect($button.hasClass('active')).await(done).to.be.true;
    });
  });

  describe('clear button state not updated when clicked', () => {
    it('should never look toggled when clicked', (done) => {
      var $button = $toolbar.find('i.note-icon-eraser').parent();
      assert.isTrue($button.length === 1);
      assert.isFalse($button.hasClass('active'));
      $button.click();
      expect($button.hasClass('active')).await(done).to.be.false;
    });
  });

  /* Below test cannot be passed under Firefox
  describe('font family button', () => {
    it('should select the right font family name in the dropdown list when it is clicked', (done) => {
      var $li = $toolbar.find('.dropdown-fontname a[data-value="Comic Sans MS"]');
      var $span = $toolbar.find('span.note-current-fontname');
      assert.isTrue($li.length === 1);
      assert.isTrue($span.text() !== 'Comic Sans MS');
      $li.click();
      expect($span.text()).await(done).to.equalsIgnoreCase('Comic Sans MS');
    });
  });
  */

  describe('font family button', () => {
    it('should change font family when it is clicked', (done) => {
      var $li = $toolbar.find('.dropdown-fontname a[data-value="Comic Sans MS"]');
      var $span = $toolbar.find('span.note-current-fontname');
      assert.isTrue($li.length === 1);
      assert.isTrue($span.text() !== 'Comic Sans MS');
      $li.click();
      expect($editable.find('p').children().first()).await(done).to.be.equalsStyle('"Comic Sans MS"', 'font-family');
    });
  });

  describe('recent color button in all color button', () => {
    it('should execute color command when it is clicked', (done) => {
      $toolbar.find('.note-color-all').find('.note-current-color-button').click();
      expect($editable.find('p').children().first()).await(done).to.be.equalsStyle('#FFFF00', 'background-color');
    });
  });

  describe('fore color button in all color button', () => {
    it('should execute fore color command when it is clicked', (done) => {
      var $button = $toolbar.find('.note-color-all .note-holder').find('.note-color-btn[data-event=foreColor]').eq(10);
      $button.click();
      expect($editable.find('p').children().first()).await(done).to.be.equalsStyle($button.data('value'), 'color');
    });
  });

  describe('back color button in all color button', () => {
    it('should execute back color command when it is clicked', (done) => {
      var $button = $toolbar.find('.note-color-all .note-holder').find('.note-color-btn[data-event=backColor]').eq(10);
      $button.click();
      expect($editable.find('p').children().first()).await(done).to.be.equalsStyle($button.data('value'), 'background-color');
    });
  });

  describe('color button in fore color button', () => {
    it('should execute fore color command when it is clicked', (done) => {
      var $button = $toolbar.find('.note-color-fore').find('.note-color-btn[data-event=foreColor]').eq(4);
      $button.click();
      expect($editable.find('p').children().first()).await(done).to.be.equalsStyle($button.data('value'), 'color');
    });
  });

  describe('back color button in back color button', () => {
    it('should execute back color command when it is clicked', (done) => {
      var $button = $toolbar.find('.note-color-back').find('.note-color-btn[data-event=backColor]').eq(20);
      $button.click();
      expect($editable.find('p').children().first()).await(done).to.be.equalsStyle($button.data('value'), 'background-color');
    });
  });

  describe('font size button', () => {
    it('should update font size button value when changing font size', (done) => {
      var $fontSizeDropdown = $toolbar.find('.dropdown-fontsize');
      var $fontSizeButton = $fontSizeDropdown.siblings('button');
      var $fontSizeList = $fontSizeDropdown.find('a');
      var selectedSize = '36';

      // click on dropdown button
      $fontSizeButton.trigger('click');
      // select a font size
      $fontSizeList.filter('[data-value="' + selectedSize + '"]').trigger('click');

      expect($fontSizeButton.text().trim()).await(done).to.equal(selectedSize);
    });
  });
});
