import $ from 'jquery';

class ModalUI {
  constructor($node, options) {
    this.$modal = $node;
    this.$backdrop = $('<div class="note-modal-backdrop"/>');
  }

  show() {
    this.$backdrop.appendTo(document.body).show();
    this.$modal.addClass('open').show();
    this.$modal.trigger('note.modal.show');
    this.$modal.off('click', '.close').on('click', '.close', this.hide.bind(this));
    this.$modal.on('keydown', (event) => {
      if (event.which === 27) {
        event.preventDefault();
        this.hide();
      }
    });
  }

  hide() {
    this.$modal.removeClass('open').hide();
    this.$backdrop.hide();
    this.$modal.trigger('note.modal.hide');
    this.$modal.off('keydown');
  }
}

export default ModalUI;
