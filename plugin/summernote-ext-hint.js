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

    musicians : [
      "Scott Joplin",
      "Charles Bolden",
      "Duke Ellington",
      "Louis Armstrong",
      "Earl Hines",
      "Fats Waller",
      "Count Basie",
      "Benny Goodman",
      "Sun Ra",
      "Thelonious Monk",
      "Dizzy Gillespie",
      "Charlie Parker",
      "Dave Brubeck",
      "Charles Mingus",
      "Oscar Peterson",
      "Miles Davis",
      "John Coltrane",
      "Chet Baker",
      "Ornette Coleman",
      "Wynton Marsalis",
      "Billie Holiday",
      "Ella Fitzgerald",
      "Sarah Vaughan"
    ],

    emoji : [
      '+1', 'smile', 'angry'
    ],

    getEmojiImage : function(keyword) {
      return "../plugin/emoji/" + keyword + ".png";
    },

    searchKeyword : function(keyword) {

      var triggerChar = keyword.charAt(0);

      if (keyword == '') {
        return { type : 'empty', list : []};
      } else if (triggerChar == ':') {
        var trigger = keyword.toLowerCase().replace(":", "");
        return {
          type : 'emoji',
          list : $.grep(this.emoji, function(item) {
            return item.indexOf(trigger) > -1 ;
          })
        }
      } else {
        var trigger = keyword.toLowerCase();
        return {
          type : 'keyword',
          list : $.grep(this.musicians, function(item) {
            return item.toLowerCase().indexOf(trigger) > -1 ;
          })
        };

      }
    },

    createTemplate : function(search) {
      var children  = [];
      var list = search.list;

      if (search.type == 'emoji') {
        for(var i = 0, len = list.length; i < len; i++) {
          var content = this.getEmojiImage(list[i]);
          var div = $("<div class='emoji' data-emoji='" + content + "' ><img src='" + content + "' class='emoji' contenteditable='false' /> :" + list[i] + ":</div>");
          children.push(div);
        }
      } else {
        for(var i = 0, len = list.length; i < len; i++) {
          var content = list[i];
          var div = $("<div >" + content + "</div>");
          children.push(div);
        }
      }

      children[0].addClass('active');

      return children;
    },

    scroll : function($element) {

      var $parent = $element.parent();
      var rect = $element[0].getBoundingClientRect() || {height : 20 } ;
      $parent[0].scrollTop = $element[0].offsetTop - $parent.innerHeight()/2;
    },

    bottom : function($popover) {
      var index = $popover.find(".active").index();
      this.active($popover, index == -1 ? 0 : (index+1) % $popover.children().length);
    },

    top : function($popover) {
      var index = $popover.find(".active").index();
      this.active($popover, index == -1 ? 0 : (index-1) % $popover.children().length);
    },

    active : function($popover, i) {
      i = i || 0;

      if (i < 0) {
        i == 0;
      }

      $popover.children().removeClass('active');
      var $element = $popover.children().eq(i);
      $element.addClass('active');

      this.scroll($element);

    },

    replace : function($popover) {
      var word = $popover.data('word');

      var $active = $popover.find(".active");
      var html = $active.html();

      var node = document.createTextNode(html);

      if ($active.hasClass('emoji')) {
        node = $(html)[0];
      }

      var contents = word.insertNode(node);
      range.createFromNode(list.last(contents) || contents).collapse().select();
    },

    init : function(layoutInfo) {
      var self = this;
      var $note = layoutInfo.holder();
      var $popover = $("<div />").addClass('hint');

      $(document).on('click', function() {
        $popover.hide();
      })

      $note.on('summernote.keydown', function(customEvent, nativeEvent) {
        if (nativeEvent.keyCode == 40) {
          if ($popover.css('display') == 'block') {
            nativeEvent.preventDefault();
            self.bottom($popover);
          }

        } else if (nativeEvent.keyCode == 38) {
          if ($popover.css('display') == 'block') {
            nativeEvent.preventDefault();
            self.top($popover);

          }
        } else if (nativeEvent.keyCode == 13) {
          if ($popover.css('display') == 'block') {
            nativeEvent.preventDefault();
            self.replace($popover);

            $popover.hide();
            $note.summernote('focus');

          }
        }
      });

      $note.on('summernote.keyup', function(customEvent, nativeEvent) {

        if (nativeEvent.keyCode == 40 || nativeEvent.keyCode == 38 || nativeEvent.keyCode == 13) {
          if (nativeEvent.keyCode == 13) {
            if ($popover.css('display') == 'block') {
              customEvent.preventDefault();
              nativeEvent.preventDefault();
              return false;
            }
          }
        } else {
          var range = $(this).summernote("createRange");

          var word = range.getWordRange();

          var searchList = self.searchKeyword(word.toString());

          if (searchList.list.length) {
            layoutInfo.popover().append($popover);

            // popover below placeholder.
            var rect = list.last(word.getClientRects());
            $popover.html(self.createTemplate(searchList)).css({
              left: rect.left,
              top: rect.top + rect.height
            }).data('word', word).show();

          } else {
            $popover.hide();
          }
        }



      })
    },
    events : {
      ENTER : function(event) {
        return false;
      }
    }
  });
}));
