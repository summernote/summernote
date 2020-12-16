import $ from 'jquery';
const EDITABLE_PADDING = 24;

export default class Statusbar {
  constructor(context) {
    this.$document = $(document);
    this.$statusbar = context.layoutInfo.statusbar;
    this.$editable = context.layoutInfo.editable;
    this.$codable = context.layoutInfo.codable;
    this.options = context.options;
  }

  initialize() {
    if (this.options.airMode || this.options.disableResizeEditor) {
      this.destroy();
      return;
    }

    this.$statusbar.on('mousedown', (event) => {
      event.preventDefault();
      event.stopPropagation();

      const editableTop = this.$editable.offset().top - this.$document.scrollTop();
      const editableCodeTop = this.$codable.offset().top - this.$document.scrollTop();

      const onMouseMove = (event) => {
        let height = event.clientY - (editableTop + EDITABLE_PADDING);
        let heightCode = event.clientY - (editableCodeTop + EDITABLE_PADDING);

        height = (this.options.minheight > 0) ? Math.max(height, this.options.minheight) : height;
        height = (this.options.maxHeight > 0) ? Math.min(height, this.options.maxHeight) : height;
        heightCode = (this.options.minheight > 0) ? Math.max(heightCode, this.options.minheight) : heightCode;
        heightCode = (this.options.maxHeight > 0) ? Math.min(heightCode, this.options.maxHeight) : heightCode;


        this.$editable.height(height);
        this.$codable.height(heightCode);
      };

      this.$document.on('mousemove', onMouseMove).one('mouseup', () => {
        this.$document.off('mousemove', onMouseMove);
      });
    });
  }

  destroy() {
    this.$statusbar.off();
    this.$statusbar.addClass('locked');
  }
}
