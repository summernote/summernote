import $ from 'jquery';
export default class Toolbar {
  constructor(context) {
    this.context = context;

    this.$window = $(window);
    this.$document = $(document);

    this.ui = $.summernote.ui;
    this.$note = context.layoutInfo.note;
    this.$editor = context.layoutInfo.editor;
    this.$toolbar = context.layoutInfo.toolbar;
    this.$editable = context.layoutInfo.editable;
    this.$statusbar = context.layoutInfo.statusbar;
    this.options = context.options;

    this.isFollowing = false;
    this.followScroll = this.followScroll.bind(this);
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
    if (this.options.followingToolbar) {
      this.$window.on('scroll resize', this.followScroll);
    }
  }

  destroy() {
    this.$toolbar.children().remove();

    if (this.options.followingToolbar) {
      this.$window.off('scroll resize', this.followScroll);
    }
  }

  followScroll() {
    if (this.$editor.hasClass('fullscreen')) {
      return false;
    }

    const editorHeight = this.$editor.outerHeight();
    const editorWidth = this.$editor.width();
    const toolbarHeight = this.$toolbar.height();
    const statusbarHeight = this.$statusbar.height();

    // check if the web app is currently using another static bar
    let otherBarHeight = 0;
    if (this.options.otherStaticBar) {
      otherBarHeight = $(this.options.otherStaticBar).outerHeight();
    }

    const currentOffset = this.$document.scrollTop();
    const editorOffsetTop = this.$editor.offset().top;
    const editorOffsetBottom = editorOffsetTop + editorHeight;
    const activateOffset = editorOffsetTop - otherBarHeight;
    const deactivateOffsetBottom = editorOffsetBottom - otherBarHeight - toolbarHeight - statusbarHeight;

    if (!this.isFollowing &&
      (currentOffset > activateOffset) && (currentOffset < deactivateOffsetBottom - toolbarHeight)) {
      this.isFollowing = true;
      this.$editable.css({
        marginTop: this.$toolbar.outerHeight(),
      });
      this.$toolbar.css({
        position: 'fixed',
        top: otherBarHeight,
        width: editorWidth,
        zIndex: 1000,
      });
    } else if (this.isFollowing &&
      ((currentOffset < activateOffset) || (currentOffset > deactivateOffsetBottom))) {
      this.isFollowing = false;
      this.$toolbar.css({
        position: 'relative',
        top: 0,
        width: '100%',
        zIndex: 'auto',
      });
      this.$editable.css({
        marginTop: '',
      });
    }
  }

  changeContainer(isFullscreen) {
    if (isFullscreen) {
      this.$toolbar.prependTo(this.$editor);
    } else {
      if (this.options.toolbarContainer) {
        this.$toolbar.appendTo(this.options.toolbarContainer);
      }
    }
    if (this.options.followingToolbar) {
      this.followScroll();
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
    let $btn = this.$toolbar.find('button');
    if (!isIncludeCodeview) {
      $btn = $btn.not('.btn-codeview').not('.btn-fullscreen');
    }
    this.ui.toggleBtn($btn, true);
  }

  deactivate(isIncludeCodeview) {
    let $btn = this.$toolbar.find('button');
    if (!isIncludeCodeview) {
      $btn = $btn.not('.btn-codeview').not('.btn-fullscreen');
    }
    this.ui.toggleBtn($btn, false);
  }
}
