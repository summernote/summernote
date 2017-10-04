import $ from 'jquery';
export default class Toolbar {
  constructor(context) {
    this.context = context;

    this.ui = $.summernote.ui;
    this.$note = context.layoutInfo.note;
    this.$editor = context.layoutInfo.editor;
    this.$toolbar = context.layoutInfo.toolbar;
    this.options = context.options;
  }

  shouldInitialize() {
    return !this.options.airMode;
  }

  initialize() {
    this.options.toolbar = this.options.toolbar || [];

    if (!this.options.toolbar.length) {
      this.$toolbar.hide();
    } else {
      this.context.invoke('buttons.build', this.$toolbar, this.options.toolbar);
    }

    if (this.options.toolbarContainer) {
      this.$toolbar.appendTo(this.options.toolbarContainer);
    }

    this.changeContainer(false);

    this.$note.on('summernote.keyup summernote.mouseup summernote.change', () => {
      this.context.invoke('buttons.updateCurrentStyle');
    });

    this.context.invoke('buttons.updateCurrentStyle');
  }

  destroy() {
    this.$toolbar.children().remove();
  }

  changeContainer(isFullscreen) {
    if (isFullscreen) {
      this.$toolbar.prependTo(this.$editor);
    } else {
      if (this.options.toolbarContainer) {
        this.$toolbar.appendTo(this.options.toolbarContainer);
      }
    }
  }

  updateFullscreen(isFullscreen) {
    this.ui.toggleBtnActive(this.$toolbar.find('.btn-fullscreen'), isFullscreen);

    this.changeContainer(isFullscreen);
  }

  updateCodeview(isCodeview) {
    this.ui.toggleBtnActive(this.$toolbar.find('.btn-codeview'), isCodeview);
    if (isCodeview) {
      this.deactivate();
    } else {
      this.activate();
    }
  }

  activate(isIncludeCodeview) {
    var $btn = this.$toolbar.find('button');
    if (!isIncludeCodeview) {
      $btn = $btn.not('.btn-codeview');
    }
    this.ui.toggleBtn($btn, true);
  }

  deactivate(isIncludeCodeview) {
    var $btn = this.$toolbar.find('button');
    if (!isIncludeCodeview) {
      $btn = $btn.not('.btn-codeview');
    }
    this.ui.toggleBtn($btn, false);
  }
}
