(function (factory) {
  /* global define */
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else {
    // Browser globals: jQuery
    factory(window.jQuery);
  }
}(function ($) {
  // import core class
  var range = $.summernote.core.range;
  var list = $.summernote.core.list;

  /**
   * @class plugin.hint
   * 
   * Hello Plugin  
   */
  $.summernote.addPlugin({
    /** @property {String} name name of plugin */
    name: 'hint',

    scrollTo: function ($node) {
      var $parent = $node.parent();
      $parent[0].scrollTop = $node[0].offsetTop - ($parent.innerHeight() / 2);
    },

    bottom: function ($popover) {
      var index = $popover.find('.active').index();
      this.activate($popover, (index === -1) ? 0 : (index + 1) % $popover.children().length);
    },

    top: function ($popover) {
      var index = $popover.find('.active').index();
      this.activate($popover, (index === -1) ? 0 : (index - 1) % $popover.children().length);
    },

    activate: function ($popover, i) {
      i = i || 0;

      if (i < 0) {
        i = 0;
      }

      $popover.children().removeClass('active');
      var $activeItem = $popover.children().eq(i);
      $activeItem.addClass('active');

      this.scrollTo($activeItem);
    },

    replace: function ($popover) {
      var wordRange = $popover.data('wordRange');
      var $activeItem = $popover.find('.active');
      var content = this.content($activeItem.html(), $activeItem.data('keyword'));

      if (typeof content === 'string') {
        content = document.createTextNode(content);
      }

      wordRange.insertNode(content);
      range.createFromNode(content).collapse().select();
    },

    loadEmoji: function (data) {
      this.emoji = Object.keys(data);
      this.emojiLink = data;
    },

    /** Override **/

    /**
     * search keyword in list
     *
     * @async
     * @param {String} keyword
     * @param {Function} callback
     * @returns {type: String, list: Array}
     */
    searchKeyword: function (keyword, callback) {
      var triggerChar = keyword.charAt(0);

      if (triggerChar === ':' && keyword.length > 1) {
        var trigger = keyword.toLowerCase().replace(':', '');
        callback({
          type: 'emoji',
          list: $.grep(this.emoji, function (item) {
            return item.indexOf(trigger) === 0;
          })
        });
      } else {
        callback();
      }
    },

    /**
     *
     */
    createItems: function (search) {
      var items = [];
      var list = search.list;

      for (var i = 0, len = list.length; i < len; i++) {
        var $item = $('<a class="list-group-item"></a>');
        $item.append(this.createItem(list[i]));
        $item.data('keyword', list[i]);
        items.push($item);
      }

      if (items.length) {
        items[0].addClass('active');
      }

      return items;
    },

    /**
     * create list item template
     *
     * @param {Object} item
     * @returns {String}
     */
    createItem: function (item) {
      var content = this.emojiLink[item];
      return '<img src="' + content + '" contenteditable="false" width="20" /> :' + item + ':';
    },

    /**
     * create inserted content to add  in summernote
     *
     * @override
     * @param {String} html
     * @param {String} keyword
     * @return {Node|String}
     */
    content: function (html, item) {
      var url = this.emojiLink[item];

      if (url) {
        var $img = $('<img />').attr('src', url).css({
          width : 20
        });
        return $img[0];
      }

      return html;
    },

    /**
     * load search list
     *
     * @override
     */
    load: function () {
      var self = this;
      $.getJSON('https://api.github.com/emojis', function (data) {
        self.loadEmoji(data);
      });
    },

    init: function (layoutInfo) {
      var self = this;

      var $note = layoutInfo.holder();
      var $popover = $('<div class="list-group" />').css({
        position: 'absolute',
        'max-height': 300,
        'overflow-y' : 'scroll',
        'display' : 'none'
      });

      $popover.on('click', '.list-group-item', function () {
        self.replace($popover);

        $popover.hide();
        $note.summernote('focus');
      });

      $(document).on('click', function () {
        $popover.hide();
      });

      $note.on('summernote.keydown', function (customEvent, nativeEvent) {
        if (nativeEvent.keyCode === 40) {
          if ($popover.css('display') === 'block') {
            nativeEvent.preventDefault();
            self.bottom($popover);
          }

        } else if (nativeEvent.keyCode === 38) {
          if ($popover.css('display') === 'block') {
            nativeEvent.preventDefault();
            self.top($popover);

          }
        } else if (nativeEvent.keyCode === 13) {
          if ($popover.css('display') === 'block') {
            nativeEvent.preventDefault();
            self.replace($popover);

            $popover.hide();
            $note.summernote('focus');

          }
        }
      });

      $note.on('summernote.keyup', function (customEvent, nativeEvent) {
        if (nativeEvent.keyCode === 40 || nativeEvent.keyCode === 38 || nativeEvent.keyCode === 13) {
          if (nativeEvent.keyCode === 13) {
            if ($popover.css('display') === 'block') {
              customEvent.preventDefault();
              nativeEvent.preventDefault();
              return false;
            }
          }
        } else {
          var range = $(this).summernote('createRange');
          var wordRange = range.getWordRange();

          self.searchKeyword(wordRange.toString(), function (searchList) {
            if (!searchList || !searchList.list.length) {
              $popover.hide();
              return;
            }

            layoutInfo.popover().append($popover);

            var rect = list.last(wordRange.getClientRects());
            $popover.html(self.createItems(searchList)).css({
              left: rect.left,
              top: rect.top + rect.height
            }).data('wordRange', wordRange).show();

          });
        }
      });

      this.load($popover);
    },
    events: {
      ENTER: function () {
        return false;
      }
    }
  });
}));
