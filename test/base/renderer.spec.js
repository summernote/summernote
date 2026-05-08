import { afterEach, describe, expect, it, vi } from 'vitest';
import $$ from '@/js/core/dom-query.js';
import renderer from '@/js/renderer';

describe('renderer', () => {
  afterEach(() => {
    $$('body').empty();
  });

  it('renders markup with options, callbacks, and a parent container', () => {
    const click = vi.fn();
    const callback = vi.fn();
    const optionCallback = vi.fn();
    const createButton = renderer.create('<button type="button" class="base"></button>', callback);
    const $parent = $$('<div class="host"></div>').appendTo('body');

    const $node = createButton({
      contents: 'Open',
      className: 'btn-primary shadow-sm',
      data: {
        action: 'open',
        index: 3,
      },
      click,
      callback: optionCallback,
    }).render($parent);

    $node.trigger('click');

    expect($node.parent()[0]).to.equal($parent[0]);
    expect($node.html()).to.equal('Open');
    expect($node.hasClass('btn-primary')).to.be.true;
    expect($node.hasClass('shadow-sm')).to.be.true;
    expect($node.attr('data-action')).to.equal('open');
    expect($node.attr('data-index')).to.equal('3');
    expect(click).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(optionCallback).toHaveBeenCalledTimes(1);
  });

  it('renders children into the dedicated container when present', () => {
    const createChild = renderer.create('<span class="child">child</span>');
    const createContainer = renderer.create('<div><div class="note-children-container"></div></div>');

    const $node = createContainer([createChild()]).render();

    expect($node.find('.note-children-container .child').length).to.equal(1);
  });

  it('falls back to the root node when no children container exists and lets options override children', () => {
    const createRoot = renderer.create('<div class="plain"></div>');
    const positionalChild = renderer.create('<span class="positional"></span>')();
    const overrideChild = renderer.create('<span class="override"></span>')();

    const $node = createRoot([positionalChild], {
      children: [overrideChild],
    }).render();

    expect($node.children('.override').length).to.equal(1);
    expect($node.find('.positional').length).to.equal(0);
  });

  it('renders plain markup without options or children', () => {
    const $node = renderer.create('<div class="standalone"></div>')().render();

    expect($node.hasClass('standalone')).to.be.true;
    expect($node.children().length).to.equal(0);
  });

  it('handles renderer instances whose children collection is cleared before rendering', () => {
    const instance = renderer.create('<div class="mutable"></div>')();
    instance.children = null;

    const $node = instance.render();

    expect($node.hasClass('mutable')).to.be.true;
  });
});
