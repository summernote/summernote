import $ from 'jquery';
import func from '../core/func';
import lists from '../core/lists';
import dom from '../core/dom';
import range from '../core/range';
import key from '../core/key';

const POPOVER_DIST = 5;

export default class HintPopover {
  constructor(context) {
    this.context = context;

    this.ui = $.summernote.ui;
    this.$editable = context.layoutInfo.editable;
    this.options = context.options;
    this.hint = this.options.hint || [];
    this.direction = this.options.hintDirection || 'bottom';
    this.hints = Array.isArray(this.hint) ? this.hint : [this.hint];

    this.events = {
      'summernote.keyup': (we, e) => {
        if (!e.isDefaultPrevented()) {
          this.handleKeyup(e);
        }
      },
      'summernote.keydown': (we, e) => {
        this.handleKeydown(e);
      },
      'summernote.disable summernote.dialog.shown summernote.blur': () => {
        this.hide();
      },
    };
  }

  shouldInitialize() {
    return this.hints.length > 0;
  }

  initialize() {
    this.lastWordRange = null;
    this.matchingWord = null;
    this.$popover = this.ui.popover({
      className: 'note-hint-popover',
      hideArrow: true,
      direction: '',
    }).render().appendTo(this.options.container);

    this.$popover.hide();
    this.$content = this.$popover.find('.popover-content,.note-popover-content');
    this.$content.on('click', '.note-hint-item', (e) => {
      this.$content.find('.active').removeClass('active');
      $(e.currentTarget).addClass('active');
      this.replace();
    });

    this.$popover.on('mousedown', (e) => { e.preventDefault(); });
  }

  destroy() {
    this.$popover.remove();
  }

  selectItem($item) {
    this.$content.find('.active').removeClass('active');
    $item.addClass('active');

    this.$content[0].scrollTop = $item[0].offsetTop - (this.$content.innerHeight() / 2);
  }

  moveDown() {
    const $current = this.$content.find('.note-hint-item.active');
    const $next = $current.next();

    if ($next.length) {
      this.selectItem($next);
    } else {
      let $nextGroup = $current.parent().next();

      if (!$nextGroup.length) {
        $nextGroup = this.$content.find('.note-hint-group').first();
      }

      this.selectItem($nextGroup.find('.note-hint-item').first());
    }
  }

  moveUp() {
    const $current = this.$content.find('.note-hint-item.active');
    const $prev = $current.prev();

    if ($prev.length) {
      this.selectItem($prev);
    } else {
      let $prevGroup = $current.parent().prev();

      if (!$prevGroup.length) {
        $prevGroup = this.$content.find('.note-hint-group').last();
      }

      this.selectItem($prevGroup.find('.note-hint-item').last());
    }
  }

  replace() {
    const $item = this.$content.find('.note-hint-item.active');

    if ($item.length) {
      var node = this.nodeFromItem($item);
      // If matchingWord length = 0 -> capture OK / open hint / but as mention capture "" (\w*)
      if (this.matchingWord !== null && this.matchingWord.length === 0) {
        this.lastWordRange.so = this.lastWordRange.eo;
      // Else si > 0 and normal case -> adjust range "before" for correct position of insertion
      } else if (this.matchingWord !== null && this.matchingWord.length > 0 && !this.lastWordRange.isCollapsed()) {
        let rangeCompute = this.lastWordRange.eo - this.lastWordRange.so - this.matchingWord.length;
        if (rangeCompute > 0) {
          this.lastWordRange.so += rangeCompute;
        }
      }
      this.lastWordRange.insertNode(node);

      if (this.options.hintSelect === 'next') {
        var blank = document.createTextNode('');
        $(node).after(blank);
        range.createFromNodeBefore(blank).select();
      } else {
        range.createFromNodeAfter(node).select();
      }

      this.lastWordRange = null;
      this.hide();
      this.context.invoke('editor.focus');
      this.context.triggerEvent('change', this.$editable.html(), this.$editable);
    }
  }

  nodeFromItem($item) {
    const hint = this.hints[$item.data('index')];
    const item = $item.data('item');
    let node = hint.content ? hint.content(item) : item;
    if (typeof node === 'string') {
      node = dom.createText(node);
    }
    return node;
  }

  createItemTemplates(hintIdx, items) {
    const hint = this.hints[hintIdx];
    return items.map((item /*, idx */) => {
      const $item = $('<div class="note-hint-item"/>');
      $item.append(hint.template ? hint.template(item) : item + '');
      $item.data({
        'index': hintIdx,
        'item': item,
      });
      return $item;
    });
  }

  handleKeydown(e) {
    if (!this.$popover.is(':visible')) {
      return;
    }

    if (e.keyCode === key.code.ENTER) {
      e.preventDefault();
      this.replace();
    } else if (e.keyCode === key.code.UP) {
      e.preventDefault();
      this.moveUp();
    } else if (e.keyCode === key.code.DOWN) {
      e.preventDefault();
      this.moveDown();
    }
  }

  searchKeyword(index, keyword, callback) {
    const hint = this.hints[index];
    if (hint && hint.match.test(keyword) && hint.search) {
      const matches = hint.match.exec(keyword);
      this.matchingWord = matches[0];
      hint.search(matches[1], callback);
    } else {
      callback();
    }
  }

  createGroup(idx, keyword) {
    const $group = $('<div class="note-hint-group note-hint-group-' + idx + '"></div>');
    this.searchKeyword(idx, keyword, (items) => {
      items = items || [];
      if (items.length) {
        $group.html(this.createItemTemplates(idx, items));
        this.show();
      }
    });

    return $group;
  }

  handleKeyup(e) {
    if (!lists.contains([key.code.ENTER, key.code.UP, key.code.DOWN], e.keyCode)) {
      let range = this.context.invoke('editor.getLastRange');
      let wordRange, keyword;
      if (this.options.hintMode === 'words') {
        wordRange = range.getWordsRange(range);
        keyword = wordRange.toString();

        this.hints.forEach((hint) => {
          if (hint.match.test(keyword)) {
            wordRange = range.getWordsMatchRange(hint.match);
            return false;
          }
        });

        if (!wordRange) {
          this.hide();
          return;
        }

        keyword = wordRange.toString();
      } else {
        wordRange = range.getWordRange();
        keyword = wordRange.toString();
      }

      if (this.hints.length && keyword) {
        this.$content.empty();

        const bnd = func.rect2bnd(lists.last(wordRange.getClientRects()));
        const containerOffset = $(this.options.container).offset();
        if (bnd) {
          bnd.top -= containerOffset.top;
          bnd.left -= containerOffset.left;

          this.$popover.hide();
          this.lastWordRange = wordRange;
          this.hints.forEach((hint, idx) => {
            if (hint.match.test(keyword)) {
              this.createGroup(idx, keyword).appendTo(this.$content);
            }
          });
          // select first .note-hint-item
          this.$content.find('.note-hint-item:first').addClass('active');

          // set position for popover after group is created
          if (this.direction === 'top') {
            this.$popover.css({
              left: bnd.left,
              top: bnd.top - this.$popover.outerHeight() - POPOVER_DIST,
            });
          } else {
            this.$popover.css({
              left: bnd.left,
              top: bnd.top + bnd.height + POPOVER_DIST,
            });
          }
        }
      } else {
        this.hide();
      }
    }
  }

  show() {
    this.$popover.show();
  }

  hide() {
    this.$popover.hide();
  }
}
