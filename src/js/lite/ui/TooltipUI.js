class TooltipUI {
  constructor ($node, options) {
    const self = this; 
    this.$node = $node; 
    this.options = $.extend({}, {
      title: '',
      target: options.container,
      trigger: 'hover focus',
      placement: 'bottom'
    }, options);

    // create tooltip node
    this.$tooltip = $([
      '<div class="note-tooltip in">',
      '  <div class="note-tooltip-arrow"/>',
      '  <div class="note-tooltip-content"/>',
      '</div>'
    ].join(''));

    // define event
    if (this.options.trigger !== 'manual') {
      this.options.trigger.split(' ').forEach(function(eventName) {
        if (eventName === 'hover') {
          $node.off('mouseenter mouseleave');

          $node.on('mouseenter', function() {
            self.show($node);
          }).on('mouseleave', function() {
            self.hide($node);
          });
        } else if (eventName === 'click') {
          $node.on('click', function() {
            self.toggle($node);
          });
        } else if (eventName === 'focus') {
          $node.on('focus', function() {
            self.show($node);
          }).on('blur', function() {
            self.hide($node);
          });
        }
      });
    }
  }

  show () {
    const $node = this.$node; 
    const offset = $node.offset();

    const $tooltip = this.$tooltip;
    const title = this.options.title || $node.attr('title') || $node.data('title');
    const placement = this.options.placement || $node.data('placement');

    $tooltip.addClass(placement);
    $tooltip.addClass('in');
    $tooltip.find('.note-tooltip-content').text(title);
    $tooltip.appendTo(this.options.target);

    const nodeWidth = $node.outerWidth();
    const nodeHeight = $node.outerHeight();
    const tooltipWidth = $tooltip.outerWidth();
    const tooltipHeight = $tooltip.outerHeight();

    if (placement === 'bottom') {
      $tooltip.css({
        top: offset.top + nodeHeight,
        left: offset.left + (nodeWidth / 2 - tooltipWidth / 2)
      });
    } else if (placement === 'top') {
      $tooltip.css({
        top: offset.top - tooltipHeight,
        left: offset.left + (nodeWidth / 2 - tooltipWidth / 2)
      });
    } else if (placement === 'left') {
      $tooltip.css({
        top: offset.top + (nodeHeight / 2 - tooltipHeight / 2),
        left: offset.left - tooltipWidth
      });
    } else if (placement === 'right') {
      $tooltip.css({
        top: offset.top + (nodeHeight / 2 - tooltipHeight / 2),
        left: offset.left + nodeWidth
      });
    }
  }

  hide () {
    this.$tooltip.removeClass('in');
    this.$tooltip.remove();
  }

  toggle () {
    if (this.$tooltip.hasClass('in')) {
      this.hide();
    } else {
      this.show();
    }
  }
}

export default TooltipUI;
