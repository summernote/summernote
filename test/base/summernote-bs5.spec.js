import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import $$ from '@/js/core/dom-query.js';
import '@/styles/bs5/summernote-bs5';

describe('summernote bs5 ui template', () => {
  beforeEach(() => {
    $$('body').empty();
    window.bootstrap = {
      Tooltip: {
        getOrCreateInstance: vi.fn(() => ({
          hide: vi.fn(),
        })),
      },
      Modal: {
        getOrCreateInstance: vi.fn(() => ({
          hide: vi.fn(),
          show: vi.fn(),
        })),
      },
    };
  });

  afterEach(() => {
    $$('body').empty();
    vi.restoreAllMocks();
    delete window.bootstrap;
  });

  it('renders dropdown helpers for array, raw, and empty-item variants', () => {
    const ui = $$.summernote.ui_template({});

    const $dropdown = ui.dropdown({
      items: [
        'plain',
        { value: 'rich', option: 'keep' },
        {},
      ],
      template: (item) => {
        return typeof item === 'string' ? item.toUpperCase() : `<strong>${item.value || 'empty'}</strong>`;
      },
      title: 'Formatting',
      codeviewKeepButton: true,
    }).render($$('body'));
    const $rawDropdown = ui.dropdown({
      items: '<a class="dropdown-item" href="#" data-value="raw" role="listitem">Raw</a>',
    }).render($$('body'));
    const $plainDropdown = ui.dropdown({
      items: ['literal'],
    }).render($$('body'));
    const $dropdownCheck = ui.dropdownCheck({
      items: [
        'alpha',
        { value: 'beta' },
        {},
      ],
      checkClassName: 'note-icon-check',
      template: (item) => {
        return typeof item === 'string' ? item : `<em>${item.value || 'none'}</em>`;
      },
      title: 'Checklist',
      codeviewKeepButton: true,
    }).render($$('body'));
    const $rawDropdownCheck = ui.dropdownCheck({
      items: '<a class="dropdown-item" href="#" data-value="raw-check" role="listitem">Raw Check</a>',
    }).render($$('body'));
    const $emptyDropdownCheck = ui.dropdownCheck({
      title: 'Empty checklist',
    }).render($$('body'));

    const $dropdownItems = $dropdown.find('.dropdown-item');
    const $checkItems = $dropdownCheck.find('.dropdown-item');

    expect($dropdown.attr('aria-label')).to.equal('Formatting');
    expect($dropdown.hasClass('note-codeview-keep')).to.be.true;
    expect($dropdownItems).to.have.length(3);
    expect($dropdownItems.eq(0).attr('data-value')).to.equal('plain');
    expect($dropdownItems.eq(0).html()).to.equal('PLAIN');
    expect($dropdownItems.eq(1).attr('data-value')).to.equal('rich');
    expect($dropdownItems.eq(1).attr('data-option')).to.equal('keep');
    expect($dropdownItems.eq(1).html()).to.equal('<strong>rich</strong>');
    expect($dropdownItems.eq(2).attr('data-value')).to.equal('');
    expect($dropdownItems.eq(2).attr('data-option')).to.equal(null);
    expect($dropdownItems.eq(2).html()).to.equal('<strong>empty</strong>');
    expect($rawDropdown.html()).to.contain('data-value="raw"');
    expect($plainDropdown.find('.dropdown-item').eq(0).html()).to.equal('literal');

    expect($dropdownCheck.attr('aria-label')).to.equal('Checklist');
    expect($dropdownCheck.hasClass('note-codeview-keep')).to.be.true;
    expect($checkItems).to.have.length(3);
    expect($checkItems.eq(0).attr('data-value')).to.equal('alpha');
    expect($checkItems.eq(0).attr('aria-label')).to.equal('alpha');
    expect($checkItems.eq(1).html()).to.contain('<i class="note-icon-check"></i>');
    expect($checkItems.eq(1).html()).to.contain('<em>beta</em>');
    expect($checkItems.eq(2).attr('data-value')).to.equal('');
    expect($checkItems.eq(2).html()).to.contain('<em>none</em>');
    expect($rawDropdownCheck.html()).to.contain('data-value="raw-check"');
    expect($emptyDropdownCheck.attr('aria-label')).to.equal('Empty checklist');
    expect($emptyDropdownCheck.find('.dropdown-item')).to.have.length(0);
  });

  it('renders dialogs, popovers, checkboxes, and raw icon markup', () => {
    const ui = $$.summernote.ui_template({});

    const $dialog = ui.dialog({
      body: '<p>Content</p>',
      title: 'Dialog title',
      footer: '<button type="button">Save</button>',
      fade: true,
    }).render($$('body'));
    const $minimalDialog = ui.dialog({
      body: '<p>Minimal</p>',
      fade: true,
    }).render($$('body'));
    const $popover = ui.popover({
      direction: 'top',
    }).render($$('body'));
    const $defaultPopover = ui.popover({}).render($$('body'));
    const $checked = ui.checkbox({
      id: 'open-in-new-window',
      checked: true,
      text: 'Open in new window',
    }).render($$('body'));
    const $unchecked = ui.checkbox({}).render($$('body'));

    expect($dialog.hasClass('fade')).to.be.true;
    expect($dialog.find('.modal-header').length).to.equal(1);
    expect($dialog.find('.modal-footer').length).to.equal(1);
    expect($minimalDialog.hasClass('fade')).to.be.true;
    expect($minimalDialog.find('.modal-header').length).to.equal(0);
    expect($minimalDialog.find('.modal-footer').length).to.equal(0);
    expect($minimalDialog.attr('aria-label')).to.equal(null);

    expect($popover.attr('data-popper-placement')).to.equal('top');
    expect($defaultPopover.attr('data-popper-placement')).to.equal('bottom');

    expect($checked.find('label').attr('for')).to.equal('note-open-in-new-window');
    expect($checked.find('input').attr('id')).to.equal('note-open-in-new-window');
    expect($checked.find('input').attr('aria-checked')).to.equal('true');
    expect($checked.text()).to.contain('Open in new window');
    expect($unchecked.find('label').attr('for')).to.equal(null);
    expect($unchecked.find('input').attr('id')).to.equal(null);
    expect($unchecked.find('input').attr('aria-label')).to.equal('');
    expect($unchecked.find('input').attr('aria-checked')).to.equal('false');

    expect(ui.icon('<svg class="icon"></svg>')).to.equal('<svg class="icon"></svg>');
    expect(ui.icon('bi bi-type-bold', 'span')).to.equal('<span class="bi bi-type-bold"></span>');
  });

  it('initializes tooltips for buttons and palettes with every container source', () => {
    const $editorContainer = $$('<div class="editor-container"></div>').appendTo('body');
    const $optionContainer = $$('<div class="option-container"></div>').appendTo('body');
    const ui = $$.summernote.ui_template({
      container: $editorContainer,
    });
    const plainUi = $$.summernote.ui_template({});

    const $editorContainerButton = ui.button({
      contents: 'A',
      tooltip: 'From editor container',
      codeviewButton: true,
    }).render($$('body'));
    const $optionContainerButton = ui.button({
      contents: 'B',
      tooltip: 'From option container',
      container: $optionContainer,
    }).render($$('body'));
    const $plainButton = plainUi.button({
      contents: 'C',
      tooltip: 'Without container',
    }).render($$('body'));
    const $editorContainerPalette = ui.palette({
      colors: [['#111111']],
      colorsName: [['Black']],
      eventName: 'editor.color',
      tooltip: true,
    }).render($$('body'));
    const $optionContainerPalette = ui.palette({
      colors: [['#222222']],
      colorsName: [['Gray']],
      eventName: 'editor.color',
      tooltip: true,
      container: $optionContainer,
    }).render($$('body'));
    const $plainPalette = plainUi.palette({
      colors: [['#333333']],
      colorsName: [['Silver']],
      eventName: 'editor.color',
      tooltip: true,
    }).render($$('body'));

    expect($editorContainerButton.attr('title')).to.equal('From editor container');
    expect($editorContainerButton.attr('aria-label')).to.equal('From editor container');
    expect($editorContainerButton.hasClass('note-codeview-keep')).to.be.true;
    expect($optionContainerButton.attr('title')).to.equal('From option container');
    expect($plainButton.attr('title')).to.equal('Without container');
    expect($editorContainerPalette.find('.note-color-btn').attr('title')).to.equal('Black');
    expect($optionContainerPalette.find('.note-color-btn').attr('title')).to.equal('Gray');
    expect($plainPalette.find('.note-color-btn').attr('title')).to.equal('Silver');

    const tooltipCalls = window.bootstrap.Tooltip.getOrCreateInstance.mock.calls
      .map(([, options]) => options);

    expect(tooltipCalls.some((options) => {
      return options.container === $editorContainer[0] &&
        options.trigger === 'hover' &&
        options.placement === 'bottom';
    })).to.be.true;
    expect(tooltipCalls.some((options) => {
      return options.container === $optionContainer[0] &&
        options.trigger === 'hover' &&
        options.placement === 'bottom';
    })).to.be.true;
    expect(tooltipCalls.some((options) => {
      return !Object.prototype.hasOwnProperty.call(options, 'container') &&
        options.trigger === 'hover' &&
        options.placement === 'bottom';
    })).to.be.true;
    expect(tooltipCalls.some((options) => {
      return options.container === $editorContainer[0] &&
        options.selector === '.note-color-btn' &&
        options.trigger === 'hover' &&
        options.placement === 'bottom';
    })).to.be.true;
    expect(tooltipCalls.some((options) => {
      return options.container === $optionContainer[0] &&
        options.selector === '.note-color-btn' &&
        options.trigger === 'hover' &&
        options.placement === 'bottom';
    })).to.be.true;
    expect(tooltipCalls.some((options) => {
      return !Object.prototype.hasOwnProperty.call(options, 'container') &&
        options.selector === '.note-color-btn' &&
        options.trigger === 'hover' &&
        options.placement === 'bottom';
    })).to.be.true;
  });
});
