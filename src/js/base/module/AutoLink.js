import $ from 'jquery';
import list from '../core/list';
import key from '../core/key';

export default function (context) {
  var self = this;
  var defaultScheme = 'http://';
  var linkPattern = /^([A-Za-z][A-Za-z0-9+-.]*\:[\/\/]?|mailto:[A-Z0-9._%+-]+@)?(www\.)?(.+)$/i;

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
    var match = keyword.match(linkPattern);

    if (match && (match[1] || match[2])) {
      var link = match[1] ? keyword : defaultScheme + keyword;
      var node = $('<a />').html(keyword).attr('href', link)[0];

      this.lastWordRange.insertNode(node);
      this.lastWordRange = null;
      context.invoke('editor.focus');
    }

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
}
