/**
 * History.spec.js
 * (c) 2015-present Summernote Team
 * (c) 2026-present Jürgen Schwind
 * Summernote Next may be freely distributed under the MIT license.
 */

import { afterEach, describe, it, expect, vi } from 'vitest';
import $$ from '@/js/core/dom-query.js';
import range from '@/js/core/range';
import History from '@/js/editing/History';

describe('base:editing.History', () => {
  const originalCreate = range.create;
  const originalCreateFromBookmark = range.createFromBookmark;

  function createHistory(html, historyLimit) {
    const $editable = $$('<div class="note-editable">' + html + '</div>');
    return {
      $editable: $editable,
      history: new History({
        layoutInfo: { editable: $editable },
        options: { historyLimit: historyLimit || 2 },
      }),
    };
  }

  afterEach(() => {
    range.create = originalCreate;
    range.createFromBookmark = originalCreateFromBookmark;
  });

  it('creates and applies snapshots with bookmarks', () => {
    const { history, $editable } = createHistory('<p>one</p>');
    const bookmark = { s: { path: [0], offset: 0 }, e: { path: [0], offset: 1 } };
    const select = vi.fn();

    range.create = vi.fn(() => ({
      isOnEditable: () => true,
      bookmark: () => bookmark,
    }));
    range.createFromBookmark = vi.fn(() => ({
      select: select,
    }));

    const snapshot = history.makeSnapshot();

    expect(snapshot.contents).to.equal('<p>one</p>');
    expect(snapshot.bookmark).to.deep.equal(bookmark);

    history.applySnapshot({
      contents: '<p>two</p>',
      bookmark: bookmark,
    });

    expect($editable.html()).to.equal('<p>two</p>');
    expect(select).toHaveBeenCalledTimes(1);

    history.applySnapshot({
      contents: null,
      bookmark: null,
    });

    expect($editable.html()).to.equal('<p>two</p>');
  });

  it('uses an empty bookmark when the range is outside the editable', () => {
    const { history } = createHistory('<p>alpha</p>');

    range.create = vi.fn(() => ({
      isOnEditable: () => false,
      bookmark: () => ({ shouldNot: 'run' }),
    }));

    expect(history.makeSnapshot()).to.deep.equal({
      contents: '<p>alpha</p>',
      bookmark: {
        s: { path: [], offset: 0 },
        e: { path: [], offset: 0 },
      },
    });
  });

  it('records snapshots, trims redo state, and enforces the history limit', () => {
    const { history } = createHistory('<p>one</p>', 2);
    let counter = 0;

    history.makeSnapshot = vi.fn(() => ({
      contents: 'snapshot-' + (++counter),
      bookmark: null,
    }));

    history.recordUndo();
    history.recordUndo();
    history.recordUndo();

    expect(history.stack.map((snapshot) => snapshot.contents)).to.deep.equal([
      'snapshot-2',
      'snapshot-3',
    ]);
    expect(history.stackOffset).to.equal(1);

    history.stack = [
      { contents: 'first', bookmark: null },
      { contents: 'second', bookmark: null },
      { contents: 'third', bookmark: null },
    ];
    history.stackOffset = 1;

    history.makeSnapshot = vi.fn(() => ({
      contents: 'replacement',
      bookmark: null,
    }));

    history.recordUndo();

    expect(history.stack.map((snapshot) => snapshot.contents)).to.deep.equal([
      'second',
      'replacement',
    ]);
    expect(history.stackOffset).to.equal(1);
  });

  it('commits, resets, rewinds, undoes, and redoes snapshots', () => {
    const { history, $editable } = createHistory('<p>start</p>', 5);
    const recordUndo = vi.fn(() => {
      history.stackOffset += 1;
      history.stack = history.stack.slice(0, history.stackOffset);
      history.stack.push({ contents: 'current', bookmark: null });
    });
    const applySnapshot = vi.fn();

    history.recordUndo = recordUndo;
    history.applySnapshot = applySnapshot;
    history.stack = [
      { contents: 'first', bookmark: null },
      { contents: 'second', bookmark: null },
    ];
    history.stackOffset = 1;

    $editable.html('changed');
    history.rewind();
    expect(recordUndo).toHaveBeenCalledTimes(1);
    expect(history.stackOffset).to.equal(0);
    expect(applySnapshot).toHaveBeenLastCalledWith(history.stack[0]);

    history.stack = [
      { contents: 'first', bookmark: null },
      { contents: 'second', bookmark: null },
    ];
    history.stackOffset = 1;
    $editable.html('changed again');
    history.undo();
    expect(recordUndo).toHaveBeenCalledTimes(2);
    expect(history.stackOffset).to.equal(1);
    expect(applySnapshot).toHaveBeenLastCalledWith(history.stack[1]);

    history.stack = [
      { contents: 'first', bookmark: null },
      { contents: 'second', bookmark: null },
      { contents: 'third', bookmark: null },
    ];
    history.stackOffset = 1;
    history.redo();
    expect(history.stackOffset).to.equal(2);
    expect(applySnapshot).toHaveBeenLastCalledWith(history.stack[2]);

    history.stackOffset = 2;
    history.redo();
    expect(history.stackOffset).to.equal(2);

    history.stack = [{ contents: 'only', bookmark: null }];
    history.stackOffset = 0;
    $editable.html('only');
    history.undo();
    expect(history.stackOffset).to.equal(0);

    const commitRecordUndo = vi.fn(() => {
      history.stackOffset = 0;
      history.stack = [{ contents: 'committed', bookmark: null }];
    });
    history.recordUndo = commitRecordUndo;
    history.stack = [{ contents: 'stale', bookmark: null }];
    history.stackOffset = 0;

    history.commit();
    expect(history.stack).to.deep.equal([{ contents: 'committed', bookmark: null }]);
    expect(history.stackOffset).to.equal(0);

    const resetRecordUndo = vi.fn(() => {
      history.stackOffset = 0;
      history.stack = [{ contents: 'reset', bookmark: null }];
    });
    history.recordUndo = resetRecordUndo;
    $editable.html('<p>filled</p>');

    history.reset();
    expect($editable.html()).to.equal('');
    expect(history.stack).to.deep.equal([{ contents: 'reset', bookmark: null }]);
    expect(history.stackOffset).to.equal(0);
  });

  it('rewinds without recording when the html already matches the current snapshot', () => {
    const { history, $editable } = createHistory('<p>same</p>', 5);

    history.recordUndo = vi.fn();
    history.applySnapshot = vi.fn();
    history.stack = [{ contents: '<p>same</p>', bookmark: null }];
    history.stackOffset = 0;

    history.rewind();

    expect(history.recordUndo).not.toHaveBeenCalled();
    expect(history.applySnapshot).toHaveBeenCalledWith(history.stack[0]);
    expect($editable.html()).to.equal('<p>same</p>');
  });
});
