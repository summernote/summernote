define([
  'summernote/base/core/func',
  'summernote/base/core/list',
  'summernote/base/core/dom',
  'summernote/base/core/range',
  'summernote/base/core/key'
], function (func, list, dom, range, key) {
  var AutoLink = function (context) {
    var self = this;

    var linkPattern = /^(https?:\/\/|ssh:\/\/|ftp:\/\/|file:\/|www\.|(?:mailto:)?[A-Z0-9._%+-]+@)(.+)$/i;

    this.events = {
      'summernote.keyup': function (we, e) {
        if (!e.isDefaultPrevented()) {
          self.handleKeyup(e);
        }
      },
      'summernote.keydown': function (we, e) {
        self.handleKeydown(e);
      }
    };

    this.initialize = function () {
      this.lastWordRange = null;
    };

    this.destroy = function () {
      this.lastWordRange = null;
    };

    this.replace = function () {
      if (!this.lastWordRange) {
        return;
      }

      var keyword = this.lastWordRange.toString();

      if (linkPattern.test(keyword)) {
        var node = this.nodeFromKeyword(keyword);

        this.lastWordRange.insertNode(node);
        this.lastWordRange = null;
        context.invoke('editor.focus');
      }

    };

    this.nodeFromKeyword = function (keyword) {
      return $('<a />').html(keyword).attr('href', keyword)[0];
    };

    this.handleKeydown = function (e) {
      if (list.contains([key.code.ENTER, key.code.SPACE], e.keyCode)) {
        var wordRange = context.invoke('editor.createRange').getWordRange();
        this.lastWordRange = wordRange;
      }
    };

    this.handleKeyup = function (e) {
      if (list.contains([key.code.ENTER, key.code.SPACE], e.keyCode)) {
        this.replace();
      }
    };
  };

  return AutoLink;
});
