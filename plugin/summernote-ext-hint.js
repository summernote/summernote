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
   * Hint Plugin
   */
  $.summernote.addPlugin({
    /** @property {String} name name of plugin */
    name: 'hint',

    scroll : function ($element) {

      var $parent = $element.parent();
      $parent[0].scrollTop = $element[0].offsetTop - ($parent.innerHeight() / 2);
    },

    bottom : function ($popover) {
      var index = $popover.find('.active').index();
      this.active($popover, (index === -1) ? 0 : (index + 1) % $popover.children().length);
    },

    top : function ($popover) {
      var index = $popover.find('.active').index();
      this.active($popover, (index === -1) ? 0 : (index - 1) % $popover.children().length);
    },

    active : function ($popover, i) {
      i = i || 0;

      if (i < 0) {
        i = 0;
      }

      $popover.children().removeClass('active');
      var $element = $popover.children().eq(i);
      $element.addClass('active');

      this.scroll($element);

    },


    replace : function ($popover) {
      var word = $popover.data('word');

      var $active = $popover.find('.active');
      var html = $active.html();

      var content = this.content($active.data('item'));

      if (typeof content === 'string') {
        content = document.createTextNode(content);
      }

      var contents = word.insertNode(content);
      range.createFromNode(list.last(contents) || contents).collapse().select();
    },

    /**
     * search keyword in list
     *
     * @async
     * @param keyword
     * @param callback
     * @returns {{type: string, list: Array}}
     */
    searchKeyword : function (keyword, callback) {

      if (this.match.test(keyword)) {

        var matches = this.match.exec(keyword);
        this.search(matches[1], callback);
      } else {
        callback();
      }
    },


    createTemplate : function (list) {
      var children  = [];
      list = list || [] ;

      for (var i = 0, len = list.length; i < len; i++) {

        var div = $('<a class="list-group-item" ></a>');
        div.append(this.template(list[i]));
        div.data('item', list[i]);
        children.push(div);
      }

      if (children[0]) {
        children[0].addClass('active');
      }

      return children;
    },


    /** Override **/
    match : /[a-z]+/g,

    search : function(keyword , callback) {
      callback();
    },

    /**
     * create list item template
     *
     * @override
     * @param {Object} search
     * @returns {Array}  created item list
     */
    template : function(item) {
      return item;
    },


    /**
     * create inserted content to add  in summernote
     *
     * @override
     * @param {String} html
     * @param {String} keyword
     * @return {HTMLEleemnt|String}
     */
    content : function (item) {
      return item;
    },

    /**
     * load search list
     *
     * @override
     */
    load : function () {

    },

    init : function (layoutInfo) {
      var self = this;

      var $note = layoutInfo.holder();
      var $popover = $('<div />').addClass('list-group').css({
        'position': 'absolute',
        'max-height': 300,
        'overflow-y' : 'auto',
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
              return false;
            }
          }
        } else {
          var range = $(this).summernote('createRange');

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
            var rect = list.last(word.getClientRects());
            $popover.html(self.createTemplate(searchList)).css({
              left: rect.left,
              top: rect.top + rect.height
            }).data('word', word).show();

          });
        }

      });

      this.load($popover);
    },
    events : {
      ENTER : function () {
        return false;
      }
    }
  });
}));
