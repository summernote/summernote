define(function () {

  var modal = (function () {
    var Modal = function ($node, options) {
      var self = this;

      this.init = function (options) {
        this.options = $.extend({}, {
          target: 'body'
        }, options);

        this.$modal = $node;
        this.$backdrop = $('<div class="note-modal-backdrop" />');

      };

      this.show = function () {
        if (this.options.target === 'body') {
          this.$backdrop.css('position', 'fixed');
          this.$modal.css('position', 'fixed');
        } else {
          this.$backdrop.css('position', 'absolute');
          this.$modal.css('position', 'absolute');
        }

        this.$backdrop.appendTo(this.options.target).show();
        this.$modal.appendTo(this.options.target).addClass('open').show();

        this.$modal.trigger('note.modal.show');
        this.$modal.off('click', '.close').on('click', '.close', function () {
          self.hide();
        });
      };

      this.hide = function () {
        this.$modal.removeClass('open').hide();
        this.$backdrop.hide();
        this.$modal.trigger('note.modal.hide');
      };

      this.init(options);
    };

    return {
      create: function ($node, options) {
        return new Modal($node, options);
      }
    };
  })();

  return modal;

});
