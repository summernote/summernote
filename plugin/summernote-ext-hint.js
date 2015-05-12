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

      var content = this.content(html, $active.data('keyword'));

      if (typeof content === 'string') {
        content = document.createTextNode(content);
      }

      var contents = word.insertNode(content);
      range.createFromNode(list.last(contents) || contents).collapse().select();
    },

    loadEmoji : function (data) {
      this.emoji = Object.keys(data);
      this.emojiLink = data;
    },


    /** Override **/

    /**
     * search keyword in list
     *
     * @override
     * @async
     * @param keyword
     * @param callback
     * @returns {{type: string, list: Array}}
     */
    searchKeyword : function (keyword, callback) {

      var triggerChar = keyword.charAt(0);

      if (triggerChar === ':' && keyword.length > 1) {
        var trigger = keyword.toLowerCase().replace(':', '');
        callback({
          type : 'emoji',
          list : $.grep(this.emoji, function (item) {
            return (item.indexOf(trigger)  === 0);
          })
        });
      } else {
        callback();
      }
    },

    createTemplate : function (search) {
      var children  = [];
      var list = search.list;

      for (var i = 0, len = list.length; i < len; i++) {

        var div = $('<a class="list-group-item" ></a>');
        div.append(this.createItem(list[i]));
        div.data('keyword', list[i]);
        children.push(div);
      }

      children[0] && children[0].addClass('active');

      return children;
    },

    /**
     * create list item template
     *
     * @override
     * @param {Object} search
     * @returns {Array}  created item list
     */
    createItem : function(item) {
      var content = this.emojiLink[item];
      return '<img src="' + content + '" contenteditable="false" width="20" /> :' + item + ':';
    },


    /**
     * create inserted content to add  in summernote
     *
     * @override
     * @param {String} html
     * @param {String} keyword
     * @return {HTMLEleemnt|String}
     */
    content : function (html, item) {

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
    load : function () {
      var self = this;
      $.getJSON('https://api.github.com/emojis', function (data) {
        self.loadEmoji(data);
      });
    },

    init : function (layoutInfo) {
      var self = this;

      var $note = layoutInfo.holder();
      var $popover = $('<div />').addClass('list-group').css({
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

          var word = range.getWordRange();

          self.searchKeyword(word.toString(), function (searchList) {

            if (!searchList) {
              $popover.hide();
              return;
            }

            if (searchList && !searchList.list.length) {
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
