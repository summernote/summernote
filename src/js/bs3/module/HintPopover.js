define([
  'summernote/base/core/func',
  'summernote/base/core/list',
  'summernote/base/core/dom'
], function (func, list, dom) {
  var HintPopover = function (summernote) {
    var self = this;
    var ui = $.summernote.ui;

    var $note = summernote.layoutInfo.note;
    var $editingArea = summernote.layoutInfo.editingArea;
    var hint = summernote.options.hint || false;

    var KEY = {
      UP: 38,
      DOWN: 40,
      ENTER: 13
    };

    var DROPDOWN_KEYCODES = [KEY.UP, KEY.DOWN, KEY.ENTER];

    var $popover = ui.popover({
      className: 'note-hint-popover'
    }).render().appendTo('body');


    this.timer = null;


    this.events = {
      'summernote.keyup': function (e) {
        self.update(e);
      }
    };

    this.initialize = function () {
      if (!hint) {
        return;
      }
      dom.attachEvents($note, this.events);
    };

    this.destroy = function () {
      if (!hint) {
        return;
      }
      dom.detachEvents($note, this.events);
    };

    this.activate = function (idx) {
      idx = idx || 0;

      if (idx < 0) {
        idx = $popover.children().length - 1;
      }

      $popover.children().removeClass('active');
      var $activeItem = $popover.children().eq(idx);
      $activeItem.addClass('active');

      this.scrollTo($activeItem);
    };

    this.scrollTo = function ($node) {
      var $parent = $node.parent();
      $parent[0].scrollTop = $node[0].offsetTop - ($parent.innerHeight() / 2);
    };

    this.moveDown = function () {
      var index = $popover.find('.active').index();
      this.activate((index === -1) ? 0 : (index + 1) % $popover.children().length);
    };

    this.moveUp = function () {
      var index = $popover.find('.active').index();
      this.activate((index === -1) ? 0 : (index - 1) % $popover.children().length);
    };

    this.replace = function () {
      var wordRange = $popover.data('wordRange');
      var $activeItem = $popover.find('.active');
      var content = this.content($activeItem.data('item'));

      if (typeof content === 'string') {
        content = document.createTextNode(content);
      }

      $popover.removeData('wordRange');

      wordRange.insertNode(content);
      range.createFromNode(content).collapse().select();
    };

    this.searchKeyword = function (keyword, callback) {
      if (hint && hint.match.test(keyword)) {
        var matches = hint.match.exec(keyword);
        this.search(matches[1], callback);
      } else {
        callback();
      }
    };

    this.search = function (keyword, callback) {

      if (hint && hint.search) {
        hint.search(keyword, callback);
      } else {
        callback();
      }

    };


    this.update = function (e) {

      if (e.keyCode == KEY.ENTER) {
        if ($popover.css('display') !== 'none') {
          e.preventDefault();
          // replace
          this.replace();
          this.hide();
          summernote.invoke('editor.focus');
        } else {
          this.hide();
        }
        return;
      }

      if (e.keyCode == KEY.UP) {
        if ($popover.css('display') !== 'none') {
          e.preventDefault();
          // popover cursor up
          this.moveUp();
        } else {
          this.hide();
        }
        return;
      }

      if (e.keyCode == KEY.DOWN) {
        if ($popover.css('display') !== 'none') {
          e.preventDefault();
          // popover cursor down
          this.moveDown();
        } else {
          this.hide();
        }
        return;
      }

      if (hint && hint.match) {
        var range = summernote.invoke('editor.createRange');
        var word = range.getWordRange();
        var keyword = word.toString();

        if (!hint.match.test(keyword)) {
          this.hide();
          return;
        }

        var rects = word.getClientRects();
        var rect = rects[rects.length - 1];
        $popover.css({
          left: rect.left,
          top: rect.top + rect.height
        }).data('wordRange', word).find('.popover-content').html(keyword);
        $popover.show();

      } else {
        this.hide();
      }




    };

    this.hide = function () {
      $popover.hide();
    };
  };

  return HintPopover;
});
