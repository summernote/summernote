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
    var hint = summernote.options.hint || false;

    if (hint && !(hint instanceof Array)) {
      hint = [hint];
    }

    var KEY = key.code;

    var DROPDOWN_KEYCODES = [KEY.UP, KEY.DOWN, KEY.ENTER];

    var $popover = ui.popover({
      className: 'note-hint-popover',
      callback : function ($node) {
        $node.css({
          'min-width': '100px',
          'padding': '2px'
        });
      }
    }).render().appendTo('body');

    var $popoverContent = $popover.find('.popover-content');


    this.timer = null;


    this.events = {
      'summernote.keyup': function (e, nativeEvent) {
        self.update(nativeEvent);
      },
      'summernote.keydown' : function (e, nativeEvent) {
        self.updateKeydown(nativeEvent);
      }
    };

    this.initialize = function () {
      if (!hint) {
        return;
      }
      dom.attachEvents($note, this.events);

      $popoverContent.on('click', '.hint-item', function () {
        $popoverContent.find('.active').removeClass('active');
        $(this).addClass('active');
        self.replace();
        self.hide();
      });
    };

    this.destroy = function () {
      if (!hint) {
        return;
      }
      dom.detachEvents($note, this.events);
      $popoverContent.off('click');
    };

    this.activate = function (item) {
      var $activeItem = $(item);
      $popoverContent.find('.active').removeClass('active');
      $activeItem.addClass('active');

      this.scrollTo($activeItem);
    };

    this.scrollTo = function ($node) {
      var $parent = $node.parent().parent();
      $parent[0].scrollTop = $node[0].offsetTop - ($parent.innerHeight() / 2);
    };

    this.moveDown = function () {
      var $old = $popoverContent.find('.hint-item.active');
      var $next = $old.next();

      if ($next.length) {
        this.activate($next);
      } else {
        var $parentNext = $old.parent().next();

        if (!$parentNext.length) {
          $parentNext = $popoverContent.find('.hint-group').first();
        }

        this.activate($($parentNext).find('.hint-item').first());
      }
    };

    this.moveUp = function () {
      var $old = $popoverContent.find('.hint-item.active');
      var $prev = $old.prev();

      if ($prev.length) {
        this.activate($prev);
      } else {
        var $parentPrev = $old.parent().prev();

        if (!$parentPrev.length) {
          $parentPrev = $popoverContent.find('.hint-group').last();
        }

        this.activate($($parentPrev).find('.hint-item').last());
      }
    };

    this.replace = function () {
      var wordRange = $popover.data('wordRange');
      var $activeItem = $popoverContent.find('.active');
      var content = this.content($activeItem.data('index'), $activeItem.data('item'));

      if (typeof content === 'string') {
        content = document.createTextNode(content);
      }

      $popover.removeData('wordRange');

      wordRange.insertNode(content);
      range.createFromNode(content).collapse().select();
    };

    this.content = function (index, obj) {
      if (hint[index] && hint[index].content) {
        return hint[index].content(obj);
      } else {
        return obj;
      }
    };

    this.searchKeyword = function (hint, keyword, callback) {
      if (hint && hint.match.test(keyword)) {
        var matches = hint.match.exec(keyword);
        this.search(hint, matches[1], callback);
      } else {
        callback();
      }
    };

    this.search = function (hint, keyword, callback) {

      if (hint && hint.search) {
        hint.search(keyword, callback);
      } else {
        callback();
      }

    };

    this.createListTemplate = function (index, hint, list) {
      var items  = [];
      list = list || [];

      for (var i = 0, len = list.length; i < len; i++) {
        var $item = $('<div class="hint-item"></div>');
        $item.append(this.createItemTemplate(hint, list[i]));
        $item.data({ 'index' : index, 'item' : list[i] });
        items.push($item);
      }

      if (index === 0 && items.length) {
        items[0].addClass('active');
      }

      return items;
    };

    this.createItemTemplate = function (hint, obj) {
      if (hint && hint.template) {
        return hint.template(obj);
      } else {
        return '';
      }
    };

    this.updateKeydown = function (e) {
      if ($popover.css('display') === 'none') {
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

    this.invokeHint = function (index, hint, keyword) {
      this.searchKeyword(hint, keyword, function (list) {
        var $group = $popoverContent.find('.hint-group-' + index);
        var templateList = self.createListTemplate(index, hint, list);
        $group.html(templateList);

        if (templateList.length) {
          self.show();
        }
      });
    };

    this.update = function (e) {
      if (!hint) {
        return false;
      }

      if (DROPDOWN_KEYCODES.indexOf(e.keyCode) > -1) {
        if (e.keyCode === KEY.ENTER) {
          if ($popover.css('display') === 'block') {
            return false;
          }
        }

      } else {

        if (hint && hint.length) {
          var range = summernote.invoke('editor.createRange');
          var word = range.getWordRange();
          var keyword = word.toString();

          $popoverContent.empty().data('count', 0);

          var rects = word.getClientRects();
          var rect = rects[rects.length - 1];
          $popover.css({
            left: rect.left,
            top: rect.top + rect.height
          }).data('wordRange', word).hide();

          for (var i = 0, len = hint.length; i < len; i++) {
            if (hint[i].match.test(keyword)) {
              $popoverContent.append('<div class="hint-group hint-group-' + i + '"></div>');

              this.invokeHint(i, hint[i], keyword);
            }
          }

        } else {
          this.hide();
        }

      }

    };

    this.show = function () {
      $popover.show();
    };

    this.hide = function () {
      $popover.hide();
    };
  };

  return HintPopover;
});
