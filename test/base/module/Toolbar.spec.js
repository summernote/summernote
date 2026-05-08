import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from '/test/util';
import $$ from '@/js/core/dom-query.js';
import Context from '@/js/Context';
import Toolbar from '@/js/module/Toolbar';
import '@/styles/bs5/summernote-bs5';

describe('Toolbar', () => {
  let context;
  let toolbar;
  let $toolbar;

  beforeEach(() => {
    $$('body').empty();
    context = new Context(
      $$('<div><p>hello</p></div>').appendTo('body'),
      $$.extend({}, $$.summernote.options, {
        toolbar: [
          ['style', ['style']],
          ['font', ['fontname']],
          ['view', ['fullscreen', 'codeview']],
        ],
      }),
    );
    toolbar = context.modules.toolbar;
    $toolbar = context.layoutInfo.toolbar;
  });

  afterEach(() => {
    context?.destroy();
    $$('body').empty();
  });

  it('skips initialization in air mode', () => {
    const instance = new Toolbar({
      layoutInfo: context.layoutInfo,
      options: { ...context.options, airMode: true },
    });

    expect(instance.shouldInitialize()).to.equal(false);
  });

  it('hides the toolbar when no groups are configured', () => {
    context.destroy();
    context = new Context(
      $$('<div><p>hello</p></div>').appendTo('body'),
      $$.extend({}, $$.summernote.options, {
        toolbar: [],
      }),
    );

    expect(context.layoutInfo.toolbar.css('display')).to.equal('none');
  });

  it('opens and closes dropdown groups through toolbar and document interactions', async() => {
    const $styleButton = $toolbar.find('.dropdown-style').siblings('.dropdown-toggle');
    const group = toolbar.getDropdownGroup($styleButton[0]);
    const incompleteGroup = $$('<div class="note-btn-group"><button data-note-toggle="dropdown"></button></div>')[0];

    expect(toolbar.getDropdownGroup(document.createTextNode('x'))).to.equal(null);
    expect(toolbar.getDropdownGroup(document.createElement('div'))).to.equal(null);
    expect(toolbar.getDropdownGroup(incompleteGroup)).to.equal(null);
    expect(toolbar.getDropdownParts(null)).to.deep.equal({});
    expect(toolbar.isDropdownOpen(incompleteGroup)).to.equal(false);
    toolbar.openDropdown(incompleteGroup);
    toolbar.closeDropdown(incompleteGroup);

    toolbar.openDropdown(group);
    expect(toolbar.isDropdownOpen(group)).to.equal(true);

    toolbar.handleDocumentKeydown(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(toolbar.isDropdownOpen(group)).to.equal(false);

    $styleButton.trigger('click');
    await nextTick();
    expect(toolbar.isDropdownOpen(group)).to.equal(true);

    toolbar.handleToolbarClick({
      target: $styleButton[0],
      preventDefault: vi.fn(),
    });
    expect(toolbar.isDropdownOpen(group)).to.equal(false);

    toolbar.handleDocumentClick(new Event('click'));
    expect(toolbar.isDropdownOpen(group)).to.equal(false);
  });

  it('prevents toolbar mousedown only for actionable elements', () => {
    const preventDefault = vi.fn();
    const textInput = document.createElement('input');
    const plainDiv = document.createElement('div');
    const button = $toolbar.find('button')[0];

    toolbar.handleToolbarMouseDown({ target: null, preventDefault });
    toolbar.handleToolbarMouseDown({ target: textInput, preventDefault });
    toolbar.handleToolbarMouseDown({ target: plainDiv, preventDefault });
    expect(preventDefault).not.toHaveBeenCalled();

    toolbar.handleToolbarMouseDown({ target: button, preventDefault });
    expect(preventDefault).toHaveBeenCalledOnce();
  });

  it('ignores non-element toolbar clicks and closes dropdowns for buttons and menus', async() => {
    const $styleButton = $toolbar.find('.dropdown-style').siblings('.dropdown-toggle');
    const $styleMenu = $toolbar.find('.dropdown-style');
    const group = toolbar.getDropdownGroup($styleButton[0]);
    const $fullscreenButton = $toolbar.find('.btn-fullscreen');

    toolbar.handleToolbarClick({ target: null, preventDefault: vi.fn() });

    $styleButton.trigger('click');
    await nextTick();
    expect(toolbar.isDropdownOpen(group)).to.equal(true);

    toolbar.handleToolbarClick({
      target: $toolbar[0],
      preventDefault: vi.fn(),
    });
    expect(toolbar.isDropdownOpen(group)).to.equal(true);

    toolbar.handleToolbarClick({
      target: $styleMenu.find('a')[0],
      preventDefault: vi.fn(),
    });
    expect(toolbar.isDropdownOpen(group)).to.equal(false);

    $styleButton.trigger('click');
    await nextTick();
    toolbar.handleToolbarClick({
      target: $fullscreenButton[0],
      preventDefault: vi.fn(),
    });
    expect(toolbar.isDropdownOpen(group)).to.equal(false);
  });

  it('follows scrolling and toggles active buttons for fullscreen and codeview', () => {
    const $otherBar = $$('<div style="height: 10px"></div>').appendTo('body');
    context.options.otherStaticBar = $otherBar;
    context.options.followingToolbar = true;

    const editorNode = context.layoutInfo.editor[0];
    editorNode.getBoundingClientRect = () => ({ top: 0, left: 0, right: 300, bottom: 600, width: 300, height: 600 });
    context.layoutInfo.editingArea[0].getBoundingClientRect = () => ({ top: 0, left: 0, right: 300, bottom: 600, width: 300, height: 600 });
    Object.defineProperty(document.documentElement, 'scrollTop', { configurable: true, value: 0 });
    toolbar.$document.scrollTop = () => 100;
    toolbar.$editor.offset = () => ({ top: 0, left: 0 });
    toolbar.$editor.outerHeight = () => 600;
    toolbar.$editor.width = () => 300;
    toolbar.$toolbar.height = () => 40;
    toolbar.$toolbar.outerHeight = () => 40;
    toolbar.$statusbar.height = () => 20;

    toolbar.followScroll();
    expect(toolbar.isFollowing).to.equal(true);

    toolbar.$document.scrollTop = () => 1000;
    toolbar.followScroll();
    expect(toolbar.isFollowing).to.equal(false);

    toolbar.$editor.addClass('fullscreen');
    expect(toolbar.followScroll()).to.equal(false);
    toolbar.$editor.removeClass('fullscreen');

    toolbar.updateFullscreen(true);
    expect($toolbar.find('.btn-fullscreen').hasClass('active')).to.equal(true);
    expect(toolbar.$editor.children().get(0)).to.equal($toolbar.get(0));

    toolbar.updateCodeview(true);
    expect($toolbar.find('.btn-codeview').hasClass('active')).to.equal(true);
    expect($toolbar.find('button:not(.note-codeview-keep):disabled').length).to.be.greaterThan(0);

    toolbar.updateCodeview(false);
    expect($toolbar.find('.btn-codeview').hasClass('active')).to.equal(false);
  });

  it('moves the toolbar into a custom container and closes dropdowns after editor interaction', async() => {
    context.destroy();
    const $toolbarContainer = $$('<div class="toolbar-host"></div>').appendTo('body');
    context = new Context(
      $$('<div><p>hello</p></div>').appendTo('body'),
      $$.extend({}, $$.summernote.options, {
        toolbar: [['style', ['style']]],
        toolbarContainer: $toolbarContainer,
      }),
    );
    toolbar = context.modules.toolbar;
    $toolbar = context.layoutInfo.toolbar;

    expect($toolbar.parent().hasClass('toolbar-host')).to.equal(true);

    const $styleButton = $toolbar.find('.dropdown-style').siblings('.dropdown-toggle');
    const group = toolbar.getDropdownGroup($styleButton[0]);
    $styleButton.trigger('click');
    await nextTick();
    expect(toolbar.isDropdownOpen(group)).to.equal(true);

    toolbar.handleEditorInteraction();
    expect(toolbar.isDropdownOpen(group)).to.equal(false);
  });

  it('initializes follow-scroll listeners when enabled and ignores non-escape keydowns', () => {
    const options = $$.extend({}, $$.summernote.options, {
      followingToolbar: true,
    });
    $$.summernote.ui = $$.summernote.ui_template(options);

    const $note = $$('<div></div>').appendTo('body');
    const $editor = $$('<div class="note-editor"></div>').appendTo($note);
    const $toolbarHost = $$('<div class="note-toolbar"></div>').appendTo($editor);
    const $editingArea = $$('<div class="note-editing-area"></div>').appendTo($editor);
    const $editableHost = $$('<div class="note-editable"></div>').appendTo($editingArea);
    const $statusbar = $$('<div class="note-statusbar"></div>').appendTo($editor);
    const manualContext = {
      invoke: vi.fn(),
      options: {
        ...options,
        toolbar: undefined,
      },
      layoutInfo: {
        note: $note,
        editor: $editor,
        toolbar: $toolbarHost,
        editingArea: $editingArea,
        editable: $editableHost,
        statusbar: $statusbar,
      },
    };
    const instance = new Toolbar(manualContext);

    instance.initialize();
    instance.handleDocumentKeydown(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(instance.options.toolbar).to.deep.equal([]);
    expect($toolbarHost.css('display')).to.equal('none');

    instance.destroy();
  });

  it('can activate and deactivate codeview-safe buttons explicitly', () => {
    toolbar.activate(true);
    expect($toolbar.find('button:disabled').length).to.equal(0);

    toolbar.deactivate(true);
    expect($toolbar.find('button:disabled').length).to.be.greaterThan(0);
  });
});
