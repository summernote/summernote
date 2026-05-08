import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from '/test/util';
import $$ from '@/js/core/dom-query.js';
import env from '@/js/core/env';
import range from '@/js/core/range';
import Context from '@/js/Context';
import Buttons from '@/js/module/Buttons';
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

  it('supports helper utilities for class names and style tags', () => {
    const buttons = new Buttons(context);

    expect(buttons.getStyleTagValue('p')).to.equal('p');
    expect(buttons.getStyleTagValue({ value: 'blockquote' })).to.equal('blockquote');
    expect(buttons.getStyleTagValue({ tag: 'pre' })).to.equal('pre');
    expect(buttons.getCurrentStyleTag({
      ancestors: [
        { nodeName: 'SPAN' },
        { nodeName: 'H1' },
      ],
    })).to.equal('h1');
    expect(buttons.getCurrentStyleTag({ ancestors: [{ nodeName: 'DIV' }] })).to.equal(null);
    expect(buttons.normalizeLineHeight('2')).to.equal('2.0');
    expect(buttons.normalizeLineHeight('normal')).to.equal('normal');
    expect(buttons.normalizeFontFamilyName('"Open Sans"')).to.equal('Open Sans');
    expect(buttons.normalizeClassNames('btn btn-primary  btn-lg')).to.deep.equal(['btn', 'btn-primary', 'btn-lg']);
    expect(buttons.normalizeClassNames(null)).to.deep.equal([]);
    expect(buttons.isBootstrapButtonStyleClass('btn-primary')).to.equal(true);
    expect(buttons.isBootstrapButtonStyleClass('btn-lg')).to.equal(false);
    expect(buttons.isBootstrapButtonStyleClass('btn')).to.equal(false);
  });

  it('caches installed fonts and ignores generic families', () => {
    const buttons = new Buttons(context);
    const isFontInstalled = vi.spyOn(env, 'isFontInstalled').mockReturnValue(true);

    expect(buttons.isFontInstalled('Courier New')).to.equal(true);
    expect(buttons.isFontInstalled('Courier New')).to.equal(true);
    expect(isFontInstalled).toHaveBeenCalledOnce();
    expect(buttons.isFontDeservedToAdd('Courier New')).to.equal(true);
    expect(buttons.isFontDeservedToAdd('')).to.equal(false);
    expect(buttons.isFontDeservedToAdd('serif')).to.equal(false);
  });

  it('returns empty shortcuts when disabled or unmapped', () => {
    const buttons = new Buttons(context);

    expect(buttons.representShortcut('missingCommand')).to.equal('');
    context.options.shortcuts = false;
    expect(buttons.representShortcut('bold')).to.equal('');
  });

  it('supports mac shortcuts, ignored fonts, and default font discovery', () => {
    context.destroy();

    vi.spyOn(env, 'isFontInstalled').mockReturnValue(false);
    const originalIsMac = env.isMac;
    env.isMac = true;

    const $note = $$('<div><p>hello</p></div>').appendTo('body');
    context = new Context($note, $$.extend({}, $$.summernote.options, {
      addDefaultFonts: true,
      fontNames: ['Arial'],
      fontNamesIgnoreCheck: ['Ignored Font'],
      keyMap: {
        pc: {
          'CTRL+B': 'bold',
        },
        mac: {
          'CMD+SHIFT+BACKSLASH': 'bold',
        },
      },
    }));

    const buttons = new Buttons(context);
    vi.spyOn(context, 'invoke').mockImplementation((namespace) => {
      if (namespace === 'editor.currentStyle') {
        return {
          'font-family': '"Ignored Font", "Fresh Font", serif',
        };
      }
      return undefined;
    });

    const fontButton = buttons.context.memo('button.fontname');
    if (typeof fontButton === 'function') {
      fontButton(context);
    }

    expect(buttons.representShortcut('bold')).to.equal(' (⌘+⇧+\\)');
    expect(buttons.isFontInstalled('Ignored Font')).to.equal(true);
    expect(context.options.fontNames).to.include('Ignored Font');

    env.isMac = originalIsMac;
  });

  it('drops tooltip configuration when tooltips are disabled', () => {
    context.destroy();

    const $note = $$('<div><p>hello</p></div>').appendTo('body');
    context = new Context($note, $$.extend({}, $$.summernote.options, {
      tooltip: false,
      toolbar: [['font', ['bold']]],
    }));
    const buttons = new Buttons(context);

    const rendered = buttons.button({
      className: 'note-btn-test',
      contents: 'T',
      tooltip: 'Tooltip text',
    }).render();

    expect(rendered.attr('title')).to.equal(null);
  });

  it('updates current style labels for custom containers', () => {
    const buttons = new Buttons(context);
    const $container = $$('<div>').appendTo('body');
    vi.spyOn(env, 'isFontInstalled').mockReturnValue(true);
    buttons.build($container, [['font', ['fontname', 'fontsize', 'fontsizeunit', 'height']]]);

    vi.spyOn(context, 'invoke').mockImplementation((namespace) => {
      if (namespace === 'editor.currentStyle') {
        return {
          'font-family': '"Courier New", serif',
          'font-size': '18',
          'font-size-unit': 'pt',
          'line-height': 'normal',
          ancestors: [{ nodeName: 'P' }],
        };
      }
      return undefined;
    });

    buttons.updateCurrentStyle($container);

    expect($container.find('.note-current-fontname').text()).to.equal('Courier New');
    expect($container.find('.note-current-fontsize').text()).to.equal('18');
    expect($container.find('.note-current-fontsizeunit').text()).to.equal('pt');
  });

  it('applies custom popover classes even without a wrapping popover element', () => {
    const buttons = new Buttons(context);
    const $container = $$('<div class="note-popover-content"><div class="note-btn-group"><button type="button" class="note-btn btn btn-outline-secondary btn-sm"></button></div></div>').appendTo('body');
    context.options.popoverClassName = 'bg-dark text-white';
    context.options.popoverButtonClassName = 'btn-light';
    context.options.popoverButtonGroupClassName = 'btn-group-lg';

    buttons.applyContainerButtonClassNames($container, 'popover');

    expect($container.hasClass('bg-dark')).to.equal(true);
    expect($container.hasClass('text-white')).to.equal(true);
    expect($container.children('.note-btn-group').hasClass('btn-group-lg')).to.equal(true);
    expect($container.find('.note-btn').hasClass('btn-light')).to.equal(true);
    expect($container.find('.note-btn').hasClass('btn-outline-secondary')).to.equal(false);
    expect($container.find('.note-btn').hasClass('btn-sm')).to.equal(false);
  });

  it('routes color palette interactions through editor commands', async() => {
    const buttons = new Buttons(context);
    const invoke = vi.spyOn(context, 'invoke');
    const $palette = buttons.colorPalette('note-color-test', 'Pick a color', true, false).appendTo('body');
    const $currentButton = $palette.find('.note-current-color-button');
    const $picker = $palette.find('input[type=color]');

    $currentButton.trigger('click');
    expect(invoke).toHaveBeenCalledWith('editor.color', {
      backColor: context.options.colorButton.backColor,
    });

    $picker.val('#123456');
    $picker[0].dispatchEvent(new Event('change', { bubbles: true }));
    await nextTick();

    expect(invoke.mock.calls.some(([namespace]) => namespace === 'editor.backColor')).to.equal(true);
  });

  it('covers color palette variants, table pickers, and memoized button builders', async() => {
    const buttons = new Buttons(context);
    const invoke = vi.spyOn(context, 'invoke');

    const $allPalette = buttons.colorPalette('note-color-all-test', 'Both', true, true).appendTo('body');
    $allPalette.find('.note-current-color-button').trigger('click');
    expect(invoke).toHaveBeenCalledWith('editor.color', {
      backColor: context.options.colorButton.backColor,
      foreColor: context.options.colorButton.foreColor,
    });

    const $forePalette = buttons.colorPalette('note-color-fore-test', 'Fore', false, true).appendTo('body');
    $forePalette.find('.note-current-color-button').trigger('click');
    expect(invoke).toHaveBeenCalledWith('editor.color', {
      foreColor: context.options.colorButton.foreColor,
    });

    const $picker = $allPalette.find('input[type=color]').first();
    const $openPaletteButton = $allPalette.find('.note-color-select[data-event="openPalette"]').first();
    $picker.val('#654321');
    $openPaletteButton.trigger('click');
    expect($allPalette.find('.note-holder-custom .note-color-btn').first().attr('data-value')).to.equal('#654321');

    const tableButton = context.memo('button.table');
    const $tableButton = typeof tableButton === 'function' ? tableButton(context) : tableButton;
    const $catcher = $tableButton.find('.note-dimension-picker-mousecatcher');
    const mouseDown = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
    const preventDefault = vi.spyOn(mouseDown, 'preventDefault');
    $catcher[0].dispatchEvent(mouseDown);
    expect(preventDefault).toHaveBeenCalled();

    $catcher.trigger('mouseup');
    expect(invoke).toHaveBeenCalledWith('editor.restoreRange');
    expect(invoke).toHaveBeenCalledWith('editor.insertTable', '1x1');

    const $customContainer = $$('<div class="note-btn-group"><button type="button" class="note-btn btn btn-outline-secondary btn-sm"></button></div>').appendTo('body');
    context.options.toolbarButtonClassName = 'btn-primary';
    context.options.toolbarButtonGroupClassName = 'btn-group-sm';
    buttons.applyContainerButtonClassNames($customContainer, 'toolbar');
    expect($customContainer.find('.note-btn').hasClass('btn-primary')).to.equal(true);
    expect($customContainer.find('.note-btn').hasClass('btn-outline-secondary')).to.equal(false);
    expect($customContainer.find('.note-btn').hasClass('btn-sm')).to.equal(false);

    const $memoContainer = $$('<div>').appendTo('body');
    buttons.build($memoContainer, ['hr', ['undo'], ['redo'], ['unknown'], ['style']]);
    expect($memoContainer.find('.note-btn').length).to.be.greaterThan(0);
    const styleButton = context.memo('button.style.p');
    const $styleButton = typeof styleButton === 'function' ? styleButton(context) : styleButton;
    expect($styleButton.find('[data-value="p"]').length).to.equal(1);
  });

  it('handles synthetic table picker mousemove events without offset values', () => {
    const buttons = new Buttons(context);
    const $picker = $$([
      '<div class="note-dimension-picker">',
      '<div class="note-dimension-picker-mousecatcher" data-value="1x1"></div>',
      '<div class="note-dimension-picker-highlighted"></div>',
      '<div class="note-dimension-picker-unhighlighted"></div>',
      '</div>',
      '<div class="note-dimension-display"></div>',
    ].join('')).appendTo('body');
    const catcher = $picker.find('.note-dimension-picker-mousecatcher')[0];

    const catcherOffset = $$(catcher).offset();
    buttons.tableMoveHandler({
      target: catcher,
      pageX: catcherOffset.left + 90,
      pageY: catcherOffset.top + 90,
    });

    expect($picker.find('.note-dimension-picker-mousecatcher').data('value')).to.equal('5x5');
    expect($picker.find('.note-dimension-picker-highlighted')[0].style.width).to.equal('5em');
    expect($picker.next().html()).to.equal('5 x 5');
  });

  it('handles direct table picker offsets and fallback style tag values', () => {
    const buttons = new Buttons(context);
    const $picker = $$([
      '<div class="note-dimension-picker">',
      '<div class="note-dimension-picker-mousecatcher" data-value="1x1"></div>',
      '<div class="note-dimension-picker-highlighted"></div>',
      '<div class="note-dimension-picker-unhighlighted"></div>',
      '</div>',
      '<div class="note-dimension-display"></div>',
    ].join('')).appendTo('body');
    const catcher = $picker.find('.note-dimension-picker-mousecatcher')[0];

    buttons.tableMoveHandler({
      target: catcher,
      offsetX: 0,
      offsetY: 0,
    });

    expect(buttons.getStyleTagValue({})).to.equal('');
    expect(buttons.getCurrentStyleTag({})).to.equal(null);
    expect($picker.find('.note-dimension-picker-mousecatcher').data('value')).to.equal('1x1');
    expect($picker.next().html()).to.equal('1 x 1');
  });

  it('covers button class cleanup branches and static memo buttons', () => {
    const buttons = new Buttons(context);
    const $styleContainer = $$('<div class="note-btn-group"><button type="button" class="note-btn btn"></button></div>').appendTo('body');
    context.options.toolbarButtonClassName = 'btn-light';
    context.options.toolbarButtonGroupClassName = '';
    context.options.toolbarUseNativeButtonGroups = false;

    buttons.applyContainerButtonClassNames($styleContainer, 'toolbar');
    expect($styleContainer.find('.note-btn').hasClass('btn-light')).to.equal(true);
    expect($styleContainer.find('.note-btn').hasClass('btn-sm')).to.equal(false);

    const $sizeContainer = $$('<div class="note-btn-group"><button type="button" class="note-btn btn"></button></div>').appendTo('body');
    context.options.toolbarButtonClassName = '';
    context.options.toolbarButtonGroupClassName = 'btn-group-lg';

    buttons.applyContainerButtonClassNames($sizeContainer, 'toolbar');
    expect($sizeContainer.find('.note-btn').hasClass('btn-sm')).to.equal(false);

    const $memoContainer = $$('<div>').appendTo('body');
    const $staticButton = $$('<button type="button" class="note-btn btn">Static</button>');
    context.memo('button.static', $staticButton);
    buttons.build($memoContainer, ['static']);
    expect($memoContainer.find('.note-btn').text()).to.contain('Static');
  });

  it('renders fallback and styled style tag templates', () => {
    context.destroy();

    const $note = $$('<div><p>hello</p></div>').appendTo('body');
    context = new Context($note, $$.extend({}, $$.summernote.options, {
      toolbar: [['style', ['style']]],
      styleTags: [
        'customtag',
        {
          tag: 'span',
          title: 'Styled',
          style: 'font-weight:bold',
          className: 'lead',
        },
      ],
    }));
    $toolbar = context.layoutInfo.toolbar;

    const styleDropdownHtml = $toolbar.find('.dropdown-style').html();
    expect(styleDropdownHtml).to.contain('<customtag>customtag</customtag>');
    expect(styleDropdownHtml).to.contain('style="font-weight:bold"');
    expect(styleDropdownHtml).to.contain('class="lead"');
  });

  it('adds discovered fonts and handles palettes without configured colors', () => {
    context.destroy();

    const $note = $$('<div><p>hello</p></div>').appendTo('body');
    context = new Context($note, $$.extend({}, $$.summernote.options, {
      addDefaultFonts: true,
      fontNames: ['Arial'],
      fontNamesIgnoreCheck: ['Ignored Font'],
      toolbar: [['font', ['fontname']]],
    }));
    $toolbar = context.layoutInfo.toolbar;

    vi.spyOn(context, 'invoke').mockImplementation((namespace) => {
      if (namespace === 'editor.currentStyle') {
        return {
          'font-family': '"Ignored Font", serif',
        };
      }
      return undefined;
    });

    const buttonsModule = new Buttons(context);
    buttonsModule.addToolbarButtons();
    const fontButton = context.memo('button.fontname');
    if (typeof fontButton === 'function') {
      fontButton();
      context.options.addDefaultFonts = false;
      fontButton();
    }
    expect(context.options.fontNames).to.include('Ignored Font');

    const buttons = new Buttons(context);
    const invoke = vi.spyOn(context, 'invoke');
    const $palette = buttons.colorPalette('note-color-empty', 'None', false, false).appendTo('body');
    $palette.find('.note-current-color-button').trigger('click');

    expect(invoke.mock.calls.some(([namespace]) => namespace === 'editor.color')).to.equal(false);
    expect($palette.find('.note-recent-color').css('color')).to.equal('rgba(0, 0, 0, 0)');
  });
});
