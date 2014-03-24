define([
  'CodeMirror',
  'core/agent', 'core/dom', 'core/async', 'core/key',
  'editing/Style', 'editing/Editor', 'editing/History',
  'module/Toolbar', 'module/Popover', 'module/Handle', 'module/Dialog'
], function (CodeMirror,
             agent, dom, async, key,
             Style, Editor, History,
             Toolbar, Popover, Handle, Dialog) {
  /**
   * EventHandler
   */
  var EventHandler = function () {
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
      var $editor = $(descendant).closest('.note-editor');
      return $editor.length > 0 && dom.buildLayoutInfo($editor);
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

    var hMousedown = function (event) {
      //preventDefault Selection for FF, IE8+
      if (dom.isImg(event.target)) { event.preventDefault(); }
    };

    var hToolbarAndPopoverUpdate = function (event) {
      var oLayoutInfo = makeLayoutInfo(event.currentTarget || event.target);
      var oStyle = editor.currentStyle(event.target);
      if (!oStyle) { return; }
      toolbar.update(oLayoutInfo.toolbar(), oStyle);
      popover.update(oLayoutInfo.popover(), oStyle);
      handle.update(oLayoutInfo.handle(), oStyle);
    };

    var hScroll = function (event) {
      var oLayoutInfo = makeLayoutInfo(event.currentTarget || event.target);
      //hide popover and handle when scrolled
      popover.hide(oLayoutInfo.popover());
      handle.hide(oLayoutInfo.handle());
    };

    /**
     * `mousedown` event handler on $handle
     *  - controlSizing: resize image
     *
     * @param {MouseEvent} event
     */
    var hHandleMousedown = function (event) {
      if (dom.isControlSizing(event.target)) {
        var oLayoutInfo = makeLayoutInfo(event.target),
            $handle = oLayoutInfo.handle(), $popover = oLayoutInfo.popover(),
            $editable = oLayoutInfo.editable(), $editor = oLayoutInfo.editor();

        var elTarget = $handle.find('.note-control-selection').data('target'),
            $target = $(elTarget);
        var posStart = $target.offset(),
            scrollTop = $(document).scrollTop();

        $editor.on('mousemove', function (event) {
          
          editor.resizeTo({
            x: event.clientX - posStart.left,
            y: event.clientY - (posStart.top - scrollTop)
          }, $target, !event.shiftKey);

          handle.update($handle, {image: elTarget});
          popover.update($popover, {image: elTarget});
        }).one('mouseup', function () {
          $editor.off('mousemove');
        });

        if (!$target.data('ratio')) { // original ratio.
          $target.data('ratio', $target.height() / $target.width());
        }

        editor.recordUndo($editable);
        event.stopPropagation();
        event.preventDefault();
      }
    };

    var hToolbarAndPopoverMousedown = function (event) {
      // prevent default event when insertTable (FF, Webkit)
      var $btn = $(event.target).closest('[data-event]');
      if ($btn.length > 0) { event.preventDefault(); }
    };

    var hToolbarAndPopoverClick = function (event) {
      var $btn = $(event.target).closest('[data-event]');

      if ($btn.length > 0) {
        var sEvent = $btn.attr('data-event'),
            sValue = $btn.attr('data-value');

        var oLayoutInfo = makeLayoutInfo(event.target);
        var $editor = oLayoutInfo.editor(),
            $toolbar = oLayoutInfo.toolbar(),
            $dialog = oLayoutInfo.dialog(),
            $editable = oLayoutInfo.editable(),
            $codable = oLayoutInfo.codable();

        var server;
        var cmEditor;

        var options = $editor.data('options');

        // before command: detect control selection element($target)
        var $target;
        if ($.inArray(sEvent, ['resize', 'floatMe', 'removeMedia']) !== -1) {
          var $handle = oLayoutInfo.handle();
          var $selection = $handle.find('.note-control-selection');
          $target = $($selection.data('target'));
        }

        if (editor[sEvent]) { // on command
          $editable.trigger('focus');
          editor[sEvent]($editable, sValue, $target);
        }

        // after command
        if ($.inArray(sEvent, ['backColor', 'foreColor']) !== -1) {
          toolbar.updateRecentColor($btn[0], sEvent, sValue);
        } else if (sEvent === 'showLinkDialog') { // popover to dialog
          $editable.focus();
          var linkInfo = editor.getLinkInfo();

          editor.saveRange($editable);
          dialog.showLinkDialog($editable, $dialog, linkInfo).then(function (sLinkUrl, bNewWindow) {
            editor.restoreRange($editable);
            editor.createLink($editable, sLinkUrl, bNewWindow);
          });
        } else if (sEvent === 'showImageDialog') {
          $editable.focus();

          dialog.showImageDialog($editable, $dialog).then(function (data) {
            if (typeof data === 'string') {
              editor.restoreRange($editable);
              editor.insertImage($editable, data);
            } else {
              insertImages($editable, data);
            }
          });
        } else if (sEvent === 'showVideoDialog') {
          $editable.focus();
          var videoInfo = editor.getVideoInfo();

          editor.saveRange($editable);
          dialog.showVideoDialog($editable, $dialog, videoInfo).then(function (sUrl) {
            editor.restoreRange($editable);
            editor.insertVideo($editable, sUrl);
          });
        } else if (sEvent === 'showHelpDialog') {
          dialog.showHelpDialog($editable, $dialog);
        } else if (sEvent === 'fullscreen') {
          var $scrollbar = $('html, body');

          var resize = function (size) {
            $editor.css('width', size.w);
            $editable.css('height', size.h);
            $codable.css('height', size.h);
            if ($codable.data('cmEditor')) {
              $codable.data('cmEditor').setSize(null, size.h);
            }
          };

          $editor.toggleClass('fullscreen');
          var isFullscreen = $editor.hasClass('fullscreen');
          if (isFullscreen) {
            $editable.data('orgHeight', $editable.css('height'));

            $(window).on('resize', function () {
              resize({
                w: $(window).width(),
                h: $(window).height() - $toolbar.outerHeight()
              });
            }).trigger('resize');

            $scrollbar.css('overflow', 'hidden');
          } else {
            $(window).off('resize');
            resize({
              w: options.width || '',
              h: $editable.data('orgHeight')
            });
            $scrollbar.css('overflow', 'auto');
          }
          toolbar.updateFullscreen($toolbar, isFullscreen);
        } else if (sEvent === 'codeview') {
          $editor.toggleClass('codeview');

          var bCodeview = $editor.hasClass('codeview');
          if (bCodeview) {
            $codable.val($editable.html());
            $codable.height($editable.height());
            toolbar.deactivate($toolbar);
            $codable.focus();

            // activate CodeMirror as codable
            if (agent.bCodeMirror) {
              cmEditor = CodeMirror.fromTextArea($codable[0], $.extend({
                mode: 'text/html',
                lineNumbers: true
              }, options.codemirror));
              var tern = $editor.data('options').codemirror.tern || false;
              if (tern) {
                server = new CodeMirror.TernServer(tern);
                cmEditor.ternServer = server;
                cmEditor.on('cursorActivity', function (cm) {
                  server.updateArgHints(cm);
                });
              }

              // CodeMirror hasn't Padding.
              cmEditor.setSize(null, $editable.outerHeight());
              // autoFormatRange If formatting included
              if (cmEditor.autoFormatRange) {
                cmEditor.autoFormatRange({line: 0, ch: 0}, {
                  line: cmEditor.lineCount(),
                  ch: cmEditor.getTextArea().value.length
                });
              }
              $codable.data('cmEditor', cmEditor);
            }
          } else {
            // deactivate CodeMirror as codable
            if (agent.bCodeMirror) {
              cmEditor = $codable.data('cmEditor');
              $codable.val(cmEditor.getValue());
              cmEditor.toTextArea();
            }

            $editable.html($codable.val() || dom.emptyPara);
            $editable.height(options.height ? $codable.height() : 'auto');

            toolbar.activate($toolbar);
            $editable.focus();
          }

          toolbar.updateCodeview(oLayoutInfo.toolbar(), bCodeview);
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
      var $document = $(document);
      var $editable = makeLayoutInfo(event.target).editable();
      var nEditableTop = $editable.offset().top - $document.scrollTop();

      $document.on('mousemove', function (event) {
        var nHeight = event.clientY - (nEditableTop + EDITABLE_PADDING);
        $editable.height(nHeight);
      }).one('mouseup', function () {
        $document.off('mousemove');
      });

      event.stopPropagation();
      event.preventDefault();
    };

    var PX_PER_EM = 18;
    var hDimensionPickerMove = function (event) {
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

      if (3 < dim.c && dim.c < 10) { // 5~10
        $unhighlighted.css({ width: dim.c + 1 + 'em'});
      }

      if (3 < dim.r && dim.r < 10) { // 5~10
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
      $(document).on('dragenter', function (e) {
        var bCodeview = oLayoutInfo.editor.hasClass('codeview');
        if (!bCodeview && collection.length === 0) {
          oLayoutInfo.editor.addClass('dragover');
          $dropzone.width(oLayoutInfo.editor.width());
          $dropzone.height(oLayoutInfo.editor.height());
          $dropzoneMessage.text('Drag Image Here');
        }
        collection = collection.add(e.target);
      }).on('dragleave', function (e) {
        collection = collection.not(e.target);
        if (collection.length === 0) {
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
        var dataTransfer = event.originalEvent.dataTransfer;
        if (dataTransfer && dataTransfer.files) {
          var oLayoutInfo = makeLayoutInfo(event.currentTarget || event.target);
          oLayoutInfo.editable().focus();
          insertImages(oLayoutInfo.editable(), dataTransfer.files);
        }
        event.preventDefault();
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

      $editable.on('keydown', function (event) {
        var aKey = [];

        // modifier
        if (event.metaKey) { aKey.push('CMD'); }
        if (event.ctrlKey) { aKey.push('CTRL'); }
        if (event.shiftKey) { aKey.push('SHIFT'); }

        // keycode
        var keyName = key.nameFromCode[event.keyCode];
        if (keyName) { aKey.push(keyName); }

        var handler = keyMap[aKey.join('+')];
        if (handler) {
          event.preventDefault();

          editor[handler]($editable, $editor.data('options'));
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
      var keyMap = options.keyMap[agent.bMac ? 'mac' : 'pc'];
      this.bindKeyMap(oLayoutInfo, keyMap);

      oLayoutInfo.editable.on('mousedown', hMousedown);
      oLayoutInfo.editable.on('keyup mouseup', hToolbarAndPopoverUpdate);
      oLayoutInfo.editable.on('scroll', hScroll);

      // Doesn't attach `dragAndDrop` event when `options.disableDragAndDrop` is true
      if (!options.disableDragAndDrop) {
        attachDragAndDropEvent(oLayoutInfo);
      }

      oLayoutInfo.handle.on('mousedown', hHandleMousedown);

      oLayoutInfo.toolbar.on('click', hToolbarAndPopoverClick);
      oLayoutInfo.popover.on('click', hToolbarAndPopoverClick);
      oLayoutInfo.toolbar.on('mousedown', hToolbarAndPopoverMousedown);
      oLayoutInfo.popover.on('mousedown', hToolbarAndPopoverMousedown);
      oLayoutInfo.statusbar.on('mousedown', hStatusbarMousedown);

      //toolbar table dimension
      var $toolbar = oLayoutInfo.toolbar;
      var $catcher = $toolbar.find('.note-dimension-picker-mousecatcher');
      $catcher.on('mousemove', hDimensionPickerMove);

      // save selection when focusout
      oLayoutInfo.editable.on('blur', function () {
        editor.saveRange(oLayoutInfo.editable);
      });

      // save options on editor
      oLayoutInfo.editor.data('options', options);

      // ret styleWithCSS for backColor / foreColor clearing with 'inherit'.
      if (options.styleWithSpan && !agent.bMSIE) {
        // protect FF Error: NS_ERROR_FAILURE: Failure
        setTimeout(function () {
          document.execCommand('styleWithCSS', 0, true);
        });
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
      if (options.onToolbarClick) { oLayoutInfo.toolbar.click(options.onToolbarClick); }

      // callbacks for advanced features (camel)
      // All editor status will be saved on editable with jquery's data
      // for support multiple editor with singleton object.
      oLayoutInfo.editable.data('callbacks', {
        onChange: options.onChange,
        onAutoSave: options.onAutoSave,
        onImageUpload: options.onImageUpload,
        onImageUploadError: options.onImageUploadError,
        onFileUpload: options.onFileUpload,
        onFileUploadError: options.onFileUpload
      });
    };

    this.dettach = function (oLayoutInfo) {
      oLayoutInfo.editable.off();
      oLayoutInfo.toolbar.off();
      oLayoutInfo.handle.off();
      oLayoutInfo.popover.off();
    };
  };

  return EventHandler;
});
