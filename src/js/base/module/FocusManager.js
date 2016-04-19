define([
  'jquery',
  'summernote/base/core/func',
  'summernote/base/core/list',
  'summernote/base/core/dom',
  'summernote/base/core/range',
  'summernote/base/editing/Table'
], function ($, func, list, dom, range, Table) {
  var FocusManager = function (context) {
    var callback = {};
    var options = context.options;
    var self = this;
    var $caret;
    var ZERO_WIDTH_STRING = '\u200B';

    var editable = context.layoutInfo.editable[0];

    var table = new Table();

    this.events = {
      'summernote.keyup': function () {
        self.saveLastRange(context.invoke(editable), false);
      },
      'summernote.mouseup': function () {
        self.saveLastRange(range.create(editable), false);
      }
    };

    this.saveLastRange = function (range, isCaretView) {
      context.memo('focus.lastRange', range);
      this.renderCaret(isCaretView);
    };

    this.renderCaret = function (isCaretView) {
      var range = context.memo('focus.lastRange');

      if (!$caret) {
        $caret = $('<span class="note-caret"/>').css({
          display: 'inline-block',
          'background-color': 'black',
          animation: 'note-flash 2s infinite ease'
        }).hide().appendTo('body');
      }

      if (isCaretView === false) {
        $caret.hide();
      } else {
        var rect = range.getClientRects();
        if (rect[0]) {
          $caret.css({
            height: rect[0].height,
            width: 1
          }).show();

          $(range.ec).after($caret);
        }
      }

    };

    this.initialize = function () {
      this.saveLastRange(range.create(editable), false);
    };

    this.destroy = function () {
      context.removeMemo('focus.lastRange');
    };

    this.insertText = function (text) {
      if (!callback.insertText) {
        callback.insertText = context.invoke('editor.wrapCommand', function (text) {
          var rng = context.memo('focus.lastRange');
          var textNode = rng.insertNode(dom.createText(text));

          var newRange = range.create(textNode, dom.nodeLength(textNode)).select();

          self.saveLastRange(newRange);
        });
      }

      callback.insertText(text);
    };

    this.insertNode = function (node) {
      if (!callback.insertNode) {
        callback.insertNode = context.invoke('editor.wrapCommand', function (node) {
          var rng = context.memo('focus.lastRange');
          rng.insertNode(node);
          var newRange = range.createFromNodeAfter(node).normalize().select();

          self.saveLastRange(newRange);
        });
      }

      callback.insertNode(node);
    };

    this.insertTable = function (dim) {

      if (!callback.insertTable) {
        callback.insertTable = context.invoke('editor.wrapCommand', function (dim) {
          var rng = context.memo('focus.lastRange');
          var dimension = dim.split('x');

          var tableNode = table.createTable(dimension[0], dimension[1], options);
          rng.insertNode(tableNode);

          var newRange = range.createFromNode(tableNode).normalize().collapse(true).select();
          var pNode = dom.createText(ZERO_WIDTH_STRING);
          newRange.sc.innerHTML = '';
          newRange.sc.appendChild(pNode);

          newRange = range.createFromNodeAfter(pNode).collapse(false).select();

          self.saveLastRange(newRange);
        });
      }

      callback.insertTable(dim);

    };

    this.insertTab = function (tabsize) {

      if (!callback.insertTab) {
        callback.insertTab = context.invoke('editor.wrapCommand', function (tabsize) {
          var tab = dom.createText(new Array(tabsize + 1).join(dom.NBSP_CHAR));
          var rng = context.memo('focus.lastRange').deleteContents();
          rng.insertNode(tab, true);

          var newRange = range.create(tab, tabsize).select();
          self.saveLastRange(newRange);

        });
      }

      callback.insertTab(tabsize || 4);
    };

    this.pasteHTML = function (markup) {
      if (!callback.pasteHTML) {
        callback.pasteHTML = context.invoke('editor.wrapCommand', function (markup) {
          var contents = context.memo('focus.lastRange').pasteHTML(markup + ZERO_WIDTH_STRING);
          var newRange = range.createFromNodeAfter(list.last(contents)).select();

          self.saveLastRange(newRange);
        });
      }

      callback.pasteHTML(markup);
    };

    this.insertHorizontalRule = function () {

      if (!callback.insertHorizontalRule) {
        callback.insertHorizontalRule = context.invoke('editor.wrapCommand', function () {
          var hrNode = context.memo('focus.lastRange').insertNode(dom.create('HR'));
          if (hrNode.nextSibling) {
            var pNode = dom.createText(ZERO_WIDTH_STRING);

            $(hrNode).after(pNode);
            var newRange = range.createFromNodeAfter(pNode).collapse(false).select();

            self.saveLastRange(newRange);
          }
        });
      }

      callback.insertHorizontalRule();
    };
  };

  return FocusManager;
});
