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

    var KEY = key.code;

    var DROPDOWN_KEYCODES = [KEY.UP, KEY.DOWN, KEY.ENTER];

    this.lastWordRange = null;

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

      this.$popover = ui.popover({
        className: 'note-hint-popover'
      }).render().appendTo('body');

      this.$popoverContent = this.$popover.find('.popover-content');

      dom.attachEvents($note, this.events);

      this.$popoverContent.on('click', '.note-hint-item', function () {
        self.$popoverContent.find('.active').removeClass('active');
        $(this).addClass('active');
        self.replace();
        self.hide();
      });
    };

    this.destroy = function () {
      if (!hints.length) {
        return;
      }
      this.$popover.remove();
      dom.detachEvents($note, this.events);
      this.$popoverContent.off('click');
    };

    this.activate = function ($activeItem) {
      this.$popoverContent.find('.active').removeClass('active');
      $activeItem.addClass('active');

      this.scrollTo($activeItem);
    };

    this.scrollTo = function ($node) {
      var $parent = $node.parent().parent();
      $parent[0].scrollTop = $node[0].offsetTop - ($parent.innerHeight() / 2);
    };

    this.moveDown = function () {
      var $old = this.$popoverContent.find('.note-hint-item.active');
      var $next = $old.next();

      if ($next.length) {
        this.activate($next);
      } else {
        var $parentNext = $old.parent().next();

        if (!$parentNext.length) {
          $parentNext = this.$popoverContent.find('.note-hint-group').first();
        }

        this.activate($parentNext.find('.note-hint-item').first());
      }
    };

    this.moveUp = function () {
      var $old = this.$popoverContent.find('.note-hint-item.active');
      var $prev = $old.prev();

      if ($prev.length) {
        this.activate($prev);
      } else {
        var $parentPrev = $old.parent().prev();

        if (!$parentPrev.length) {
          $parentPrev = this.$popoverContent.find('.note-hint-group').last();
        }

        this.activate($parentPrev.find('.note-hint-item').last());
      }
    };

    this.replace = function () {
      var $activeItem = this.$popoverContent.find('.active');
      var content = this.content($activeItem.data('index'), $activeItem.data('item'));

      if (typeof content === 'string') {
        content = document.createTextNode(content);
      }

      this.lastWordRange.insertNode(content);
      range.createFromNode(content).collapse().select();

      this.lastWordRange = null;
    };

    this.content = function (index, obj) {
      if (hints[index] && hints[index].content) {
        return hints[index].content(obj);
      } else {
        return obj;
      }
    };

    this.searchKeyword = function (index, keyword, callback) {
      var hintObject = hints[index];
      if (hintObject && hintObject.match.test(keyword)) {
        var matches = hintObject.match.exec(keyword);
        this.search(index, matches[1], callback);
      } else {
        callback();
      }
    };

    this.search = function (index, keyword, callback) {
      var hintObject = hints[index];
      if (hintObject && hintObject.search) {
        hintObject.search(keyword, callback);
      } else {
        callback();
      }

    };

    this.createListTemplate = function (index, list) {
      var items  = [];
      list = list || [];

      for (var i = 0, len = list.length; i < len; i++) {
        var $item = $('<div class="note-hint-item"></div>');
        $item.append(this.createItemTemplate(index, list[i]));
        $item.data({ 'index' : index, 'item' : list[i] });
        items.push($item);
      }

      if (index === 0 && items.length) {
        items[0].addClass('active');
      }

      return items;
    };

    this.createItemTemplate = function (index, obj) {
      var hintObject = hints[index];
      if (hintObject && hintObject.template) {
        return hintObject.template(obj);
      } else {
        return obj + '';
      }
    };

    this.updateKeydown = function (e) {
      if (this.$popover.css('display') === 'none') {
        return true;
      }

      if (e.keyCode === KEY.ENTER) {
        e.preventDefault();
        // replace
        this.replace();
        this.hide();
        summernote.invoke('editor.focus');
      } else if (e.keyCode === KEY.UP) {
        e.preventDefault();
        // popover cursor up
        this.moveUp();
      } else if (e.keyCode === KEY.DOWN) {
        e.preventDefault();
        // popover cursor down
        this.moveDown();
      }
    };

    this.createHint = function (index, keyword) {
      this.searchKeyword(index, keyword, function (list) {
        var $group = self.$popoverContent.find('.note-hint-group-' + index);
        var templateList = self.createListTemplate(index, list);
        $group.html(templateList);

        if (templateList.length) {
          self.show();
        }
      });
    };

    this.update = function (e) {
      if (DROPDOWN_KEYCODES.indexOf(e.keyCode) > -1) {
        if (e.keyCode === KEY.ENTER) {
          if (this.$popover.css('display') === 'block') {
            return false;
          }
        }

      } else {

        if (hints && hints.length) {
          var range = summernote.invoke('editor.createRange');
          var word = range.getWordRange();
          var keyword = word.toString();

          this.$popoverContent.empty().data('count', 0);

          var rects = word.getClientRects();
          var rect = rects[rects.length - 1];

          if (rect) {
            this.$popover.css({
              left: rect.left,
              top: rect.top + rect.height
            }).hide();

            this.lastWordRange = word;

            for (var i = 0, len = hints.length; i < len; i++) {
              if (hints[i].match.test(keyword)) {
                this.$popoverContent.append('<div class="note-hint-group note-hint-group-' + i + '"></div>');

                this.createHint(i, keyword);
              }
            }
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
