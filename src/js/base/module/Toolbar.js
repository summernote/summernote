define(function () {
  var Toolbar = function (context) {
    var ui = $.summernote.ui;

    var $note = context.layoutInfo.note;
    var $editor = context.layoutInfo.editor;
    var $toolbar = context.layoutInfo.toolbar;
    var options = context.options;

    this.shouldInitialize = function () {
      return !options.airMode;
    };

    // following toolbar
    this.followingToolbar = function() {
        var isFullscreen = $editor.hasClass('fullscreen');

        if (isFullscreen) {
          return false;
        }

        var $toolbarWrapper = $toolbar.parent('.note-toolbar-wrapper');
        var editorHeight = $editor.outerHeight();
        var editorWidth = $editor.width();
        var toolbarOffset, editorOffsetTop, editorOffsetBottom, toolbarHeight;
        var activateOffset, deactivateOffsetTop, deactivateOffsetBottom;
        var currentOffset;
        var otherBarHeight;

        toolbarHeight = $toolbar.height();
        $toolbarWrapper.css({height: toolbarHeight});

        // check if the web app is currently using another static bar
        otherBarHeight = $('.' + options.otherStaticBarClass).outerHeight();
        if (!otherBarHeight) {
            otherBarHeight = 0;
        }

        currentOffset = $(document).scrollTop();
        toolbarOffset = $toolbar.offset().top;
        editorOffsetTop = $editor.offset().top;
        editorOffsetBottom = editorOffsetTop + editorHeight;
        activateOffset = editorOffsetTop - otherBarHeight;
        deactivateOffsetBottom = editorOffsetBottom - otherBarHeight - toolbarHeight;
        deactivateOffsetTop = editorOffsetTop - otherBarHeight;

        if ((currentOffset > activateOffset) && (currentOffset < deactivateOffsetBottom)) {
            $toolbar.css({position: 'fixed', top: otherBarHeight, width: editorWidth});
        } else {
            $toolbar.css({position: 'relative', top: 0, width: '100%'});
        }
    };

    this.initialize = function () {
      options.toolbar = options.toolbar || [];

      if (!options.toolbar.length) {
        $toolbar.hide();
      } else {
        context.invoke('buttons.build', $toolbar, options.toolbar);
      }

      if (options.toolbarContainer) {
        $toolbar.appendTo(options.toolbarContainer);
      }

      this.changeContainer(false);

      $note.on('summernote.keyup summernote.mouseup summernote.change', function () {
        context.invoke('buttons.updateCurrentStyle');
      });

      context.invoke('buttons.updateCurrentStyle');

      if (options.followingToolbar) {
        $(window).on('scroll resize', () => {
          this.followingToolbar();
        });
      }
    };

    this.destroy = function () {
      $toolbar.children().remove();
    };

    this.changeContainer = function (isFullscreen) {
      if (isFullscreen) {
        $toolbar.prependTo($editor);
      } else {
        if (options.toolbarContainer) {
          $toolbar.appendTo(options.toolbarContainer);
        }
      }
    };

    this.updateFullscreen = function (isFullscreen) {
      ui.toggleBtnActive($toolbar.find('.btn-fullscreen'), isFullscreen);

      this.changeContainer(isFullscreen);
    };

    this.updateCodeview = function (isCodeview) {
      ui.toggleBtnActive($toolbar.find('.btn-codeview'), isCodeview);
      if (isCodeview) {
        this.deactivate();
      } else {
        this.activate();
      }
    };

    this.activate = function (isIncludeCodeview) {
      var $btn = $toolbar.find('button');
      if (!isIncludeCodeview) {
        $btn = $btn.not('.btn-codeview');
      }
      ui.toggleBtn($btn, true);
    };

    this.deactivate = function (isIncludeCodeview) {
      var $btn = $toolbar.find('button');
      if (!isIncludeCodeview) {
        $btn = $btn.not('.btn-codeview');
      }
      ui.toggleBtn($btn, false);
    };
  };

  return Toolbar;
});
