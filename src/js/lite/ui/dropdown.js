var dropdown = (function() {
  var Dropdown = function($node, options) {
    var self = this;

    this.init = function(options) {
      this.options = $.extend({}, {
        target: options.container
      }, options);

      this.$button = $node;
      this.setEvent();
    };

    this.setEvent = function() {
      this.$button.on('click', function() {
        self.toggle();
      });
    };

    this.clear = function() {
      var $parent = $('.note-btn-group.open');
      $parent.find('.note-btn.active').removeClass('active');
      $parent.removeClass('open');
    };

    this.show = function() {
      this.$button.addClass('active');
      this.$button.parent().addClass('open');

      var $dropdown = this.$button.next();
      var offset = $dropdown.offset();
      var width = $dropdown.outerWidth();
      var windowWidth = $(window).width();
      var targetMarginRight = parseFloat($(this.options.target).css('margin-right'));

      if (offset.left + width > windowWidth - targetMarginRight) {
        $dropdown.css('margin-left', windowWidth - targetMarginRight - (offset.left + width));
      } else {
        $dropdown.css('margin-left', '');
      }
    };

    this.hide = function() {
      this.$button.removeClass('active');
      this.$button.parent().removeClass('open');
    };

    this.toggle = function() {
      var isOpened = this.$button.parent().hasClass('open');

      this.clear();

      if (isOpened) {
        this.hide();
      } else {
        this.show();
      }
    };

    this.init(options);
  };

  return {
    create: function($node, options) {
      return new Dropdown($node, options);
    }
  };
})();

$(document).on('click', function(e) {
  if (!$(e.target).closest('.note-btn-group').length) {
    $('.note-btn-group.open').removeClass('open');
  }
});

$(document).on('click.note-dropdown-menu', function(e) {
  $(e.target).closest('.note-dropdown-menu').parent().removeClass('open');
});

export default dropdown;
