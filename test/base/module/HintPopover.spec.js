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
});
