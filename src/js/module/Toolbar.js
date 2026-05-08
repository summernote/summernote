import $$ from '../core/dom-query.js';
export default class Toolbar {
  constructor(context) {
    this.context = context;

    this.$window = $$(window);
    this.$document = $$(document);

    this.ui = $$.summernote.ui;
    this.$note = context.layoutInfo.note;
    this.$editor = context.layoutInfo.editor;
    this.$toolbar = context.layoutInfo.toolbar;
    this.$editingArea = context.layoutInfo.editingArea;
    this.$editable = context.layoutInfo.editable;
    this.$statusbar = context.layoutInfo.statusbar;
    this.options = context.options;

    this.isFollowing = false;
    this.followScroll = this.followScroll.bind(this);
    this.handleToolbarMouseDown = this.handleToolbarMouseDown.bind(this);
    this.handleToolbarClick = this.handleToolbarClick.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.handleDocumentKeydown = this.handleDocumentKeydown.bind(this);
    this.handleEditorInteraction = this.handleEditorInteraction.bind(this);
  }

  shouldInitialize() {
    return !this.options.airMode;
  }

  initialize() {
    this.options.toolbar = this.options.toolbar || [];

    if (!this.options.toolbar.length) {
      this.$toolbar.hide();
    } else {
      this.context.invoke('buttons.build', this.$toolbar, this.options.toolbar, {
        classPrefix: 'toolbar',
      });
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

    this.$toolbar.on('mousedown', this.handleToolbarMouseDown);
    this.$toolbar.on('click', this.handleToolbarClick);
    this.$editingArea.on('mousedown click', this.handleEditorInteraction);
    this.$statusbar.on('mousedown click', this.handleEditorInteraction);
    this.$document.on('click', this.handleDocumentClick);
    this.$document.on('keydown', this.handleDocumentKeydown);
  }

  destroy() {
    this.$toolbar.children().remove();

    if (this.options.followingToolbar) {
      this.$window.off('scroll resize', this.followScroll);
    }

    this.$toolbar.off('mousedown', this.handleToolbarMouseDown);
    this.$toolbar.off('click', this.handleToolbarClick);
    this.$editingArea.off('mousedown click', this.handleEditorInteraction);
    this.$statusbar.off('mousedown click', this.handleEditorInteraction);
    this.$document.off('click', this.handleDocumentClick);
    this.$document.off('keydown', this.handleDocumentKeydown);
  }

  getDropdownGroup(target) {
    if (!(target instanceof Element)) {
      return null;
    }

    const group = target.closest('.note-btn-group');
    if (!group) {
      return null;
    }

    const toggle = group.querySelector('[data-note-toggle="dropdown"]');
    const menu = group.querySelector('.note-dropdown-menu');

    return toggle && menu ? group : null;
  }

  getDropdownParts(group) {
    if (!group) {
      return {};
    }

    return {
      toggle: group.querySelector('[data-note-toggle="dropdown"]'),
      menu: group.querySelector('.note-dropdown-menu'),
    };
  }

  isDropdownOpen(group) {
    const { toggle, menu } = this.getDropdownParts(group);
    return Boolean(toggle && menu && toggle.classList.contains('show') && menu.classList.contains('show'));
  }

  openDropdown(group) {
    const { toggle, menu } = this.getDropdownParts(group);
    if (!toggle || !menu) {
      return;
    }

    toggle.classList.add('show');
    toggle.setAttribute('aria-expanded', 'true');
    menu.setAttribute('data-bs-popper', 'static');
    menu.classList.add('show');
  }

  closeDropdown(group) {
    const { toggle, menu } = this.getDropdownParts(group);
    if (!toggle || !menu) {
      return;
    }

    toggle.classList.remove('show');
    toggle.setAttribute('aria-expanded', 'false');
    menu.removeAttribute('data-bs-popper');
    menu.classList.remove('show');
  }

  closeDropdowns(exceptGroup) {
    this.$toolbar.find('.note-btn-group').each((_, group) => {
      if (group !== exceptGroup) {
        this.closeDropdown(group);
      }
    });
  }

  handleToolbarMouseDown(event) {
    if (!(event.target instanceof Element)) {
      return;
    }

    if (event.target.closest('input, textarea, select, option, label')) {
      return;
    }

    if (event.target.closest('.note-btn, .dropdown-item, .note-dropdown-menu')) {
      event.preventDefault();
    }
  }

  handleToolbarClick(event) {
    if (!(event.target instanceof Element)) {
      return;
    }

    const toggle = event.target.closest('[data-note-toggle="dropdown"]');
    if (toggle && this.$toolbar[0].contains(toggle)) {
      event.preventDefault();

      const group = this.getDropdownGroup(toggle);
      const shouldOpen = group && !this.isDropdownOpen(group);

      this.closeDropdowns(group);

      if (shouldOpen) {
        this.openDropdown(group);
      }
      return;
    }

    if (event.target.closest('.note-dropdown-menu') || event.target.closest('button')) {
      this.closeDropdowns();
    }
  }

  handleDocumentClick(event) {
    if (!(event.target instanceof Element)) {
      this.closeDropdowns();
      return;
    }

    if (this.$toolbar[0].contains(event.target)) {
      return;
    }

    this.closeDropdowns();
  }

  handleDocumentKeydown(event) {
    if (event.key === 'Escape') {
      this.closeDropdowns();
    }
  }

  handleEditorInteraction() {
    this.closeDropdowns();
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
      otherBarHeight = $$(this.options.otherStaticBar).outerHeight();
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
      $btn = $btn.not('.note-codeview-keep');
    }
    this.ui.toggleBtn($btn, true);
  }

  deactivate(isIncludeCodeview) {
    let $btn = this.$toolbar.find('button');
    if (!isIncludeCodeview) {
      $btn = $btn.not('.note-codeview-keep');
    }
    this.ui.toggleBtn($btn, false);
  }
}
