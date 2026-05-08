import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { nextTick } from '/test/util';
import $$ from '@/js/core/dom-query.js';
import range from '@/js/core/range';
import Context from '@/js/Context';
import '@/styles/bs5/summernote-bs5';

describe('Buttons', () => {
  let context;
  let $toolbar;
  let $editable;

  beforeEach(() => {
    $$('body').empty();
    const $note = $$('<div><p>hello</p></div>').appendTo('body');
    const options = $$.extend({}, $$.summernote.options, {
      toolbar: [
        ['font1', ['style', 'clear']],
        ['font2', ['bold', 'underline', 'italic', 'superscript', 'subscript', 'strikethrough']],
        ['font3', ['fontname', 'fontsize']],
        ['color', ['color', 'forecolor', 'backcolor']],
        ['para', ['ul', 'ol', 'paragraph', 'height']],
        ['table', ['table']],
        ['insert', ['link', 'picture', 'video']],
        ['view', ['fullscreen', 'codeview', 'help']],
      ],
    });

    context = new Context($note, options);
    $toolbar = context.layoutInfo.toolbar;
    $editable = context.layoutInfo.editable;

    context.modules.editor.setLastRange(
      range.createFromNode($editable.find('p')[0]).normalize().select(),
    );
  });

  afterEach(() => {
    context?.destroy();
    $$('body').empty();
  });

  it('executes basic formatting commands from toolbar buttons', async() => {
    $toolbar.find('.note-btn-bold').trigger('click');
    await nextTick();
    expect($editable.html()).to.equalsIgnoreCase('<p><b>hello</b></p>');

    context.invoke('code', '<p>hello</p>');
    range.createFromNode($editable.find('p')[0]).normalize().select();
    $toolbar.find('.note-btn-italic').trigger('click');
    await nextTick();
    expect($editable.html()).to.equalsIgnoreCase('<p><i>hello</i></p>');

    context.invoke('code', '<p>hello</p>');
    range.createFromNode($editable.find('p')[0]).normalize().select();
    $toolbar.find('.note-btn-underline').trigger('click');
    await nextTick();
    expect($editable.html()).to.equalsIgnoreCase('<p><u>hello</u></p>');
  });

  it('updates toggle state immediately for formatting buttons', async() => {
    const $button = $toolbar.find('.note-btn-bold');

    expect($button.hasClass('active')).to.be.false;
    $button.trigger('click');
    await nextTick();
    expect($button.hasClass('active')).to.be.true;
  });

  it('updates the font size button label after choosing a size', async() => {
    const $fontSizeDropdown = $toolbar.find('.dropdown-fontsize');
    const $fontSizeButton = $fontSizeDropdown.siblings('button');
    const $fontSizeList = $fontSizeDropdown.find('a');

    $fontSizeButton.trigger('click');
    $fontSizeList.filter('[data-value="36"]').trigger('click');
    await nextTick();

    expect($fontSizeButton.text().trim()).to.equal('36');
  });

  it('keeps the current text selection when using font and line height dropdowns', async() => {
    const $fontNameButton = $toolbar.find('.dropdown-fontname').siblings('button');
    const $fontNameItem = $toolbar.find('.dropdown-fontname a[data-value="Courier New"]');
    const $lineHeightButton = $toolbar.find('.dropdown-line-height').siblings('button');
    const $lineHeightItem = $toolbar.find('.dropdown-line-height a[data-value="2.0"]');
    const textNode = $editable.find('p')[0].firstChild;

    context.modules.editor.setLastRange(
      range.create(textNode, 0, textNode, textNode.textContent.length).select(),
    );
    $fontNameButton.trigger('mousedown');
    $fontNameButton.trigger('click');
    $fontNameItem.trigger('click');
    await nextTick();

    expect($editable.html()).to.equalsIgnoreCase('<p><span style="font-family: &quot;Courier New&quot;;">hello</span></p>');

    context.invoke('code', '<p>hello</p>');
    const resetTextNode = $editable.find('p')[0].firstChild;
    context.modules.editor.setLastRange(
      range.create(resetTextNode, 0, resetTextNode, resetTextNode.textContent.length).select(),
    );
    $lineHeightButton.trigger('mousedown');
    $lineHeightButton.trigger('click');
    $lineHeightItem.trigger('click');
    await nextTick();

    expect($editable.find('p')[0].style.lineHeight).to.equal('2');
  });

  it('tracks the current style tag and applies heading format', async() => {
    context.invoke('buttons.updateCurrentStyle');
    await nextTick();

    const $paragraphStyle = $toolbar.find('.dropdown-style a[data-value="p"]');
    expect($paragraphStyle.hasClass('checked')).to.be.true;

    context.modules.editor.setLastRange(
      range.createFromNode($editable.find('p')[0]).normalize().select(),
    );
    context.invoke('editor.formatBlock', 'h1');
    context.invoke('buttons.updateCurrentStyle');
    await nextTick();

    expect($editable.find('h1').length).to.equal(1);
  });

  it('marks the active line height even when the applied value is normalized', async() => {
    const $lineHeightButton = $toolbar.find('.dropdown-line-height').siblings('button');
    const $lineHeightItem = $toolbar.find('.dropdown-line-height a[data-value="2.0"]');

    context.modules.editor.setLastRange(
      range.createFromNode($editable.find('p')[0]).normalize().select(),
    );
    $lineHeightButton.trigger('click');
    $lineHeightItem.trigger('click');
    context.modules.editor.setLastRange(
      range.createFromNode($editable.find('p')[0]).normalize().select(),
    );
    context.invoke('buttons.updateCurrentStyle');
    await nextTick();

    expect($lineHeightItem.hasClass('checked')).to.be.true;
  });

  it('initializes BS5 tooltips for regular and dropdown buttons', () => {
    const $boldButton = $toolbar.find('.note-btn-bold');
    const $dropdownButton = $toolbar.find('.dropdown-toggle').first();

    expect($boldButton.attr('title')).to.contain(context.options.langInfo.font.bold);
    expect($dropdownButton.attr('title')).to.exist;
  });

  it('applies custom Bootstrap classes to the toolbar and toolbar buttons', () => {
    context.destroy();

    const $note = $$('<div><p>hello</p></div>').appendTo('body');
    const options = $$.extend({}, $$.summernote.options, {
      toolbarClassName: 'bg-primary border-primary text-white',
      toolbarButtonClassName: 'btn-light btn-lg',
      toolbar: [['font', ['bold', 'underline']]],
    });

    context = new Context($note, options);
    $toolbar = context.layoutInfo.toolbar;

    const $boldButton = $toolbar.find('.note-btn-bold');

    expect($toolbar.hasClass('bg-primary')).to.be.true;
    expect($toolbar.hasClass('border-primary')).to.be.true;
    expect($toolbar.hasClass('text-white')).to.be.true;
    expect($boldButton.hasClass('btn-light')).to.be.true;
    expect($boldButton.hasClass('btn-lg')).to.be.true;
    expect($boldButton.hasClass('btn-outline-secondary')).to.be.false;
    expect($boldButton.hasClass('btn-sm')).to.be.false;
  });

  it('supports native Bootstrap toolbar button groups', () => {
    context.destroy();

    const $note = $$('<div><p>hello</p></div>').appendTo('body');
    const options = $$.extend({}, $$.summernote.options, {
      toolbarUseNativeButtonGroups: true,
      toolbarButtonGroupClassName: 'btn-group-lg shadow-sm',
      toolbarButtonClassName: 'btn-primary btn-sm',
      toolbar: [['font', ['bold', 'underline']]],
    });

    context = new Context($note, options);
    $toolbar = context.layoutInfo.toolbar;

    const $group = $toolbar.children('.note-btn-group').first();
    const $boldButton = $toolbar.find('.note-btn-bold');

    expect($toolbar.hasClass('btn-toolbar')).to.be.true;
    expect($group.attr('role')).to.equal('group');
    expect($group.hasClass('btn-group-lg')).to.be.true;
    expect($group.hasClass('shadow-sm')).to.be.true;
    expect($boldButton.hasClass('btn')).to.be.true;
    expect($boldButton.hasClass('btn-primary')).to.be.true;
    expect($boldButton.hasClass('btn-sm')).to.be.true;
  });

  it('applies custom Bootstrap classes to popover containers and buttons', () => {
    context.destroy();

    const $note = $$('<div><p><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" width="120" height="60"></p></div>').appendTo('body');
    const options = $$.extend({}, $$.summernote.options, {
      dialogsInBody: true,
      popoverClassName: 'bg-primary border-primary text-white',
      popoverButtonClassName: 'btn-light btn-sm',
      popoverUseNativeButtonGroups: true,
      popoverButtonGroupClassName: 'btn-group-sm shadow-sm',
    });

    context = new Context($note, options);
    const image = context.layoutInfo.editable.find('img')[0];
    context.modules.imagePopover.update(image, {
      pageX: 50,
      pageY: 50,
    });

    const $popover = context.modules.imagePopover.$popover;
    const $content = $popover.find('.note-popover-content');
    const $group = $content.children('.note-btn-group').first();
    const $button = $popover.find('.note-btn').first();

    expect($popover.hasClass('bg-primary')).to.be.true;
    expect($popover.hasClass('border-primary')).to.be.true;
    expect($popover.hasClass('text-white')).to.be.true;
    expect($content.hasClass('btn-toolbar')).to.be.true;
    expect($group.attr('role')).to.equal('group');
    expect($group.hasClass('btn-group-sm')).to.be.true;
    expect($group.hasClass('shadow-sm')).to.be.true;
    expect($button.hasClass('btn-light')).to.be.true;
    expect($button.hasClass('btn-sm')).to.be.true;
  });

  it('keeps only one toolbar dropdown open at a time', async() => {
    const $styleButton = $toolbar.find('.dropdown-style').siblings('.dropdown-toggle');
    const $styleMenu = $toolbar.find('.dropdown-style');
    const $fontButton = $toolbar.find('.dropdown-fontname').siblings('.dropdown-toggle');
    const $fontMenu = $toolbar.find('.dropdown-fontname');

    $styleButton.trigger('click');
    await nextTick();
    expect($styleButton.hasClass('show')).to.be.true;
    expect($styleMenu.hasClass('show')).to.be.true;

    $fontButton.trigger('click');
    await nextTick();
    expect($styleButton.hasClass('show')).to.be.false;
    expect($styleMenu.hasClass('show')).to.be.false;
    expect($fontButton.hasClass('show')).to.be.true;
    expect($fontMenu.hasClass('show')).to.be.true;
  });

  it('closes open dropdowns after clicking editor content', async() => {
    const $styleButton = $toolbar.find('.dropdown-style').siblings('.dropdown-toggle');
    const $styleMenu = $toolbar.find('.dropdown-style');

    $styleButton.trigger('click');
    await nextTick();
    expect($styleMenu.hasClass('show')).to.be.true;

    $editable.trigger('click');
    await nextTick();
    expect($styleButton.hasClass('show')).to.be.false;
    expect($styleMenu.hasClass('show')).to.be.false;
  });

  it('keeps recent color metadata in sync when a palette color is chosen', async() => {
    const $button = $toolbar.find('.note-color-fore').find('.note-color-btn[data-event=foreColor]').eq(4);
    const value = $button.attr('data-value');

    $button.trigger('click');
    await nextTick();

    const $currentButton = $toolbar.find('.note-color-fore .note-current-color-button');
    expect($currentButton.attr('data-foreColor')).to.equal(value);
  });

  it('does not crash when container is missing', () => {
    const $note = $$('<div><p>test</p></div>').appendTo('body');
    const options = $$.extend({}, $$.summernote.options, {
      container: undefined,
      toolbar: [['font', ['bold']]],
    });

    expect(() => {
      const ctx = new Context($note, options);
      ctx.destroy();
    }).not.to.throw();
  });
});
