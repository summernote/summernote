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

  var KEY = {
    UP: 38,
    DOWN: 40,
    ENTER: 13
  };

  var DROPDOWN_KEYCODES = [KEY.UP, KEY.DOWN, KEY.ENTER];

  /**
   * @class plugin.hint
   *
   * Hint Plugin
   */
  $.summernote.addPlugin({
    /**
     * name name of plugin
     * @property {String}
     **/
    name: 'hint',

    /**
     * @property {Regex}
     * @interface
     */
    match: /[a-z]+/g,

    /**
     * create list item template
     *
     * @interface
     * @param {Object} search
     * @returns {Array}  created item list
     */
    template: null,

    /**
     * create inserted content to add  in summernote
     *
     * @interface
     * @param {String} html
     * @param {String} keyword
     * @return {HTMLEleemnt|String}
     */
    content: null,

    /**
     * load search list
     *
     * @interface
     */
    load: null,

    /**
     * @param {jQuery} $node
     */
    scrollTo: function ($node) {
      var $parent = $node.parent();
      $parent[0].scrollTop = $node[0].offsetTop - ($parent.innerHeight() / 2);
    },

    /**
     * @param {jQuery} $popover
     */
    moveDown: function ($popover) {
      var index = $popover.find('.active').index();
      this.activate($popover, (index === -1) ? 0 : (index + 1) % $popover.children().length);
    },

    /**
     * @param {jQuery} $popover
     */
    moveUp: function ($popover) {
      var index = $popover.find('.active').index();
      this.activate($popover, (index === -1) ? 0 : (index - 1) % $popover.children().length);
    },

    /**
     * @param {jQuery} $popover
     * @param {Number} i
     */
    activate: function ($popover, idx) {
      idx = idx || 0;

      if (idx < 0) {
        idx = $popover.children().length - 1;
      }

      $popover.children().removeClass('active');
      var $activeItem = $popover.children().eq(idx);
      $activeItem.addClass('active');

      this.scrollTo($activeItem);
    },

    /**
     * @param {jQuery} $popover
     */
    replace: function ($popover) {
      var wordRange = $popover.data('wordRange');
      var $activeItem = $popover.find('.active');
      var content = this.content($activeItem.data('item'));

      if (typeof content === 'string') {
        content = document.createTextNode(content);
      }

      $popover.removeData('wordRange');

      wordRange.insertNode(content);
      range.createFromNode(content).collapse().select();
    },

    /**
     * @param {String} keyword
     * @return {Object|null}
     */
    searchKeyword: function (keyword, callback) {
      if (this.match.test(keyword)) {
        var matches = this.match.exec(keyword);
        this.search(matches[1], callback);
      } else {
        callback();
      }
    },


    createTemplate: function (list) {
      var items  = [];
      list = list || [];

      for (var i = 0, len = list.length; i < len; i++) {
        var $item = $('<a class="list-group-item"></a>');
        $item.append(this.template(list[i]));
        $item.data('item', list[i]);
        items.push($item);
      }

      if (items.length) {
        items[0].addClass('active');
      }

      return items;
    },

    search: function (keyword, callback) {
      keyword = keyword || '';
      callback();
    },

    init : function (layoutInfo) {
      var self = this;

      var $note = layoutInfo.holder();
      var $popover = $('<div />').addClass('hint-group').css({
        'position': 'absolute',
        'max-height': 150,
        'z-index' : 999,
        'overflow' : 'hidden',
        'display' : 'none',
        'border' : '1px solid gray',
        'border-radius' : '5px'
      });

      $popover.on('click', '.list-group-item', function HintItemClick() {
        self.replace($popover);

        $popover.hide();
        $note.summernote('focus');
      });

      $(document).on('click', function HintClick() {
        $popover.hide();
      });

      $note.on('summernote.keydown', function HintKeyDown(customEvent, nativeEvent) {
        if ($popover.css('display') !== 'block') {
          return true;
        }

        if (nativeEvent.keyCode === KEY.DOWN) {
          nativeEvent.preventDefault();
          self.moveDown($popover);
        } else if (nativeEvent.keyCode === KEY.UP) {
          nativeEvent.preventDefault();
          self.moveUp($popover);
        } else if (nativeEvent.keyCode === KEY.ENTER) {
          nativeEvent.preventDefault();
          self.replace($popover);

          $popover.hide();
          $note.summernote('focus');
        }
      });

      var timer = null;
      $note.on('summernote.keyup', function HintKeyUp(customEvent, nativeEvent) {
        if (DROPDOWN_KEYCODES.indexOf(nativeEvent.keyCode) > -1) {
          if (nativeEvent.keyCode === KEY.ENTER) {
            if ($popover.css('display') === 'block') {
              return false;
            }
          }

        } else {

          clearTimeout(timer);
          timer = setTimeout(function () {
            var range = $note.summernote('createRange');
            var word = range.getWordRange();

            self.searchKeyword(word.toString(), function (searchList) {
              if (!searchList) {
                $popover.hide();
                return;
              }

              if (searchList && !searchList.length) {
                $popover.hide();
                return;
              }

              layoutInfo.popover().append($popover);

              // popover below placeholder.
              var rects = word.getClientRects();
              var rect = rects[rects.length - 1];
              $popover.html(self.createTemplate(searchList)).css({
                left: rect.left,
                top: rect.top + rect.height
              }).data('wordRange', word).show();
            });
          }, self.throttle);

        }
      });

      this.load($popover);
    },

    throttle : 50,

    // FIXME Summernote doesn't support event pipeline yet.
    //  - Plugin -> Base Code
    events: {
      ENTER: function (e, editor, layoutInfo) {

        if (layoutInfo.popover().find('.hint-group').css('display') !== 'block') {
          // apply default enter key
          layoutInfo.holder().summernote('insertParagraph');
        }

        // prevent ENTER key
        return true;
      }
    }
  });
}));
