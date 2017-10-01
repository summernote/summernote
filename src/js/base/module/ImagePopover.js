import $ from 'jquery';
import list from '../core/list';
import dom from '../core/dom';

/**
 * Image popover module
 *  mouse events that show/hide popover will be handled by Handle.js.
 *  Handle.js will receive the events and invoke 'imagePopover.update'.
 */
export default function (context) {
  var self = this;
  var ui = $.summernote.ui;

  var $editable = context.layoutInfo.editable;
  var editable = $editable[0];
  var options = context.options;

  this.events = {
    'summernote.disable': function () {
      self.hide();
    }
  };

  this.shouldInitialize = function () {
    return !list.isEmpty(options.popover.image);
  };

  this.initialize = function () {
    this.$popover = ui.popover({
      className: 'note-image-popover'
    }).render().appendTo(options.container);
    var $content = this.$popover.find('.popover-content,.note-popover-content');

    context.invoke('buttons.build', $content, options.popover.image);
  };

  this.destroy = function () {
    this.$popover.remove();
  };

  this.update = function (target) {
    if (dom.isImg(target)) {
      var pos = dom.posFromPlaceholder(target);
      var posEditor = dom.posFromPlaceholder(editable);

      this.$popover.css({
        display: 'block',
        left: pos.left,
        top: Math.min(pos.top, posEditor.top)
      });
    } else {
      this.hide();
    }
  };

  this.hide = function () {
    this.$popover.hide();
  };
}
