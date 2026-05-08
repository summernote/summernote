/**
 * Bullet.spec.js
 * (c) 2015-present Summernote Team
 * (c) 2026-present Jürgen Schwind
 * Summernote Next may be freely distributed under the MIT license.
 */

import { afterEach, describe, it, expect, vi } from 'vitest';
import $$ from '@/js/core/dom-query.js';
import range from '@/js/core/range';
import dom from '@/js/core/dom';
import Bullet from '@/js/editing/Bullet';

describe('base:editing.Bullet', () => {
  const originalCreate = range.create;
  const originalCreateFromParaBookmark = range.createFromParaBookmark;

  afterEach(() => {
    range.create = originalCreate;
    range.createFromParaBookmark = originalCreateFromParaBookmark;
  });

  it('delegates ordered and unordered list insertion', () => {
    const bullet = new Bullet();
    const toggleList = vi.fn();

    bullet.toggleList = toggleList;
    bullet.insertOrderedList('editable');
    bullet.insertUnorderedList('editable');

    expect(toggleList.mock.calls).to.deep.equal([
      ['OL', 'editable'],
      ['UL', 'editable'],
    ]);
  });

  it('indents list items into an existing nested list and plain paragraphs via margin', () => {
    const bullet = new Bullet();
    const select = vi.fn();
    const root = document.createElement('div');
    const hostList = document.createElement('ul');
    const previousItem = document.createElement('li');
    const nestedList = document.createElement('ul');
    const first = document.createElement('li');
    const second = document.createElement('li');
    const para = document.createElement('p');
    const other = document.createElement('p');

    previousItem.appendChild(nestedList);
    hostList.appendChild(previousItem);
    hostList.appendChild(first);
    hostList.appendChild(second);
    para.style.marginLeft = '10px';
    root.appendChild(hostList);
    root.appendChild(para);
    root.appendChild(other);
    document.body.appendChild(root);

    range.create = vi.fn(() => ({
      wrapBodyInlineWithPara() {
        return this;
      },
      nodes() {
        return [first, second, para, other];
      },
      select: select,
    }));

    bullet.findList = vi.fn((node) => node === previousItem ? nestedList : null);

    bullet.indent(root);

    expect(nestedList.children.length).to.equal(2);
    expect(nestedList.children[0]).to.equal(first);
    expect(nestedList.children[1]).to.equal(second);
    expect(para.style.marginLeft).to.equal('35px');
    expect(other.style.marginLeft).to.equal('25px');
    expect(select).toHaveBeenCalledTimes(1);
    root.remove();
  });

  it('wraps list items before appending them to the previous sibling when indenting', () => {
    const bullet = new Bullet();
    const wrapper = document.createElement('ul');
    const list = document.createElement('ul');
    const first = document.createElement('li');
    const second = document.createElement('li');
    const third = document.createElement('li');
    const select = vi.fn();

    list.appendChild(first);
    list.appendChild(second);
    list.appendChild(third);

    range.create = vi.fn(() => ({
      wrapBodyInlineWithPara() {
        return this;
      },
      nodes() {
        return [second, third];
      },
      select: select,
    }));

    bullet.findList = vi.fn(() => null);
    bullet.wrapList = vi.fn((paras) => {
      paras.forEach((para) => wrapper.appendChild(para));
      return paras;
    });
    bullet.appendToPrevious = vi.fn();

    bullet.indent(list);

    expect(bullet.wrapList).toHaveBeenCalledTimes(1);
    expect(bullet.appendToPrevious).toHaveBeenCalledTimes(2);
    expect(bullet.appendToPrevious.mock.calls[0][0]).to.equal(wrapper);
    expect(select).toHaveBeenCalledTimes(1);
  });

  it('outdents list items through releaseList and clears paragraph margins', () => {
    const bullet = new Bullet();
    const root = document.createElement('div');
    const list = document.createElement('ul');
    const item = document.createElement('li');
    const para = document.createElement('p');
    const deeper = document.createElement('p');
    const plain = document.createElement('p');
    const select = vi.fn();

    para.style.marginLeft = '50px';
    deeper.style.marginLeft = '10px';
    list.appendChild(item);
    root.appendChild(list);
    root.appendChild(para);
    root.appendChild(deeper);
    root.appendChild(plain);
    document.body.appendChild(root);

    range.create = vi.fn(() => ({
      wrapBodyInlineWithPara() {
        return this;
      },
      nodes() {
        return [item, para, deeper, plain];
      },
      select: select,
    }));

    bullet.releaseList = vi.fn(() => []);

    bullet.outdent(document.createElement('div'));

    expect(bullet.releaseList).toHaveBeenCalledTimes(1);
    expect(para.style.marginLeft).to.equal('25px');
    expect(deeper.style.marginLeft).to.equal('');
    expect(plain.style.marginLeft).to.equal('');
    expect(select).toHaveBeenCalledTimes(1);
    root.remove();
  });

  it('toggles pure paragraphs into lists and restores the bookmarked range', () => {
    const bullet = new Bullet();
    const p1 = document.createElement('p');
    const p2 = document.createElement('p');
    const bookmark = { s: { path: [0], offset: 0 }, e: { path: [1], offset: 0 } };
    const select = vi.fn();

    p1.textContent = 'one';
    p2.textContent = 'two';

    range.create = vi.fn(() => ({
      wrapBodyInlineWithPara() {
        return this;
      },
      nodes(pred) {
        return pred === dom.isList ? [] : [p1, p2];
      },
      paraBookmark() {
        return bookmark;
      },
    }));
    range.createFromParaBookmark = vi.fn(() => ({ select: select }));
    bullet.wrapList = vi.fn((paras) => paras);

    bullet.toggleList('OL', document.createElement('div'));

    expect(bullet.wrapList).toHaveBeenCalledTimes(1);
    expect(range.createFromParaBookmark).toHaveBeenCalledWith(bookmark, [p1, p2]);
    expect(select).toHaveBeenCalledTimes(1);
  });

  it('changes the list type when the current list does not match the requested one', () => {
    const bullet = new Bullet();
    const root = document.createElement('div');
    const ul = document.createElement('ul');
    const li = document.createElement('li');
    const bookmark = { s: { path: [0], offset: 0 }, e: { path: [0], offset: 0 } };

    li.textContent = 'item';
    ul.appendChild(li);
    root.appendChild(ul);

    range.create = vi.fn(() => ({
      wrapBodyInlineWithPara() {
        return this;
      },
      nodes(pred) {
        return pred === dom.isList ? [ul] : [li];
      },
      paraBookmark() {
        return bookmark;
      },
    }));
    range.createFromParaBookmark = vi.fn(() => ({ select: vi.fn() }));

    bullet.toggleList('OL', root);

    expect(root.firstChild.nodeName).to.equal('OL');
    expect(root.firstChild.firstChild.nodeName).to.equal('LI');
  });

  it('releases lists when toggling the same list type again', () => {
    const bullet = new Bullet();
    const ul = document.createElement('ul');
    const li = document.createElement('li');
    const bookmark = { s: { path: [0], offset: 0 }, e: { path: [0], offset: 0 } };
    const released = [document.createElement('p')];

    ul.appendChild(li);

    range.create = vi.fn(() => ({
      wrapBodyInlineWithPara() {
        return this;
      },
      nodes(pred) {
        return pred === dom.isList ? [ul] : [li];
      },
      paraBookmark() {
        return bookmark;
      },
    }));
    range.createFromParaBookmark = vi.fn(() => ({ select: vi.fn() }));
    bullet.releaseList = vi.fn(() => released);

    bullet.toggleList('UL', document.createElement('div'));

    expect(bullet.releaseList).toHaveBeenCalledTimes(1);
    expect(range.createFromParaBookmark).toHaveBeenCalledWith(bookmark, released);
  });

  it('wraps paragraphs into adjacent lists and merges following lists', () => {
    const bullet = new Bullet();
    const root = document.createElement('div');
    const prevList = document.createElement('ul');
    const prevItem = document.createElement('li');
    const para1 = document.createElement('p');
    const para2 = document.createElement('p');
    const nextList = document.createElement('ul');
    const nextItem = document.createElement('li');

    prevItem.textContent = 'before';
    nextItem.textContent = 'after';
    para1.textContent = 'one';
    para2.textContent = 'two';

    prevList.appendChild(prevItem);
    nextList.appendChild(nextItem);
    root.appendChild(prevList);
    root.appendChild(para1);
    root.appendChild(para2);
    root.appendChild(nextList);

    const wrapped = bullet.wrapList([para1, para2], 'UL');

    expect(wrapped.map((node) => node.nodeName)).to.deep.equal(['LI', 'LI']);
    expect(prevList.children.length).to.equal(4);
    expect(prevList.lastChild.textContent).to.equal('after');
    expect(root.contains(nextList)).to.equal(false);
  });

  it('creates a default unordered list when no list name is provided', () => {
    const bullet = new Bullet();
    const root = document.createElement('div');
    const para = document.createElement('p');

    para.textContent = 'one';
    root.appendChild(para);

    const wrapped = bullet.wrapList([para]);

    expect(wrapped[0].nodeName).to.equal('LI');
    expect(root.firstChild.nodeName).to.equal('UL');
  });

  it('releases top-level list items into paragraphs and cleans up empty lists', () => {
    const bullet = new Bullet();
    const root = $$('<div><ul><li id="one">one</li><li id="two">two</li></ul></div>')[0];
    const first = root.querySelector('#one');
    const second = root.querySelector('#two');

    const released = bullet.releaseList([[first, second]], true);

    expect(released.map((node) => node.nodeName)).to.deep.equal(['P', 'P']);
    expect(root.innerHTML).to.equal('<p>one</p><p>two</p>');
  });

  it('keeps list items when releasing without escaping to the body', () => {
    const bullet = new Bullet();
    const root = $$('<div><ul><li id="one">one</li><li id="two">two</li></ul></div>')[0];
    const second = root.querySelector('#two');
    const released = bullet.releaseList([[second]], false);

    expect(released.map((node) => node.nodeName)).to.deep.equal(['P']);
    expect(root.querySelector('p')).to.exist;
    expect(root.querySelector('ul').firstChild.id).to.equal('one');
  });

  it('skips paragraph replacement when a nested list is attached directly to another list', () => {
    const bullet = new Bullet();
    const root = document.createElement('div');
    const outerList = document.createElement('ul');
    const innerList = document.createElement('ul');
    const item = document.createElement('li');

    item.textContent = 'nested';
    innerList.appendChild(item);
    outerList.appendChild(innerList);
    root.appendChild(outerList);

    const released = bullet.releaseList([[item]], false);

    expect(released.map((node) => node.nodeName)).to.deep.equal(['LI']);
  });

  it('releases nested list items and preserves trailing siblings as a nested list', () => {
    const bullet = new Bullet();
    const root = $$('<div><ul><li id="outer">outer<ul><li id="first">first</li><li id="second">second</li></ul></li></ul></div>')[0];
    const first = root.querySelector('#first');
    const second = root.querySelector('#second');
    const released = bullet.releaseList([[first]], false);

    expect(released).to.deep.equal([first]);
    expect(root.querySelector('#outer').nextElementSibling).to.equal(first);
    expect(first.querySelector('ul')).to.exist;
    expect(first.querySelector('ul').firstChild).to.equal(second);
  });

  it('leaves earlier nested siblings in place when releasing later ones', () => {
    const bullet = new Bullet();
    const root = $$('<div><ul><li id="outer"><ul><li id="first">first</li><li id="second">second</li></ul></li></ul></div>')[0];
    const second = root.querySelector('#second');

    bullet.releaseList([[second]], false);

    expect(root.querySelector('#outer ul')).to.exist;
    expect(root.querySelector('#outer ul').firstChild.id).to.equal('first');
  });

  it('removes empty parent list items after releasing nested items before a sibling item', () => {
    const bullet = new Bullet();
    const root = $$('<div><ul><li id="outer"><ul><li id="first">first</li></ul></li><li id="after">after</li></ul></div>')[0];
    const first = root.querySelector('#first');

    const released = bullet.releaseList([[first]], false);

    expect(released).to.deep.equal([first]);
    expect(root.querySelector('#outer')).to.equal(null);
    expect(root.querySelector('ul').children[0]).to.equal(first);
  });

  it('appends to the previous sibling when present, otherwise wraps with a list item', () => {
    const bullet = new Bullet();
    const host = document.createElement('div');
    const previous = document.createElement('li');
    const node = document.createElement('ul');
    const orphanHost = document.createElement('div');
    const orphan = document.createElement('ul');

    host.appendChild(previous);
    host.appendChild(node);
    orphanHost.appendChild(orphan);

    const appended = bullet.appendToPrevious(node);
    const wrapped = bullet.appendToPrevious(orphan);

    expect(appended).to.equal(previous);
    expect(previous.lastChild).to.equal(node);
    expect(Array.isArray(wrapped)).to.equal(true);
    expect(wrapped[0]).to.equal(orphan);
    expect(orphan.parentNode.nodeName).to.equal('LI');
  });

  it('finds nested lists and following siblings', () => {
    const bullet = new Bullet();
    const host = document.createElement('li');
    const span = document.createElement('span');
    const list = document.createElement('ul');
    const first = document.createElement('li');
    const second = document.createElement('li');
    const third = document.createElement('li');

    host.appendChild(span);
    host.appendChild(list);
    host.appendChild(first);
    host.appendChild(second);
    host.appendChild(third);

    expect(bullet.findList(host)).to.equal(list);
    expect(bullet.findList(null)).to.equal(null);
    expect(bullet.findNextSiblings(first)).to.deep.equal([second, third]);
  });
});
