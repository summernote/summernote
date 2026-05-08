import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import $$ from '@/js/core/dom-query.js';
import Context from '@/js/Context';
import HintPopover from '@/js/module/HintPopover';
import range from '@/js/core/range';
import '@/styles/bs5/summernote-bs5';

describe('HintPopover', () => {
  let context;
  let hintPopover;
  let $editable;

  beforeEach(() => {
    $$('body').empty();
  });

  afterEach(() => {
    hintPopover?.destroy();
    context?.destroy();
    $$('body').empty();
  });

  it('searches single-word mentions and tracks the matching word', async() => {
    const options = $$.extend({}, $$.summernote.options, {
      hint: {
        mentions: ['jayden', 'sam', 'alvin', 'david'],
        match: /\B#(\w*)$/,
        search(keyword, callback) {
          callback(this.mentions.filter((item) => item.indexOf(keyword) === 0));
        },
        content(item) {
          return `#${item}`;
        },
      },
    });

    context = new Context($$('<div><p>hello world</p></div>').appendTo('body'), options);
    hintPopover = new HintPopover(context);
    hintPopover.initialize();

    const items = await new Promise((resolve) => {
      hintPopover.searchKeyword(0, '#al', resolve);
    });

    expect(items).to.deep.equal(['alvin']);
    expect(hintPopover.matchingWord).to.equal('#al');
  });

  it('falls back to the default direction when hintDirection is falsy', () => {
    const options = $$.extend({}, $$.summernote.options, {
      hintDirection: '',
      hint: {
        words: ['apple'],
        match: /\b(\w{1,})$/,
        search(keyword, callback) {
          callback(this.words.filter((item) => item.indexOf(keyword) === 0));
        },
      },
    });

    context = new Context($$('<div><p>hello world</p></div>').appendTo('body'), options);
    hintPopover = new HintPopover(context);
    hintPopover.initialize();

    expect(hintPopover.direction).to.equal('bottom');
  });

  it('creates grouped items and marks the first result active', () => {
    const options = $$.extend({}, $$.summernote.options, {
      hint: {
        mentions: ['jayden', 'sam', 'alvin', 'david'],
        match: /\B#(\w*)$/,
        search(keyword, callback) {
          callback(this.mentions.filter((item) => item.indexOf(keyword) === 0));
        },
        template(item) {
          return item.toUpperCase();
        },
        content(item) {
          return `#${item}`;
        },
      },
    });

    context = new Context($$('<div><p>hello world</p></div>').appendTo('body'), options);
    hintPopover = new HintPopover(context);
    hintPopover.initialize();

    const $group = hintPopover.createGroup(0, '#a');

    expect($group.find('.note-hint-item').length).to.equal(1);
    expect($group.find('.note-hint-item').text()).to.equal('ALVIN');
    expect($group.find('.note-hint-item').first().hasClass('list-group-item')).to.be.true;
    expect($group.find('.note-hint-item').hasClass('active')).to.be.true;
    expect($group.find('.note-hint-item').first().attr('aria-selected')).to.equal('true');
  });

  it('moves between hint items with moveDown and moveUp', () => {
    const options = $$.extend({}, $$.summernote.options, {
      hint: {
        mentions: ['jayden', 'sam', 'alvin'],
        match: /\B#(\w*)$/,
        search(keyword, callback) {
          callback(this.mentions.filter((item) => item.indexOf(keyword) === 0));
        },
        content(item) {
          return `#${item}`;
        },
      },
    });

    context = new Context($$('<div><p>hello world</p></div>').appendTo('body'), options);
    hintPopover = new HintPopover(context);
    hintPopover.initialize();

    hintPopover.createGroup(0, '#').appendTo(hintPopover.$content);
    const $items = hintPopover.$content.find('.note-hint-item');

    expect($items.first().hasClass('active')).to.be.true;
    hintPopover.moveDown();
    expect($items.eq(1).hasClass('active')).to.be.true;
    hintPopover.moveUp();
    expect($items.first().hasClass('active')).to.be.true;
  });

  it('shows the hint popover when a stylesheet keeps note popovers hidden by default', () => {
    const options = $$.extend({}, $$.summernote.options, {
      hint: {
        mentions: ['apple'],
        match: /\b(\w{1,})$/,
        search(keyword, callback) {
          callback(this.mentions.filter((item) => item.indexOf(keyword) === 0));
        },
      },
    });

    context = new Context($$('<div><p>hello world</p></div>').appendTo('body'), options);
    hintPopover = new HintPopover(context);
    hintPopover.initialize();

    hintPopover.createGroup(0, 'app').appendTo(hintPopover.$content);

    expect(getComputedStyle(hintPopover.$popover[0]).display).to.equal('block');
    expect(getComputedStyle(hintPopover.$content[0]).display).to.equal('flex');
    expect(getComputedStyle(hintPopover.$content[0]).padding).to.equal('0px');
  });

  it('replaces the active hint item and triggers a change event', () => {
    const onChange = vi.fn();
    const options = $$.extend({}, $$.summernote.options, {
      hint: {
        mentions: [
          { name: 'David Summer', url: 'http://example.org/person/david-summer' },
        ],
        match: /\B@([a-z ]*)/i,
        search(keyword, callback) {
          callback(this.mentions.filter((item) => item.name.toLowerCase().indexOf(keyword.toLowerCase()) === 0));
        },
        template(item) {
          return item.name;
        },
        content(item) {
          return $$('<a>').attr('href', item.url).text(`@${item.name}`).get(0);
        },
      },
      callbacks: {
        onChange,
      },
    });

    context = new Context($$('<div><p>hello world</p></div>').appendTo('body'), options);
    hintPopover = new HintPopover(context);
    hintPopover.initialize();
    $editable = context.layoutInfo.editable;

    const textNode = $editable.find('p')[0].firstChild;
    hintPopover.lastWordRange = range.create(textNode, 6, textNode, 6);
    hintPopover.matchingWord = '';

    hintPopover.createGroup(0, '@David S').appendTo(hintPopover.$content);
    hintPopover.replace();

    expect($editable.html()).to.equal('<p>hello <a href="http://example.org/person/david-summer">@David Summer</a>world</p>');
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('replaces the clicked hint item through delegated click handling', () => {
    const options = $$.extend({}, $$.summernote.options, {
      hint: {
        words: ['apple'],
        match: /\b(\w{1,})$/,
        search(keyword, callback) {
          callback(this.words.filter((item) => item.indexOf(keyword) === 0));
        },
      },
    });

    context = new Context($$('<div><p>app</p></div>').appendTo('body'), options);
    hintPopover = new HintPopover(context);
    hintPopover.initialize();
    $editable = context.layoutInfo.editable;

    const textNode = $editable.find('p')[0].firstChild;
    hintPopover.lastWordRange = range.create(textNode, 0, textNode, 3);
    hintPopover.matchingWord = 'app';

    hintPopover.createGroup(0, 'app').appendTo(hintPopover.$content);
    hintPopover.$content.find('.note-hint-item').first()[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect($editable.html()).to.equal('<p>apple</p>');
    expect(getComputedStyle(hintPopover.$popover[0]).display).to.equal('none');
  });

  it('ignores empty clicks, prevents mousedown focus changes, and skips inactive replacements', () => {
    const options = $$.extend({}, $$.summernote.options, {
      hintDirection: 'top',
      hint: {
        words: ['apple'],
        match: /\b(\w{1,})$/,
        search(keyword, callback) {
          callback(this.words.filter((item) => item.indexOf(keyword) === 0));
        },
      },
    });

    context = new Context($$('<div><p>app</p></div>').appendTo('body'), options);
    hintPopover = new HintPopover(context);
    hintPopover.initialize();

    const replaceSpy = vi.spyOn(hintPopover, 'replace');
    const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
    hintPopover.$popover[0].dispatchEvent(mouseDownEvent);
    hintPopover.$content[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(mouseDownEvent.defaultPrevented).to.equal(true);
    expect(replaceSpy).not.toHaveBeenCalled();

    hintPopover.replace();
    expect(hintPopover.direction).to.equal('top');
  });

  it('wraps between hint groups and handles visible keyboard navigation', () => {
    const options = $$.extend({}, $$.summernote.options, {
      hint: [
        {
          words: ['apple', 'apricot'],
          match: /\b(\w{1,})$/,
          search(keyword, callback) {
            callback(this.words.filter((item) => item.indexOf(keyword) === 0));
          },
        },
        {
          words: ['avocado'],
          match: /\b(\w{1,})$/,
          search(keyword, callback) {
            callback(this.words.filter((item) => item.indexOf(keyword) === 0));
          },
        },
      ],
    });

    context = new Context($$('<div><p>app</p></div>').appendTo('body'), options);
    hintPopover = new HintPopover(context);
    hintPopover.initialize();

    hintPopover.createGroup(0, 'a').appendTo(hintPopover.$content);
    hintPopover.createGroup(1, 'a').appendTo(hintPopover.$content);

    hintPopover.moveDown();
    hintPopover.moveDown();
    expect(hintPopover.$content.find('.note-hint-group').last().find('.note-hint-item').first().hasClass('active')).to.be.true;

    hintPopover.moveUp();
    expect(hintPopover.$content.find('.note-hint-group').first().find('.note-hint-item').last().hasClass('active')).to.be.true;

    hintPopover.$content.find('.note-hint-item').attr('aria-selected', 'false').removeClass('active');
    hintPopover.$content.find('.note-hint-group').first().find('.note-hint-item').first().addClass('active').attr('aria-selected', 'true');
    hintPopover.moveUp();
    expect(hintPopover.$content.find('.note-hint-group').last().find('.note-hint-item').last().hasClass('active')).to.be.true;

    hintPopover.moveDown();
    expect(hintPopover.$content.find('.note-hint-group').first().find('.note-hint-item').first().hasClass('active')).to.be.true;

    const replaceSpy = vi.spyOn(hintPopover, 'replace').mockImplementation(() => {});
    const moveUpSpy = vi.spyOn(hintPopover, 'moveUp').mockImplementation(() => {});
    const moveDownSpy = vi.spyOn(hintPopover, 'moveDown').mockImplementation(() => {});

    hintPopover.handleKeydown({ keyCode: 13, preventDefault: vi.fn() });
    hintPopover.handleKeydown({ keyCode: 38, preventDefault: vi.fn() });
    hintPopover.handleKeydown({ keyCode: 40, preventDefault: vi.fn() });

    expect(replaceSpy).toHaveBeenCalledTimes(1);
    expect(moveUpSpy).toHaveBeenCalledTimes(1);
    expect(moveDownSpy).toHaveBeenCalledTimes(1);
  });

  it('supports next-selection insertion and skips unmatched keyword searches', async() => {
    const options = $$.extend({}, $$.summernote.options, {
      hintSelect: 'next',
      hint: {
        words: ['@david'],
        match: /\B(@\w*)$/,
        search(keyword, callback) {
          callback(this.words.filter((item) => item.indexOf(keyword) === 0));
        },
        content(item) {
          return $$('<strong></strong>').text(item).get(0);
        },
      },
    });

    context = new Context($$('<div><p>hello @david</p></div>').appendTo('body'), options);
    hintPopover = new HintPopover(context);
    hintPopover.initialize();
    hintPopover.matchingWord = '@david';
    hintPopover.createGroup(0, '@d').appendTo(hintPopover.$content);
    const insertNode = vi.fn();
    hintPopover.lastWordRange = {
      so: 0,
      eo: 12,
      isCollapsed() {
        return false;
      },
      insertNode,
    };
    const selectSpy = vi.spyOn(range, 'createFromNodeBefore').mockReturnValue({
      select: vi.fn(),
    });
    hintPopover.replace();

    expect(hintPopover.lastWordRange).to.equal(null);
    expect(insertNode.mock.calls[0][0].outerHTML).to.equal('<strong>@david</strong>');
    expect(selectSpy).toHaveBeenCalled();

    await new Promise((resolve) => {
      hintPopover.searchKeyword(1, 'missing', (items) => {
        expect(items).to.equal(undefined);
        resolve();
      });
    });
  });

  it('replaces empty matches, skips empty groups, and ignores unrelated keys', () => {
    const options = $$.extend({}, $$.summernote.options, {
      hint: [
        {
          words: ['zebra'],
          match: /\B#(\w*)$/,
          search(keyword, callback) {
            callback(this.words.filter((item) => item.indexOf(keyword) === 0));
          },
        },
        {
          words: ['alice'],
          match: /\B@(\w*)$/,
          search(keyword, callback) {
            callback(this.words.filter((item) => item.indexOf(keyword) === 0));
          },
        },
      ],
    });

    context = new Context($$('<div><p>@</p></div>').appendTo('body'), options);
    hintPopover = new HintPopover(context);
    hintPopover.initialize();

    const showSpy = vi.spyOn(hintPopover, 'show');
    const inactiveReplaceSpy = vi.spyOn(hintPopover, 'replace');
    hintPopover.createGroup(0, '@').appendTo(hintPopover.$content);
    expect(showSpy).not.toHaveBeenCalled();

    hintPopover.$content.empty();
    const insertNode = vi.fn();
    hintPopover.lastWordRange = {
      so: 0,
      eo: 1,
      isCollapsed() {
        return false;
      },
      insertNode,
    };
    hintPopover.createGroup(1, '@').appendTo(hintPopover.$content);
    hintPopover.$content.find('.note-hint-item').first().addClass('active').attr('aria-selected', 'true');
    hintPopover.matchingWord = '';
    const trackedRange = hintPopover.lastWordRange;

    hintPopover.replace();

    expect(insertNode).toHaveBeenCalledOnce();
    expect(trackedRange.so).to.equal(1);
    expect(hintPopover.lastWordRange).to.equal(null);
    expect(inactiveReplaceSpy).toHaveBeenCalledOnce();

    const moveUpSpy = vi.spyOn(hintPopover, 'moveUp');
    const moveDownSpy = vi.spyOn(hintPopover, 'moveDown');
    hintPopover.hide();
    hintPopover.handleKeydown({ keyCode: 38, preventDefault: vi.fn() });
    hintPopover.show();
    hintPopover.handleKeydown({ keyCode: 9, preventDefault: vi.fn() });

    expect(moveUpSpy).not.toHaveBeenCalled();
    expect(moveDownSpy).not.toHaveBeenCalled();
  });

  it('positions word hints, skips empty results, and hides on unmatched content', () => {
    const manualContext = {
      layoutInfo: {
        editable: $$('<div><p>@al</p></div>').appendTo('body'),
      },
      options: $$.extend({}, $$.summernote.options, {
        container: $$('body'),
        hintMode: 'words',
        hintDirection: 'top',
        hint: {
          words: ['alice'],
          match: /\B(@\w*)$/,
          search(keyword, callback) {
            callback(this.words.filter((item) => item.indexOf(keyword) === 0));
          },
        },
      }),
      invoke: vi.fn(),
      triggerEvent: vi.fn(),
    };
    const rangeStub = {
      getWordsRange() {
        return wordRangeStub;
      },
      getWordsMatchRange() {
        return wordRangeStub;
      },
      getWordRange() {
        return wordRangeStub;
      },
    };
    const wordRangeStub = {
      toString() {
        return '@al';
      },
      getClientRects() {
        return [new DOMRect(25, 40, 10, 12)];
      },
    };
    manualContext.invoke.mockImplementation((command) => {
      if (command === 'editor.getLastRange') {
        return rangeStub;
      }
    });

    hintPopover = new HintPopover(manualContext);
    hintPopover.initialize();
    const createGroupSpy = vi.spyOn(hintPopover, 'createGroup');
    const hideSpy = vi.spyOn(hintPopover, 'hide');

    hintPopover.handleKeyup({ keyCode: 65 });
    expect(createGroupSpy).toHaveBeenCalledWith(0, '@al');

    wordRangeStub.getClientRects = () => [];
    hintPopover.handleKeyup({ keyCode: 65 });

    wordRangeStub.getClientRects = () => [new DOMRect(25, 40, 10, 12)];
    wordRangeStub.toString = () => '';
    hintPopover.handleKeyup({ keyCode: 65 });
    expect(hideSpy).toHaveBeenCalled();

    hintPopover.handleKeyup({ keyCode: 13 });
  });

  it('covers non-word hint positioning, missing matches, and module event wrappers', () => {
    const manualContext = {
      layoutInfo: {
        editable: $$('<div><p>al</p></div>').appendTo('body'),
      },
      options: $$.extend({}, $$.summernote.options, {
        container: $$('body'),
        hintDirection: 'bottom',
        hint: [
          {
            words: ['#alice'],
            match: /\B#(\w*)$/,
            search(keyword, callback) {
              callback(this.words.filter((item) => item.indexOf(keyword) === 0));
            },
          },
          {
            words: ['alice'],
            match: /\b(\w{1,})$/,
            search(keyword, callback) {
              callback(this.words.filter((item) => item.indexOf(keyword) === 0));
            },
          },
        ],
      }),
      invoke: vi.fn(),
      triggerEvent: vi.fn(),
    };
    const wordRangeStub = {
      toString() {
        return 'al';
      },
      getClientRects() {
        return [new DOMRect(15, 20, 10, 8)];
      },
    };
    manualContext.invoke.mockImplementation((command) => {
      if (command === 'editor.getLastRange') {
        return {
          getWordRange() {
            return wordRangeStub;
          },
        };
      }
    });

    hintPopover = new HintPopover(manualContext);
    hintPopover.initialize();
    const hideSpy = vi.spyOn(hintPopover, 'hide');
    const keydownSpy = vi.spyOn(hintPopover, 'handleKeydown');
    const keyupSpy = vi.spyOn(hintPopover, 'handleKeyup');

    hintPopover.handleKeyup({ keyCode: 65 });
    expect(parseFloat(hintPopover.$popover.css('top'))).to.be.greaterThan(0);

    manualContext.options.hintMode = 'words';
    manualContext.invoke.mockImplementation((command) => {
      if (command === 'editor.getLastRange') {
        return {
          getWordsRange() {
            return wordRangeStub;
          },
          getWordsMatchRange() {
            return null;
          },
        };
      }
    });
    hintPopover.handleKeyup({ keyCode: 65 });
    expect(hideSpy).toHaveBeenCalled();

    hintPopover.events['summernote.keydown'](null, { keyCode: 40 });
    hintPopover.events['summernote.keyup'](null, {
      isDefaultPrevented() {
        return true;
      },
      keyCode: 65,
    });
    hintPopover.events['summernote.keyup'](null, {
      isDefaultPrevented() {
        return false;
      },
      keyCode: 65,
    });
    hintPopover.events['summernote.disable summernote.dialog.shown summernote.blur']();

    expect(keydownSpy).toHaveBeenCalledTimes(1);
    expect(keyupSpy.mock.calls.length).to.be.greaterThanOrEqual(1);
    expect(hideSpy).toHaveBeenCalled();
  });
});
