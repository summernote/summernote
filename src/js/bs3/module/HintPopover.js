define([
  'summernote/base/core/func',
  'summernote/base/core/list',
  'summernote/base/core/dom',
  'summernote/base/core/range',
  'summernote/base/core/key'
], function (func, list, dom, range, key) {
  var HintPopover = function (summernote) {
    var self = this;
    var ui = $.summernote.ui;

    var $note = summernote.layoutInfo.note;
    var hint = summernote.options.hint || [];
    var hints = (hint instanceof Array) ? hint : [hint];

    this.events = {
      'summernote.keyup': function (e, nativeEvent) {
        self.update(nativeEvent);
      },
      'summernote.keydown' : function (e, nativeEvent) {
        self.updateKeydown(nativeEvent);
      }
    };

    this.initialize = function () {
      if (!hints.length) {
        return;
      }

      this.lastWordRange = null;
      this.$popover = ui.popover({
        className: 'note-hint-popover'
      }).render().appendTo('body');

      this.$popoverContent = this.$popover.find('.popover-content');

      dom.attachEvents($note, this.events);

      this.$popoverContent.on('click', '.note-hint-item', function () {
        self.$popoverContent.find('.active').removeClass('active');
        $(this).addClass('active');
        self.replace();
      });
    };

    this.destroy = function () {
      if (!hints.length) {
        return;
      }

      this.$popover.remove();
      dom.detachEvents($note, this.events);
    };

    this.selectItem = function ($item) {
      this.$popoverContent.find('.active').removeClass('active');
      $item.addClass('active');

      var $container = $item.parent().parent();
      $container[0].scrollTop = $item[0].offsetTop - ($container.innerHeight() / 2);
    };

    this.moveDown = function () {
      var $current = this.$popoverContent.find('.note-hint-item.active');
      var $next = $current.next();

      if ($next.length) {
        this.selectItem($next);
      } else {
        var $nextGroup = $current.parent().next();

        if (!$nextGroup.length) {
          $nextGroup = this.$popoverContent.find('.note-hint-group').first();
        }

        this.selectItem($nextGroup.find('.note-hint-item').first());
      }
    };

    this.moveUp = function () {
      var $current = this.$popoverContent.find('.note-hint-item.active');
      var $prev = $current.prev();

      if ($prev.length) {
        this.selectItem($prev);
      } else {
        var $prevGroup = $current.parent().prev();

        if (!$prevGroup.length) {
          $prevGroup = this.$popoverContent.find('.note-hint-group').last();
        }

        this.selectItem($prevGroup.find('.note-hint-item').last());
      }
    };

    this.replace = function () {
      var $item = this.$popoverContent.find('.note-hint-item.active');
      var node = this.nodeFromItem($item);
      this.lastWordRange.insertNode(node);
      range.createFromNode(node).collapse().select();

      this.lastWordRange = null;
      this.hide();
      summernote.invoke('editor.focus');
    };

    this.nodeFromItem = function ($item) {
      var hint = hints[$item.data('index')];
      var item = $item.data('item');
      var node = hint.content ? hint.content(item) : item;
      if (typeof node === 'string') {
        node = dom.createText(node);
      }
      return node;
    };

    this.createItemTemplates = function (hintIdx, items) {
      var hint = hints[hintIdx];
      return items.map(function (item, idx) {
        var $item = $('<div class="note-hint-item"/>');
        $item.append(hint.template ? hint.template(item) : item + '');
        $item.data({
          'index': hintIdx,
          'item': item
        });

        if (hintIdx === 0 && idx === 0) {
          $item.addClass('active');
        }
        return $item;
      });
    };

    this.updateKeydown = function (e) {
      if (!this.$popover.is(':visible')) {
        return true;
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
    };

    this.searchKeyword = function (index, keyword, callback) {
      var hint = hints[index];
      if (hint && hint.match.test(keyword) && hint.search) {
        var matches = hint.match.exec(keyword);
        hint.search(matches[1], callback);
      } else {
        callback();
      }
    };

    this.createGroup = function (idx, keyword) {
      var $group = $('<div class="note-hint-group note-hint-group-' + idx + '"/>');
      this.searchKeyword(idx, keyword, function (items) {
        items = items || [];
        if (items.length) {
          $group.html(self.createItemTemplates(idx, items));
          self.show();
        }
      });

      return $group;
    };

    this.update = function (e) {
      if (list.contains([key.code.ENTER, key.code.UP, key.code.DOWN], e.keyCode)) {
        if (e.keyCode === key.code.ENTER) {
          if (this.$popover.is(':visible')) {
            return false;
          }
        }
      } else {
        if (hints.length) {
          var wordRange = summernote.invoke('editor.createRange').getWordRange();
          this.$popoverContent.empty().data('count', 0);

          var rect = list.last(wordRange.getClientRects());
          if (rect) {
            this.$popover.css({
              left: rect.left,
              top: rect.top + rect.height
            }).hide();

            this.lastWordRange = wordRange;

            var keyword = wordRange.toString();
            hints.forEach(function (hint, idx) {
              if (hint.match.test(keyword)) {
                self.createGroup(idx, keyword).appendTo(self.$popoverContent);
              }
            });
          }
        } else {
          this.hide();
        }
      }
    };

    this.show = function () {
      this.$popover.show();
    };

    this.hide = function () {
      this.$popover.hide();
    };
  };

  return HintPopover;
});
