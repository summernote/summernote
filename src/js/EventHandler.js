define([
  'summernote/core/agent',
  'summernote/core/dom',
  'summernote/core/async',
  'summernote/core/key',
  'summernote/core/list',
  'summernote/editing/History',
  'summernote/module/Editor',
  'summernote/module/Toolbar',
  'summernote/module/Popover',
  'summernote/module/Handle',
  'summernote/module/Dialog',
  'summernote/module/Codeview'
], function (agent, dom, async, key, list, History,
             Editor, Toolbar, Popover, Handle, Dialog, Codeview) {

  /**
   * @class EventHandler
   *
   * EventHandler
   *  - TODO: new instance per a editor
   *  - TODO: rename EventHandler
   */
  var EventHandler = function () {
    var $window = $(window);
    var $document = $(document);
    var $scrollbar = $('html, body');

    /**
     * Modules
     */
    var modules = this.modules = {
      editor: new Editor(this),
      toolbar: new Toolbar(this),
      popover: new Popover(this),
      handle: new Handle(this),
      dialog: new Dialog(this),
      codeview: new Codeview(this)
    };

    //  - refactor modules and eventHandler
    //  - now external API only works for editor
    this.invoke = function () {
      var moduleAndMethod = list.head(list.from(arguments));
      var args = list.tail(list.from(arguments));

      var splits = moduleAndMethod.split('.');
      var hasSeparator = splits.length > 1;
      var moduleName = hasSeparator && list.head(splits);
      var methodName = hasSeparator ? list.last(splits) : list.head(splits);

      var module = this.getModule(moduleName);
      var method = module[methodName];

      return method && method.apply(module, args);
    };

    /**
     * returns module
     *
     * @param {String} moduleName - name of module
     * @return {Module} - defaults is editor
     */
    this.getModule = function (moduleName) {
      return this.modules[moduleName] || this.modules.editor;
    };

    /**
     * returns makeLayoutInfo from editor's descendant node.
     *
     * @private
     * @param {Node} descendant
     * @return {Object}
     */
    var makeLayoutInfo = function (descendant) {
      var $target = $(descendant).closest('.note-editor, .note-air-editor, .note-air-layout');

      if (!$target.length) { return null; }

      var $editor;
      if ($target.is('.note-editor, .note-air-editor')) {
        $editor = $target;
      } else {
        $editor = $('#note-editor-' + list.last($target.attr('id').split('-')));
      }

      return dom.buildLayoutInfo($editor);
    };

    /**
     * insert Images from file array.
     *
     * @private
     * @param {Object} layoutInfo
     * @param {File[]} files
     */
    var insertImages = function (layoutInfo, files) {
      var $editor = layoutInfo.editor(),
          $editable = layoutInfo.editable();

      var callbacks = $editable.data('callbacks');
      var options = $editor.data('options');

      // If onImageUpload options setted
      if (callbacks.onImageUpload) {
        callbacks.onImageUpload(files, modules.editor, $editable);
      // else insert Image as dataURL
      } else {
        $.each(files, function (idx, file) {
          var filename = file.name;
          if (options.maximumImageFileSize && options.maximumImageFileSize < file.size) {
            if (callbacks.onImageUploadError) {
              callbacks.onImageUploadError(options.langInfo.image.maximumFileSizeError);
            } else {
              alert(options.langInfo.image.maximumFileSizeError);
            }
          } else {
            async.readFileAsDataURL(file).then(function (sDataURL) {
              modules.editor.insertImage($editable, sDataURL, filename);
            }).fail(function () {
              if (callbacks.onImageUploadError) {
                callbacks.onImageUploadError();
              }
            });
          }
        });
      }
    };

    var commands = {
      /**
       * @param {Object} layoutInfo
       */
      showLinkDialog: function (layoutInfo) {
        var $editor = layoutInfo.editor(),
            $dialog = layoutInfo.dialog(),
            $editable = layoutInfo.editable(),
            linkInfo = modules.editor.getLinkInfo($editable);

        var options = $editor.data('options');

        modules.editor.saveRange($editable);
        modules.dialog.showLinkDialog($editable, $dialog, linkInfo).then(function (linkInfo) {
          modules.editor.restoreRange($editable);
          modules.editor.createLink($editable, linkInfo, options);
          // hide popover after creating link
          modules.popover.hide(layoutInfo.popover());
        }).fail(function () {
          modules.editor.restoreRange($editable);
        });
      },

      /**
       * @param {Object} layoutInfo
       */
      showImageDialog: function (layoutInfo) {
        var $dialog = layoutInfo.dialog(),
            $editable = layoutInfo.editable();

        modules.editor.saveRange($editable);
        modules.dialog.showImageDialog($editable, $dialog).then(function (data) {
          modules.editor.restoreRange($editable);

          if (typeof data === 'string') {
            // image url
            modules.editor.insertImage($editable, data);
          } else {
            // array of files
            insertImages(layoutInfo, data);
          }
        }).fail(function () {
          modules.editor.restoreRange($editable);
        });
      },

      /**
       * @param {Object} layoutInfo
       */
      showHelpDialog: function (layoutInfo) {
        var $dialog = layoutInfo.dialog(),
            $editable = layoutInfo.editable();

        modules.editor.saveRange($editable, true);
        modules.dialog.showHelpDialog($editable, $dialog).then(function () {
          modules.editor.restoreRange($editable);
        });
      },

      fullscreen: function (layoutInfo) {
        var $editor = layoutInfo.editor(),
        $toolbar = layoutInfo.toolbar(),
        $editable = layoutInfo.editable(),
        $codable = layoutInfo.codable();

        var resize = function (size) {
          $editable.css('height', size.h);
          $codable.css('height', size.h);
          if ($codable.data('cmeditor')) {
            $codable.data('cmeditor').setsize(null, size.h);
          }
        };

        $editor.toggleClass('fullscreen');
        var isFullscreen = $editor.hasClass('fullscreen');
        if (isFullscreen) {
          $editable.data('orgheight', $editable.css('height'));

          $window.on('resize', function () {
            resize({
              h: $window.height() - $toolbar.outerHeight()
            });
          }).trigger('resize');

          $scrollbar.css('overflow', 'hidden');
        } else {
          $window.off('resize');
          resize({
            h: $editable.data('orgheight')
          });
          $scrollbar.css('overflow', 'visible');
        }

        modules.toolbar.updateFullscreen($toolbar, isFullscreen);
      },

      codeview: function (layoutInfo) {
        modules.codeview.toggle(layoutInfo);
      }
    };

    var hMousedown = function (event) {
      //preventDefault Selection for FF, IE8+
      if (dom.isImg(event.target)) {
        event.preventDefault();
      }
    };

    var hToolbarAndPopoverUpdate = function (event) {
      // delay for range after mouseup
      setTimeout(function () {
        var layoutInfo = makeLayoutInfo(event.currentTarget || event.target);
        var styleInfo = modules.editor.currentStyle(event.target);
        if (!styleInfo) { return; }

        var isAirMode = layoutInfo.editor().data('options').airMode;
        if (!isAirMode) {
          modules.toolbar.update(layoutInfo.toolbar(), styleInfo);
        }

        modules.popover.update(layoutInfo.popover(), styleInfo, isAirMode);
        modules.handle.update(layoutInfo.handle(), styleInfo, isAirMode);
      }, 0);
    };

    var hScroll = function (event) {
      var layoutInfo = makeLayoutInfo(event.currentTarget || event.target);
      //hide popover and handle when scrolled
      modules.popover.hide(layoutInfo.popover());
      modules.handle.hide(layoutInfo.handle());
    };

    /**
     * paste clipboard image
     *
     * @param {Event} event
     */
    var hPasteClipboardImage = function (event) {
      var clipboardData = event.originalEvent.clipboardData;
      var layoutInfo = makeLayoutInfo(event.currentTarget || event.target);
      var $editable = layoutInfo.editable();

      if (!clipboardData || !clipboardData.items || !clipboardData.items.length) {
        var callbacks = $editable.data('callbacks');
        // only can run if it has onImageUpload method
        if (!callbacks.onImageUpload) {
          return;
        }

        // save cursor
        modules.editor.saveNode($editable);
        modules.editor.saveRange($editable);

        $editable.html('');

        setTimeout(function () {
          var $img = $editable.find('img');
          var datauri = $img[0].src;

          var data = atob(datauri.split(',')[1]);
          var array = new Uint8Array(data.length);
          for (var i = 0; i < data.length; i++) {
            array[i] = data.charCodeAt(i);
          }

          var blob = new Blob([array], { type : 'image/png'});
          blob.name = 'clipboard.png';

          modules.editor.restoreNode($editable);
          modules.editor.restoreRange($editable);
          insertImages(layoutInfo, [blob]);

          modules.editor.afterCommand($editable);
        }, 0);

        return;
      }

      var item = list.head(clipboardData.items);
      var isClipboardImage = item.kind === 'file' && item.type.indexOf('image/') !== -1;

      if (isClipboardImage) {
        insertImages(layoutInfo, [item.getAsFile()]);
      }

      modules.editor.afterCommand($editable);
    };

    /**
     * `mousedown` event handler on $handle
     *  - controlSizing: resize image
     *
     * @param {MouseEvent} event
     */
    var hHandleMousedown = function (event) {
      if (dom.isControlSizing(event.target)) {
        event.preventDefault();
        event.stopPropagation();

        var layoutInfo = makeLayoutInfo(event.target),
            $handle = layoutInfo.handle(), $popover = layoutInfo.popover(),
            $editable = layoutInfo.editable(),
            $editor = layoutInfo.editor();

        var target = $handle.find('.note-control-selection').data('target'),
            $target = $(target), posStart = $target.offset(),
            scrollTop = $document.scrollTop();

        var isAirMode = $editor.data('options').airMode;

        $document.on('mousemove', function (event) {
          modules.editor.resizeTo({
            x: event.clientX - posStart.left,
            y: event.clientY - (posStart.top - scrollTop)
          }, $target, !event.shiftKey);

          modules.handle.update($handle, {image: target}, isAirMode);
          modules.popover.update($popover, {image: target}, isAirMode);
        }).one('mouseup', function () {
          $document.off('mousemove');
          modules.editor.afterCommand($editable);
        });

        if (!$target.data('ratio')) { // original ratio.
          $target.data('ratio', $target.height() / $target.width());
        }
      }
    };

    var hToolbarAndPopoverMousedown = function (event) {
      // prevent default event when insertTable (FF, Webkit)
      var $btn = $(event.target).closest('[data-event]');
      if ($btn.length) {
        event.preventDefault();
      }
    };

    var hToolbarAndPopoverClick = function (event) {
      var $btn = $(event.target).closest('[data-event]');

      if ($btn.length) {
        var eventName = $btn.attr('data-event'),
            value = $btn.attr('data-value'),
            hide = $btn.attr('data-hide');

        var layoutInfo = makeLayoutInfo(event.target);

        // before command: detect control selection element($target)
        var $target;
        if ($.inArray(eventName, ['resize', 'floatMe', 'removeMedia', 'imageShape']) !== -1) {
          var $selection = layoutInfo.handle().find('.note-control-selection');
          $target = $($selection.data('target'));
        }

        // If requested, hide the popover when the button is clicked.
        // Useful for things like showHelpDialog.
        if (hide) {
          $btn.parents('.popover').hide();
        }

        if ($.isFunction($.summernote.pluginEvents[eventName])) {
          $.summernote.pluginEvents[eventName](event, modules.editor, layoutInfo, value);
        } else if (modules.editor[eventName]) { // on command
          var $editable = layoutInfo.editable();
          $editable.trigger('focus');
          modules.editor[eventName]($editable, value, $target);
          event.preventDefault();
        } else if (commands[eventName]) {
          commands[eventName].call(this, layoutInfo);
          event.preventDefault();
        }

        // after command
        if ($.inArray(eventName, ['backColor', 'foreColor']) !== -1) {
          var options = layoutInfo.editor().data('options', options);
          var module = options.airMode ? modules.popover : modules.toolbar;
          module.updateRecentColor(list.head($btn), eventName, value);
        }

        hToolbarAndPopoverUpdate(event);
      }
    };

    var EDITABLE_PADDING = 24;
    /**
     * `mousedown` event handler on statusbar
     *
     * @param {MouseEvent} event
     */
    var hStatusbarMousedown = function (event) {
      event.preventDefault();
      event.stopPropagation();

      var $editable = makeLayoutInfo(event.target).editable();
      var nEditableTop = $editable.offset().top - $document.scrollTop();

      var layoutInfo = makeLayoutInfo(event.currentTarget || event.target);
      var options = layoutInfo.editor().data('options');

      $document.on('mousemove', function (event) {
        var nHeight = event.clientY - (nEditableTop + EDITABLE_PADDING);

        nHeight = (options.minHeight > 0) ? Math.max(nHeight, options.minHeight) : nHeight;
        nHeight = (options.maxHeight > 0) ? Math.min(nHeight, options.maxHeight) : nHeight;

        $editable.height(nHeight);
      }).one('mouseup', function () {
        $document.off('mousemove');
      });
    };

    var PX_PER_EM = 18;
    var hDimensionPickerMove = function (event, options) {
      var $picker = $(event.target.parentNode); // target is mousecatcher
      var $dimensionDisplay = $picker.next();
      var $catcher = $picker.find('.note-dimension-picker-mousecatcher');
      var $highlighted = $picker.find('.note-dimension-picker-highlighted');
      var $unhighlighted = $picker.find('.note-dimension-picker-unhighlighted');

      var posOffset;
      // HTML5 with jQuery - e.offsetX is undefined in Firefox
      if (event.offsetX === undefined) {
        var posCatcher = $(event.target).offset();
        posOffset = {
          x: event.pageX - posCatcher.left,
          y: event.pageY - posCatcher.top
        };
      } else {
        posOffset = {
          x: event.offsetX,
          y: event.offsetY
        };
      }

      var dim = {
        c: Math.ceil(posOffset.x / PX_PER_EM) || 1,
        r: Math.ceil(posOffset.y / PX_PER_EM) || 1
      };

      $highlighted.css({ width: dim.c + 'em', height: dim.r + 'em' });
      $catcher.attr('data-value', dim.c + 'x' + dim.r);

      if (3 < dim.c && dim.c < options.insertTableMaxSize.col) {
        $unhighlighted.css({ width: dim.c + 1 + 'em'});
      }

      if (3 < dim.r && dim.r < options.insertTableMaxSize.row) {
        $unhighlighted.css({ height: dim.r + 1 + 'em'});
      }

      $dimensionDisplay.html(dim.c + ' x ' + dim.r);
    };

    /**
     * Drag and Drop Events
     *
     * @param {Object} layoutInfo - layout Informations
     * @param {Object} options
     */
    var handleDragAndDropEvent = function (layoutInfo, options) {
      if (options.disableDragAndDrop) {
        // prevent default drop event
        $document.on('drop', function (e) {
          e.preventDefault();
        });
      } else {
        attachDragAndDropEvent(layoutInfo, options);
      }
    };

    /**
     * attach Drag and Drop Events
     *
     * @param {Object} layoutInfo - layout Informations
     * @param {Object} options
     */
    var attachDragAndDropEvent = function (layoutInfo, options) {
      var collection = $(),
          $dropzone = layoutInfo.dropzone,
          $dropzoneMessage = layoutInfo.dropzone.find('.note-dropzone-message');

      // show dropzone on dragenter when dragging a object to document
      // -but only if the editor is visible, i.e. has a positive width and height
      $document.on('dragenter', function (e) {
        var isCodeview = modules.codeview.isActivated(layoutInfo);
        if (!isCodeview && !collection.length && layoutInfo.editor.width() > 0 && layoutInfo.editor.height() > 0) {
          layoutInfo.editor.addClass('dragover');
          $dropzone.width(layoutInfo.editor.width());
          $dropzone.height(layoutInfo.editor.height());
          $dropzoneMessage.text(options.langInfo.image.dragImageHere);
        }
        collection = collection.add(e.target);
      }).on('dragleave', function (e) {
        collection = collection.not(e.target);
        if (!collection.length) {
          layoutInfo.editor.removeClass('dragover');
        }
      }).on('drop', function () {
        collection = $();
        layoutInfo.editor.removeClass('dragover');
      });

      // change dropzone's message on hover.
      $dropzone.on('dragenter', function () {
        $dropzone.addClass('hover');
        $dropzoneMessage.text(options.langInfo.image.dropImage);
      }).on('dragleave', function () {
        $dropzone.removeClass('hover');
        $dropzoneMessage.text(options.langInfo.image.dragImageHere);
      });

      // attach dropImage
      $dropzone.on('drop', function (event) {
        event.preventDefault();

        var dataTransfer = event.originalEvent.dataTransfer;
        var html = dataTransfer.getData('text/html');
        var text = dataTransfer.getData('text/plain');

        var layoutInfo = makeLayoutInfo(event.currentTarget || event.target);

        if (dataTransfer && dataTransfer.files && dataTransfer.files.length) {
          layoutInfo.editable().focus();
          insertImages(layoutInfo, dataTransfer.files);
        } else if (html) {
          $(html).each(function () {
            layoutInfo.editable().focus();
            modules.editor.insertNode(layoutInfo.editable(), this);
          });
        } else if (text) {
          layoutInfo.editable().focus();
          modules.editor.insertText(layoutInfo.editable(), text);
        }
      }).on('dragover', false); // prevent default dragover event
    };


    /**
     * bind KeyMap on keydown
     *
     * @param {Object} layoutInfo
     * @param {Object} keyMap
     */
    this.bindKeyMap = function (layoutInfo, keyMap) {
      var $editor = layoutInfo.editor;
      var $editable = layoutInfo.editable;

      layoutInfo = makeLayoutInfo($editable);

      $editable.on('keydown', function (event) {
        var aKey = [];

        // modifier
        if (event.metaKey) { aKey.push('CMD'); }
        if (event.ctrlKey && !event.altKey) { aKey.push('CTRL'); }
        if (event.shiftKey) { aKey.push('SHIFT'); }

        // keycode
        var keyName = key.nameFromCode[event.keyCode];
        if (keyName) { aKey.push(keyName); }

        var eventName = keyMap[aKey.join('+')];
        if (eventName) {
          if ($.summernote.pluginEvents[eventName]) {
            var plugin = $.summernote.pluginEvents[eventName];
            if ($.isFunction(plugin)) {
              plugin(event, modules.editor, layoutInfo);
            }
          } else if (modules.editor[eventName]) {
            modules.editor[eventName]($editable, $editor.data('options'));
            event.preventDefault();
          } else if (commands[eventName]) {
            commands[eventName].call(this, layoutInfo);
            event.preventDefault();
          }
        } else if (key.isEdit(event.keyCode)) {
          modules.editor.afterCommand($editable);
        }
      });
    };

    /**
     * attach eventhandler
     *
     * @param {Object} layoutInfo - layout Informations
     * @param {Object} options - user options include custom event handlers
     * @param {function(event)} [options.onenter] - enter key handler
     * @param {function(event)} [options.onfocus]
     * @param {function(event)} [options.onblur]
     * @param {function(event)} [options.onkeyup]
     * @param {function(event)} [options.onkeydown]
     * @param {function(event)} [options.onpaste]
     * @param {function(event)} [options.onToolBarclick]
     * @param {function(event)} [options.onChange]
     */
    this.attach = function (layoutInfo, options) {
      // handlers for editable
      if (options.shortcuts) {
        this.bindKeyMap(layoutInfo, options.keyMap[agent.isMac ? 'mac' : 'pc']);
      }
      layoutInfo.editable.on('mousedown', hMousedown);
      layoutInfo.editable.on('keyup mouseup', hToolbarAndPopoverUpdate);
      layoutInfo.editable.on('scroll', hScroll);
      layoutInfo.editable.on('paste', hPasteClipboardImage);

      // handler for handle and popover
      layoutInfo.handle.on('mousedown', hHandleMousedown);
      layoutInfo.popover.on('click', hToolbarAndPopoverClick);
      layoutInfo.popover.on('mousedown', hToolbarAndPopoverMousedown);

      // handlers for frame mode (toolbar, statusbar)
      if (!options.airMode) {
        // handler for drag and drop
        handleDragAndDropEvent(layoutInfo, options);

        // handler for toolbar
        layoutInfo.toolbar.on('click', hToolbarAndPopoverClick);
        layoutInfo.toolbar.on('mousedown', hToolbarAndPopoverMousedown);

        // handler for statusbar
        if (!options.disableResizeEditor) {
          layoutInfo.statusbar.on('mousedown', hStatusbarMousedown);
        }
      }

      // handler for table dimension
      var $catcherContainer = options.airMode ? layoutInfo.popover :
                                                layoutInfo.toolbar;
      var $catcher = $catcherContainer.find('.note-dimension-picker-mousecatcher');
      $catcher.css({
        width: options.insertTableMaxSize.col + 'em',
        height: options.insertTableMaxSize.row + 'em'
      }).on('mousemove', function (event) {
        hDimensionPickerMove(event, options);
      });

      // save options on editor
      layoutInfo.editor.data('options', options);

      // ret styleWithCSS for backColor / foreColor clearing with 'inherit'.
      if (!agent.isMSIE) {
        // protect FF Error: NS_ERROR_FAILURE: Failure
        setTimeout(function () {
          document.execCommand('styleWithCSS', 0, options.styleWithSpan);
        }, 0);
      }

      // History
      var history = new History(layoutInfo.editable);
      layoutInfo.editable.data('NoteHistory', history);

      // basic event callbacks (lowercase)
      // enter, focus, blur, keyup, keydown
      if (options.onenter) {
        layoutInfo.editable.keypress(function (event) {
          if (event.keyCode === key.ENTER) { options.onenter(event); }
        });
      }

      if (options.onfocus) { layoutInfo.editable.focus(options.onfocus); }
      if (options.onblur) { layoutInfo.editable.blur(options.onblur); }
      if (options.onkeyup) { layoutInfo.editable.keyup(options.onkeyup); }
      if (options.onkeydown) { layoutInfo.editable.keydown(options.onkeydown); }
      if (options.onpaste) { layoutInfo.editable.on('paste', options.onpaste); }

      // callbacks for advanced features (camel)

      // onToolbarClick
      if (options.onToolbarClick) {
        layoutInfo.toolbar.click(options.onToolbarClick);
      }

      // onChange
      if (options.onChange) {
        var hChange = function () {
          modules.editor.triggerOnChange(layoutInfo.editable);
        };

        if (agent.isMSIE) {
          var sDomEvents = 'DOMCharacterDataModified DOMSubtreeModified DOMNodeInserted';
          layoutInfo.editable.on(sDomEvents, hChange);
        } else {
          layoutInfo.editable.on('input', hChange);
        }
      }

      // All editor status will be saved on editable with jquery's data
      // for support multiple editor with singleton object.
      layoutInfo.editable.data('callbacks', {
        onBeforeChange: options.onBeforeChange,
        onChange: options.onChange,
        onAutoSave: options.onAutoSave,
        onImageUpload: options.onImageUpload,
        onImageUploadError: options.onImageUploadError,
        onFileUpload: options.onFileUpload,
        onFileUploadError: options.onFileUpload,
        onMediaDelete : options.onMediaDelete
      });

      // Textarea: auto filling the code before form submit.
      if (dom.isTextarea(list.head(layoutInfo.holder))) {
        layoutInfo.holder.closest('form').submit(function () {
          var contents = layoutInfo.holder.code();
          layoutInfo.holder.val(contents);

          // callback on submit
          if (options.onsubmit) {
            options.onsubmit(contents);
          }
        });
      }
    };

    this.detach = function (layoutInfo, options) {
      layoutInfo.editable.off();

      layoutInfo.popover.off();
      layoutInfo.handle.off();
      layoutInfo.dialog.off();

      if (!options.airMode) {
        layoutInfo.dropzone.off();
        layoutInfo.toolbar.off();
        layoutInfo.statusbar.off();
      }
    };
  };

  return EventHandler;
});
