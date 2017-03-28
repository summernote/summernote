define(function () {

  var popover = (function () {
    var Popover = function ($node, options) {
      var self = this;

      this.init = function (options) {

        this.options = $.extend({}, {
          title: '',
          content: '',
          target: 'body',
          trigger: 'hover focus',
          placement: 'bottom'
        }, options);

        // create popover node
        this.$popover = $([
          '<div class="note-popover in">',
          ' <div class="note-popover-arrow" />',
          ' <div class="note-popover-content" />',
          '</div>'
        ].join(''));

        // define event
        if (this.options.trigger !== 'manual') {
          this.options.trigger.split(' ').forEach(function (eventName) {
            if (eventName === 'hover') {
              $node.off('mouseenter').on('mouseenter', function () {
                self.show($node);
              });

              $node.off('mouseleave').on('mouseleave', function () {
                self.hide($node);
              });
            } else if (eventName === 'click')  {
              $node.on('click', function () {
                self.toggle($node);
              });
            } else if (eventName === 'focus') {
              $node.on('focus', function () {
                self.show($node);
              });
              $node.on('blur', function () {
                self.hide($node);
              });
            }
          });
        }
      };

      this.show = function () {

        var offset = $node.offset();
        var $popover = this.$popover;
        var content = this.options.content || $node.data('content');
        var placement = $node.data('placement') || this.options.placement;
        var dist = 6;

        $popover.addClass(placement);
        $popover.addClass('in');
        $popover.find('.note-popover-content').html(content);
        $popover.appendTo(this.options.target);

        var nodeWidth = $node.outerWidth();
        var nodeHeight = $node.outerHeight();
        var popoverWidth = $popover.outerWidth();
        var popoverHeight = $popover.outerHeight();

        if (placement === 'bottom') {
          $popover.css({
            top: offset.top + nodeHeight + dist,
            left: offset.left + (nodeWidth / 2 - popoverWidth / 2)
          });
        } else if (placement === 'top') {
          $popover.css({
            top: offset.top - popoverHeight - dist,
            left: offset.left + (nodeWidth / 2 - popoverWidth / 2)
          });
        } else if (placement === 'left') {
          $popover.css({
            top: offset.top + (nodeHeight / 2 - popoverHeight / 2),
            left: offset.left - popoverWidth - dist
          });
        } else if (placement === 'right') {
          $popover.css({
            top: offset.top + (nodeHeight / 2 - popoverHeight / 2),
            left: offset.left + nodeWidth + dist
          });
        }
      };

      this.hide = function () {
        this.$popover.removeClass('in');
        this.$popover.remove();
      };

      this.toggle = function () {
        if (this.$popover.hasClass('in')) {
          this.hide();
        } else {
          this.show();
        }
      };

      this.init(options);
    };

    return {
      create: function ($node, options) {
        return new Popover($node, options);
      }
    };
  })();

  return popover;
});
