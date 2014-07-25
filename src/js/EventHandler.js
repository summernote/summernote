define([
  'summernote/core/agent', 'summernote/core/dom', 'summernote/core/async', 'summernote/core/key', 'summernote/core/list',
  'summernote/editing/Style', 'summernote/editing/Editor', 'summernote/editing/History',
  'summernote/module/Toolbar', 'summernote/module/Popover', 'summernote/module/Handle', 'summernote/module/Dialog'
], function (agent, dom, async, key, list,
             Style, Editor, History,
             Toolbar, Popover, Handle, Dialog) {

  var CodeMirror;
  if (agent.hasCodeMirror) {
    if (agent.isSupportAmd) {
      require(['CodeMirror'], function (cm) {
        CodeMirror = cm;
      });
    } else {
      CodeMirror = window.CodeMirror;
    }
  }

  /**
   * EventHandler
   */
  var EventHandler = function () {
    var $window = $(window);
    var $document = $(document);
    var $scrollbar = $('html, body');

    var editor = new Editor();
    var toolbar = new Toolbar(), popover = new Popover();
    var handle = new Handle(), dialog = new Dialog();

    /**
     * returns makeLayoutInfo from editor's descendant node.
     *
     * @param {Element} descendant
     * @returns {Object}
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
     * @param {jQuery} $editable
     * @param {File[]} files
     */
    var insertImages = function ($editable, files) {
      editor.restoreRange($editable);
      var callbacks = $editable.data('callbacks');

      // If onImageUpload options setted
      if (callbacks.onImageUpload) {
        callbacks.onImageUpload(files, editor, $editable);
      // else insert Image as dataURL
      } else {
        $.each(files, function (idx, file) {
          async.readFileAsDataURL(file).then(function (sDataURL) {
            editor.insertImage($editable, sDataURL);
          }).fail(function () {
            if (callbacks.onImageUploadError) {
              callbacks.onImageUploadError();
            }
          });
        });
      }
    };

    var commands = {
      /**
       * @param {Object} oLayoutInfo
       */
      showLinkDialog: function (oLayoutInfo) {
        var $editor = oLayoutInfo.editor(),
            $dialog = oLayoutInfo.dialog(),
            $editable = oLayoutInfo.editable(),
            linkInfo = editor.getLinkInfo($editable);

        var options = $editor.data('options');

        editor.saveRange($editable);
        dialog.showLinkDialog($editable, $dialog, linkInfo).then(function (linkInfo) {
          editor.restoreRange($editable);
          editor.createLink($editable, linkInfo, options);
          // hide popover after creating link
          popover.hide(oLayoutInfo.popover());
        }).fail(function () {
          editor.restoreRange($editable);
        });
      },

      /**
       * @param {Object} oLayoutInfo
       */
      showImageDialog: function (oLayoutInfo) {
        var $dialog = oLayoutInfo.dialog(),
            $editable = oLayoutInfo.editable();

        editor.saveRange($editable);
        dialog.showImageDialog($editable, $dialog).then(function (data) {
          editor.restoreRange($editable);

          if (typeof data === 'string') {
            // image url
            editor.insertImage($editable, data);
          } else {
            // array of files
            insertImages($editable, data);
          }
        }).fail(function () {
          editor.restoreRange($editable);
        });
      },

      /**
       * @param {Object} oLayoutInfo
       */
      showVideoDialog: function (oLayoutInfo) {
        var $dialog = oLayoutInfo.dialog(),
            $editable = oLayoutInfo.editable(),
            videoInfo = editor.getVideoInfo($editable);

        editor.saveRange($editable);
        dialog.showVideoDialog($editable, $dialog, videoInfo).then(function (sUrl) {
          editor.restoreRange($editable);
          editor.insertVideo($editable, sUrl);
        }).fail(function () {
          editor.restoreRange($editable);
        });
      },

      /**
       * @param {Object} oLayoutInfo
       */
      showHelpDialog: function (oLayoutInfo) {
        var $dialog = oLayoutInfo.dialog(),
            $editable = oLayoutInfo.editable();

        editor.saveRange($editable);
        dialog.showHelpDialog($editable, $dialog).then(function () {
          editor.restoreRange($editable);
        });
      },

      fullscreen: function (oLayoutInfo) {
        var $editor = oLayoutInfo.editor(),
        $toolbar = oLayoutInfo.toolbar(),
        $editable = oLayoutInfo.editable(),
        $codable = oLayoutInfo.codable();

        var options = $editor.data('options');

        var resize = function (size) {
          $editor.css('width', size.w);
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
              w: $window.width(),
              h: $window.height() - $toolbar.outerHeight()
            });
          }).trigger('resize');

          $scrollbar.css('overflow', 'hidden');
        } else {
          $window.off('resize');
          resize({
            w: options.width || '',
            h: $editable.data('orgheight')
          });
          $scrollbar.css('overflow', 'visible');
        }

        toolbar.updateFullscreen($toolbar, isFullscreen);
      },

      codeview: function (oLayoutInfo) {
        var $editor = oLayoutInfo.editor(),
        $toolbar = oLayoutInfo.toolbar(),
        $editable = oLayoutInfo.editable(),
        $codable = oLayoutInfo.codable(),
        $popover = oLayoutInfo.popover();

        var options = $editor.data('options');

        var cmEditor, server;

        $editor.toggleClass('codeview');

        var isCodeview = $editor.hasClass('codeview');
        if (isCodeview) {
          $codable.val($editable.html());
          $codable.height($editable.height());
          toolbar.deactivate($toolbar);
          popover.hide($popover);
          $codable.focus();

          // activate CodeMirror as codable
          if (agent.hasCodeMirror) {
            cmEditor = CodeMirror.fromTextArea($codable[0], options.codemirror);

            // CodeMirror TernServer
            if (options.codemirror.tern) {
              server = new CodeMirror.TernServer(options.codemirror.tern);
              cmEditor.ternServer = server;
              cmEditor.on('cursorActivity', function (cm) {
                server.updateArgHints(cm);
              });
            }

            // CodeMirror hasn't Padding.
            cmEditor.setSize(null, $editable.outerHeight());
            // autoFormatRange If formatting included
            if (options.codemirror.autoFormatOnStart && cmEditor.autoFormatRange) {
              cmEditor.autoFormatRange({line: 0, ch: 0}, {
                line: cmEditor.lineCount(),
                ch: cmEditor.getTextArea().value.length
              });
            }
            $codable.data('cmEditor', cmEditor);
          }
        } else {
          // deactivate CodeMirror as codable
          if (agent.hasCodeMirror) {
            cmEditor = $codable.data('cmEditor');
            $codable.val(cmEditor.getValue());
            cmEditor.toTextArea();
          }

          $editable.html($codable.val() || dom.emptyPara);
          $editable.height(options.height ? $codable.height() : 'auto');

          toolbar.activate($toolbar);
          $editable.focus();
        }

        toolbar.updateCodeview(oLayoutInfo.toolbar(), isCodeview);
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
        var oLayoutInfo = makeLayoutInfo(event.currentTarget || event.target);
        var oStyle = editor.currentStyle(event.target);
        if (!oStyle) { return; }

        var isAirMode = oLayoutInfo.editor().data('options').airMode;
        if (!isAirMode) {
          toolbar.update(oLayoutInfo.toolbar(), oStyle);
        }

        popover.update(oLayoutInfo.popover(), oStyle, isAirMode);
        handle.update(oLayoutInfo.handle(), oStyle, isAirMode);
      }, 0);
    };

    var hScroll = function (event) {
      var oLayoutInfo = makeLayoutInfo(event.currentTarget || event.target);
      //hide popover and handle when scrolled
      popover.hide(oLayoutInfo.popover());
      handle.hide(oLayoutInfo.handle());
    };

    /**
     * paste clipboard image
     *
     * @param {Event} event
     */
    var hPasteClipboardImage = function (event) {
      var clipboardData = event.originalEvent.clipboardData;
      if (!clipboardData || !clipboardData.items || !clipboardData.items.length) {
        return;
      }

      var oLayoutInfo = makeLayoutInfo(event.currentTarget || event.target);
      var item = list.head(clipboardData.items);
      var isClipboardImage = item.kind === 'file' && item.type.indexOf('image/') !== -1;

      if (isClipboardImage) {
        insertImages(oLayoutInfo.editable(), [item.getAsFile()]);
      }
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

        var oLayoutInfo = makeLayoutInfo(event.target),
            $handle = oLayoutInfo.handle(), $popover = oLayoutInfo.popover(),
            $editable = oLayoutInfo.editable(),
            $editor = oLayoutInfo.editor();

        var elTarget = $handle.find('.note-control-selection').data('target'),
            $target = $(elTarget), posStart = $target.offset(),
            scrollTop = $document.scrollTop();

        var isAirMode = $editor.data('options').airMode;

        $document.on('mousemove', function (event) {
          editor.resizeTo({
            x: event.clientX - posStart.left,
            y: event.clientY - (posStart.top - scrollTop)
          }, $target, !event.shiftKey);

          handle.update($handle, {image: elTarget}, isAirMode);
          popover.update($popover, {image: elTarget}, isAirMode);
        }).one('mouseup', function () {
          $document.off('mousemove');
        });

        if (!$target.data('ratio')) { // original ratio.
          $target.data('ratio', $target.height() / $target.width());
        }

        editor.recordUndo($editable);
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
        var sEvent = $btn.attr('data-event'),
            sValue = $btn.attr('data-value');

        var oLayoutInfo = makeLayoutInfo(event.target);

        event.preventDefault();

        // before command: detect control selection element($target)
        var $target;
        if ($.inArray(sEvent, ['resize', 'floatMe', 'removeMedia']) !== -1) {
          var $selection = oLayoutInfo.handle().find('.note-control-selection');
          $target = $($selection.data('target'));
        }

        if (editor[sEvent]) { // on command
          var $editable = oLayoutInfo.editable();
          $editable.trigger('focus');
          editor[sEvent]($editable, sValue, $target);
        } else if (commands[sEvent]) {
          commands[sEvent].call(this, oLayoutInfo);
        }

        // after command
        if ($.inArray(sEvent, ['backColor', 'foreColor']) !== -1) {
          var options = oLayoutInfo.editor().data('options', options);
          var module = options.airMode ? popover : toolbar;
          module.updateRecentColor(list.head($btn), sEvent, sValue);
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

      var oLayoutInfo = makeLayoutInfo(event.currentTarget || event.target);
      var options = oLayoutInfo.editor().data('options');

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
     * attach Drag and Drop Events
     *
     * @param {Object} oLayoutInfo - layout Informations
     */
    var attachDragAndDropEvent = function (oLayoutInfo) {
      var collection = $(), $dropzone = oLayoutInfo.dropzone,
          $dropzoneMessage = oLayoutInfo.dropzone.find('.note-dropzone-message');

      // show dropzone on dragenter when dragging a object to document.
      $document.on('dragenter', function (e) {
        var isCodeview = oLayoutInfo.editor.hasClass('codeview');
        if (!isCodeview && !collection.length) {
          oLayoutInfo.editor.addClass('dragover');
          $dropzone.width(oLayoutInfo.editor.width());
          $dropzone.height(oLayoutInfo.editor.height());
          $dropzoneMessage.text('Drag Image Here');
        }
        collection = collection.add(e.target);
      }).on('dragleave', function (e) {
        collection = collection.not(e.target);
        if (!collection.length) {
          oLayoutInfo.editor.removeClass('dragover');
        }
      }).on('drop', function () {
        collection = $();
        oLayoutInfo.editor.removeClass('dragover');
      });

      // change dropzone's message on hover.
      $dropzone.on('dragenter', function () {
        $dropzone.addClass('hover');
        $dropzoneMessage.text('Drop Image');
      }).on('dragleave', function () {
        $dropzone.removeClass('hover');
        $dropzoneMessage.text('Drag Image Here');
      });

      // attach dropImage
      $dropzone.on('drop', function (event) {
        event.preventDefault();

        var dataTransfer = event.originalEvent.dataTransfer;
        if (dataTransfer && dataTransfer.files) {
          var oLayoutInfo = makeLayoutInfo(event.currentTarget || event.target);
          oLayoutInfo.editable().focus();
          insertImages(oLayoutInfo.editable(), dataTransfer.files);
        }
      }).on('dragover', false); // prevent default dragover event
    };


    /**
     * bind KeyMap on keydown
     *
     * @param {Object} oLayoutInfo
     * @param {Object} keyMap
     */
    this.bindKeyMap = function (oLayoutInfo, keyMap) {
      var $editor = oLayoutInfo.editor;
      var $editable = oLayoutInfo.editable;

      oLayoutInfo = makeLayoutInfo($editable);

      $editable.on('keydown', function (event) {
        var aKey = [];

        // modifier
        if (event.metaKey) { aKey.push('CMD'); }
        if (event.ctrlKey && !event.altKey) { aKey.push('CTRL'); }
        if (event.shiftKey) { aKey.push('SHIFT'); }

        // keycode
        var keyName = key.nameFromCode[event.keyCode];
        if (keyName) { aKey.push(keyName); }

        var sEvent = keyMap[aKey.join('+')];
        if (sEvent) {
          event.preventDefault();

          if (editor[sEvent]) {
            editor[sEvent]($editable, $editor.data('options'));
          } else if (commands[sEvent]) {
            commands[sEvent].call(this, oLayoutInfo);
          }
        } else if (key.isEdit(event.keyCode)) {
          editor.recordUndo($editable);
        }
      });
    };

    /**
     * attach eventhandler
     *
     * @param {Object} oLayoutInfo - layout Informations
     * @param {Object} options - user options include custom event handlers
     * @param {Function} options.enter - enter key handler
     */
    this.attach = function (oLayoutInfo, options) {
      // handlers for editable
      this.bindKeyMap(oLayoutInfo, options.keyMap[agent.isMac ? 'mac' : 'pc']);
      oLayoutInfo.editable.on('mousedown', hMousedown);
      oLayoutInfo.editable.on('keyup mouseup', hToolbarAndPopoverUpdate);
      oLayoutInfo.editable.on('scroll', hScroll);
      oLayoutInfo.editable.on('paste', hPasteClipboardImage);

      // handler for handle and popover
      oLayoutInfo.handle.on('mousedown', hHandleMousedown);
      oLayoutInfo.popover.on('click', hToolbarAndPopoverClick);
      oLayoutInfo.popover.on('mousedown', hToolbarAndPopoverMousedown);

      // handlers for frame mode (toolbar, statusbar)
      if (!options.airMode) {
        // handler for drag and drop
        if (!options.disableDragAndDrop) {
          attachDragAndDropEvent(oLayoutInfo);
        }

        // handler for toolbar
        oLayoutInfo.toolbar.on('click', hToolbarAndPopoverClick);
        oLayoutInfo.toolbar.on('mousedown', hToolbarAndPopoverMousedown);

        // handler for statusbar
        if (!options.disableResizeEditor) {
          oLayoutInfo.statusbar.on('mousedown', hStatusbarMousedown);
        }
      }

      // handler for table dimension
      var $catcherContainer = options.airMode ? oLayoutInfo.popover :
                                                oLayoutInfo.toolbar;
      var $catcher = $catcherContainer.find('.note-dimension-picker-mousecatcher');
      $catcher.css({
        width: options.insertTableMaxSize.col + 'em',
        height: options.insertTableMaxSize.row + 'em'
      }).on('mousemove', function (event) {
        hDimensionPickerMove(event, options);
      });

      // save options on editor
      oLayoutInfo.editor.data('options', options);

      // ret styleWithCSS for backColor / foreColor clearing with 'inherit'.
      if (options.styleWithSpan && !agent.isMSIE) {
        // protect FF Error: NS_ERROR_FAILURE: Failure
        setTimeout(function () {
          document.execCommand('styleWithCSS', 0, true);
        }, 0);
      }

      // History
      oLayoutInfo.editable.data('NoteHistory', new History());

      // basic event callbacks (lowercase)
      // enter, focus, blur, keyup, keydown
      if (options.onenter) {
        oLayoutInfo.editable.keypress(function (event) {
          if (event.keyCode === key.ENTER) { options.onenter(event); }
        });
      }

      if (options.onfocus) { oLayoutInfo.editable.focus(options.onfocus); }
      if (options.onblur) { oLayoutInfo.editable.blur(options.onblur); }
      if (options.onkeyup) { oLayoutInfo.editable.keyup(options.onkeyup); }
      if (options.onkeydown) { oLayoutInfo.editable.keydown(options.onkeydown); }
      if (options.onpaste) { oLayoutInfo.editable.on('paste', options.onpaste); }

      // callbacks for advanced features (camel)
      if (options.onToolbarClick) { oLayoutInfo.toolbar.click(options.onToolbarClick); }
      if (options.onChange) {
        var hChange = function () {
          options.onChange(oLayoutInfo.editable, oLayoutInfo.editable.html());
        };

        if (agent.isMSIE) {
          var sDomEvents = 'DOMCharacterDataModified DOMSubtreeModified DOMNodeInserted';
          oLayoutInfo.editable.on(sDomEvents, hChange);
        } else {
          oLayoutInfo.editable.on('input', hChange);
        }
      }

      // All editor status will be saved on editable with jquery's data
      // for support multiple editor with singleton object.
      oLayoutInfo.editable.data('callbacks', {
        onAutoSave: options.onAutoSave,
        onImageUpload: options.onImageUpload,
        onImageUploadError: options.onImageUploadError,
        onFileUpload: options.onFileUpload,
        onFileUploadError: options.onFileUpload
      });
    };

    this.dettach = function (oLayoutInfo, options) {
      oLayoutInfo.editable.off();

      oLayoutInfo.popover.off();
      oLayoutInfo.handle.off();
      oLayoutInfo.dialog.off();

      if (!options.airMode) {
        oLayoutInfo.dropzone.off();
        oLayoutInfo.toolbar.off();
        oLayoutInfo.statusbar.off();
      }
    };
  };

  return EventHandler;
});
