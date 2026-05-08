import $$ from '../core/dom-query.js';
import range from '../core/range';

export default class Fullscreen {
  constructor(context) {
    this.context = context;
    this.options = context.options;

    this.$editor = context.layoutInfo.editor;
    this.$toolbar = context.layoutInfo.toolbar;
    this.$editable = context.layoutInfo.editable;
    this.$codable = context.layoutInfo.codable;
    this.$statusbar = context.layoutInfo.statusbar;
    this.$statusOutput = this.$editor.find('.note-status-output');

    this.$window = $$(window);
    this.$scrollbar = $$('html, body');
    this.scrollbarClassName = 'note-fullscreen-body';

    this.onResize = () => {
      this.resizeTo({
        h: this.$window.height() - this.$toolbar.outerHeight() - this.$statusbar.outerHeight() - this.$statusOutput.outerHeight(),
      });
    };
  }

  resizeTo(size) {
    this.$editable.css('height', size.h);
    this.$codable.css('height', size.h);
    if (this.$codable.data('cmeditor')) {
      this.$codable.data('cmeditor').setsize(null, size.h);
    }
  }

  /**
   * toggle fullscreen
   */
  toggle() {
    if (this.shouldSwitchAirModeFullscreen()) {
      return this.toggleAirModeFullscreen();
    }

    this.toggleEditorFullscreen();
  }

  shouldSwitchAirModeFullscreen() {
    return this.options.airModeFullscreen && (
      this.options.airMode ||
      (this.options.airModeFullscreenProxy && this.isFullscreen())
    );
  }

  captureAirModeState() {
    const currentRange = this.context.invoke('editor.getLastRange');
    const editable = this.context.layoutInfo.editable.get(0);

    return {
      bookmark: currentRange ? currentRange.bookmark(editable) : null,
      shouldRestorePopover: this.context.modules.airPopover?.$popover?.css('display') === 'block',
    };
  }

  restoreAirModeState(context, state) {
    if (!state?.bookmark) {
      return;
    }

    const editable = context.layoutInfo.editable.get(0);
    const restoredRange = range.createFromBookmark(editable, state.bookmark);
    restoredRange.select();
    context.invoke('editor.setLastRange', restoredRange);

    if (!state.shouldRestorePopover) {
      return;
    }

    const rect = restoredRange.getClientRects()[0];
    const airPopover = context.modules.airPopover;
    if (!rect || !airPopover) {
      return;
    }

    airPopover.pageX = rect.left + window.scrollX;
    airPopover.pageY = rect.top + window.scrollY;
    airPopover.update(true);
  }

  toggleAirModeFullscreen() {
    const nextAirMode = !this.options.airMode;
    const state = this.options.airMode
      ? this.captureAirModeState()
      : this.options.airModeFullscreenState;
    const nextContext = this.context.recreate({
      airMode: nextAirMode,
      airModeFullscreen: this.options.airModeFullscreen,
      airModeFullscreenProxy: !nextAirMode,
      airModeFullscreenState: nextAirMode ? null : state,
      focus: false,
    });

    if (nextAirMode) {
      this.restoreAirModeState(nextContext, state);
      return;
    }

    nextContext.invoke('fullscreen.toggle');
  }

  toggleEditorFullscreen() {
    this.$editor.toggleClass('fullscreen');
    const isFullscreen = this.isFullscreen();
    this.$scrollbar.toggleClass(this.scrollbarClassName, isFullscreen);
    this.context.invoke('airPopover.hide');
    if (isFullscreen) {
      this.$editable.data('orgHeight', this.$editable.css('height'));
      this.$codable.data('orgHeight', this.$codable.css('height'));
      this.$editable.data('orgMaxHeight', this.$editable.css('maxHeight'));
      this.$codable.data('orgMaxHeight', this.$codable.css('maxHeight'));
      this.$editable.css('maxHeight', '');
      this.$codable.css('maxHeight', '');
      this.$window.on('resize', this.onResize).trigger('resize');
    } else {
      this.$window.off('resize', this.onResize);
      this.$editable.css('height', this.$editable.data('orgHeight'));
      this.$codable.css('height', this.$codable.data('orgHeight'));
      this.$editable.css('maxHeight', this.$editable.data('orgMaxHeight'));
      this.$codable.css('maxHeight', this.$codable.data('orgMaxHeight'));
    }

    this.context.invoke('toolbar.updateFullscreen', isFullscreen);
  }

  isFullscreen() {
    return this.$editor.hasClass('fullscreen');
  }

  destroy() {
    this.$scrollbar.removeClass(this.scrollbarClassName);
  }
}
