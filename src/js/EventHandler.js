define([
  'CodeMirror',
  'core/agent', 'core/dom', 'core/async',
  'editing/Style', 'editing/Editor',
  'module/Toolbar', 'module/Popover', 'module/Handle', 'module/Dialog'
], function (CodeMirror,
             agent, dom, async,
             Style, Editor,
             Toolbar, Popover, Handle, Dialog) {
  /**
   * EventHandler
   *
   * handle mouse & key event on note
   */
  var EventHandler = function () {
    var editor = new Editor();
    var toolbar = new Toolbar(), popover = new Popover();
    var handle = new Handle(), dialog = new Dialog();

    var key = { BACKSPACE: 8, TAB: 9, ENTER: 13, SPACE: 32,
                NUM0: 48, NUM1: 49, NUM6: 54, NUM7: 55, NUM8: 56,
                B: 66, E: 69, I: 73, J: 74, K: 75, L: 76, R: 82, S: 83, U: 85,
                Y: 89, Z: 90, SLASH: 191,
                LEFTBRACKET: 219, BACKSLACH: 220, RIGHTBRACKET: 221 };

    // makeLayoutInfo from editor's descendant node.
    var makeLayoutInfo = function (descendant) {
      var $editor = $(descendant).closest('.note-editor');
      return {
        editor: function () { return $editor; },
        toolbar: function () { return $editor.find('.note-toolbar'); },
        editable: function () { return $editor.find('.note-editable'); },
        codable: function () { return $editor.find('.note-codable'); },
        statusbar: function () { return $editor.find('.note-statusbar'); },
        popover: function () { return $editor.find('.note-popover'); },
        handle: function () { return $editor.find('.note-handle'); },
        dialog: function () { return $editor.find('.note-dialog'); }
      };
    };

    var hKeydown = function (event) {
      var bCmd = agent.bMac ? event.metaKey : event.ctrlKey,
          bShift = event.shiftKey, keyCode = event.keyCode;

      // optimize
      var bExecCmd = (bCmd || bShift || keyCode === key.TAB);
      var oLayoutInfo = (bExecCmd) ? makeLayoutInfo(event.target) : null;

      if (keyCode === key.TAB && oLayoutInfo.editable().data('tabsize')) {
        editor.tab(oLayoutInfo.editable());
      } else if (bCmd && ((bShift && keyCode === key.Z) || keyCode === key.Y)) {
        editor.redo(oLayoutInfo.editable());
      } else if (bCmd && keyCode === key.Z) {
        editor.undo(oLayoutInfo.editable());
      } else if (bCmd && keyCode === key.B) {
        editor.bold(oLayoutInfo.editable());
      } else if (bCmd && keyCode === key.I) {
        editor.italic(oLayoutInfo.editable());
      } else if (bCmd && keyCode === key.U) {
        editor.underline(oLayoutInfo.editable());
      } else if (bCmd && bShift && keyCode === key.S) {
        editor.strikethrough(oLayoutInfo.editable());
      } else if (bCmd && keyCode === key.BACKSLACH) {
        editor.removeFormat(oLayoutInfo.editable());
      } else if (bCmd && keyCode === key.K) {
        oLayoutInfo.editable();
        editor.setLinkDialog(oLayoutInfo.editable(), function (linkInfo, cb) {
          dialog.showLinkDialog(oLayoutInfo.dialog(), linkInfo, cb);
        });
      } else if (bCmd && keyCode === key.SLASH) {
        dialog.showHelpDialog(oLayoutInfo.dialog());
      } else if (bCmd && bShift && keyCode === key.L) {
        editor.justifyLeft(oLayoutInfo.editable());
      } else if (bCmd && bShift && keyCode === key.E) {
        editor.justifyCenter(oLayoutInfo.editable());
      } else if (bCmd && bShift && keyCode === key.R) {
        editor.justifyRight(oLayoutInfo.editable());
      } else if (bCmd && bShift && keyCode === key.J) {
        editor.justifyFull(oLayoutInfo.editable());
      } else if (bCmd && bShift && keyCode === key.NUM7) {
        editor.insertUnorderedList(oLayoutInfo.editable());
      } else if (bCmd && bShift && keyCode === key.NUM8) {
        editor.insertOrderedList(oLayoutInfo.editable());
      } else if (bCmd && keyCode === key.LEFTBRACKET) {
        editor.outdent(oLayoutInfo.editable());
      } else if (bCmd && keyCode === key.RIGHTBRACKET) {
        editor.indent(oLayoutInfo.editable());
      } else if (bCmd && keyCode === key.NUM0) { // formatBlock Paragraph
        editor.formatBlock(oLayoutInfo.editable(), 'P');
      } else if (bCmd && (key.NUM1 <= keyCode && keyCode <= key.NUM6)) {
        var sHeading = 'H' + String.fromCharCode(keyCode); // H1~H6
        editor.formatBlock(oLayoutInfo.editable(), sHeading);
      } else if (bCmd && keyCode === key.ENTER) {
        editor.insertHorizontalRule(oLayoutInfo.editable());
      } else {
        if (keyCode === key.BACKSPACE || keyCode === key.ENTER ||
            keyCode === key.SPACE) {
          editor.recordUndo(makeLayoutInfo(event.target).editable());
        }
        return; // not matched
      }
      event.preventDefault(); //prevent default event for FF
    };

    var insertImages = function ($editable, files) {
      var callbacks = $editable.data('callbacks');
      editor.restoreRange($editable);
      if (callbacks.onImageUpload) { // call custom handler
        callbacks.onImageUpload(files, editor, $editable);
      } else {
        $.each(files, function (idx, file) {
          async.readFile(file).done(function (sURL) {
            editor.insertImage($editable, sURL);
          }).fail(function () {
            if (callbacks.onImageUploadError) {
              callbacks.onImageUploadError();
            }
          });
        });
      }
    };

    var hDropImage = function (event) {
      var dataTransfer = event.originalEvent.dataTransfer;
      if (dataTransfer && dataTransfer.files) {
        var oLayoutInfo = makeLayoutInfo(event.currentTarget || event.target);
        oLayoutInfo.editable().focus();
        insertImages(oLayoutInfo.editable(), dataTransfer.files);
      }
      event.preventDefault();
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

    var hHandleMousedown = function (event) {
      if (dom.isControlSizing(event.target)) {
        var oLayoutInfo = makeLayoutInfo(event.target),
            $handle = oLayoutInfo.handle(), $popover = oLayoutInfo.popover(),
            $editable = oLayoutInfo.editable(), $editor = oLayoutInfo.editor();

        var elTarget = $handle.find('.note-control-selection').data('target'),
            $target = $(elTarget);
        var posStart = $target.offset(),
            scrollTop = $(document).scrollTop(), posDistance;

        $editor.on('mousemove', function (event) {
          posDistance = {x: event.clientX - posStart.left,
                         y: event.clientY - (posStart.top - scrollTop)};
          editor.resizeTo(posDistance, $target);
          handle.update($handle, {image: elTarget});
          popover.update($popover, {image: elTarget});
        }).on('mouseup', function () {
          $editor.off('mousemove').off('mouseup');
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

        // before command
        var elTarget;
        if ($.inArray(sEvent, ['resize', 'floatMe']) !== -1) {
          var $handle = oLayoutInfo.handle();
          var $selection = $handle.find('.note-control-selection');
          elTarget = $selection.data('target');
        }

        if (editor[sEvent]) { // on command
          $editable.trigger('focus');
          editor[sEvent]($editable, sValue, elTarget);
        }

        // after command
        if ($.inArray(sEvent, ['backColor', 'foreColor']) !== -1) {
          toolbar.updateRecentColor($btn[0], sEvent, sValue);
        } else if (sEvent === 'showLinkDialog') { // popover to dialog
          $editable.focus();
          editor.setLinkDialog($editable, function (linkInfo, cb) {
            dialog.showLinkDialog($dialog, linkInfo, cb);
          });
        } else if (sEvent === 'showImageDialog') {
          $editable.focus();
          dialog.showImageDialog($dialog, function (files) {
            insertImages($editable, files);
          }, function (sUrl) {
            editor.restoreRange($editable);
            editor.insertImage($editable, sUrl);
          });
        } else if (sEvent === 'showVideoDialog') {
          $editable.focus();
          editor.setVideoDialog($editable, function (linkInfo, cb) {
            dialog.showVideoDialog($dialog, linkInfo, cb);
          });
        } else if (sEvent === 'showHelpDialog') {
          dialog.showHelpDialog($dialog);
        } else if (sEvent === 'fullscreen') {
          $editor.toggleClass('fullscreen');

          var hResizeFullscreen = function () {
            var nHeight = $(window).height() - $toolbar.outerHeight();
            $editable.css('height', nHeight);
          };

          var bFullscreen = $editor.hasClass('fullscreen');
          if (bFullscreen) {
            $editable.data('orgHeight', $editable.css('height'));
            $(window).resize(hResizeFullscreen).trigger('resize');
          } else {
            var hasOptionHeight = !!$editable.data('optionHeight');
            $editable.css('height', hasOptionHeight ? $editable.data('orgHeight') : 'auto');
            $(window).off('resize');
          }

          toolbar.updateFullscreen($toolbar, bFullscreen);
        } else if (sEvent === 'codeview') {
          $editor.toggleClass('codeview');

          var bCodeview = $editor.hasClass('codeview');
          if (bCodeview) {
            $codable.val($editable.html());
            $codable.height($editable.height());
            toolbar.disable($toolbar);
            $codable.focus();

            // activate CodeMirror as codable
            if (agent.bCodeMirror) {
              var cmEditor = CodeMirror.fromTextArea($codable[0], $.extend({
                mode: 'text/html',
                lineNumbers: true
              }, $editor.data('options').codemirror));
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
              $codable.data('cmEditor').toTextArea();
            }

            $editable.html($codable.val() || dom.emptyPara);
            $editable.height($editable.data('optionHeight') ? $codable.height() : 'auto');

            toolbar.enable($toolbar);
            $editable.focus();
          }

          toolbar.updateCodeview(oLayoutInfo.toolbar(), bCodeview);
        }

        hToolbarAndPopoverUpdate(event);
      }
    };

    var EDITABLE_PADDING = 24;
    var hStatusbarMousedown = function (event) {
      var $document = $(document);
      var oLayoutInfo = makeLayoutInfo(event.target);
      var $editable = oLayoutInfo.editable();

      var nEditableTop = $editable.offset().top - $document.scrollTop();
      var hMousemove = function (event) {
        $editable.height(event.clientY - (nEditableTop + EDITABLE_PADDING));
      };
      var hMouseup = function () {
        $document.unbind('mousemove', hMousemove)
                   .unbind('mouseup', hMouseup);
      };
      $document.mousemove(hMousemove).mouseup(hMouseup);
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
      if (event.offsetX === undefined) {
        // HTML5 with jQuery - e.offsetX is undefined in Firefox
        var posCatcher = $(event.target).offset();
        posOffset = {x: event.pageX - posCatcher.left,
                     y: event.pageY - posCatcher.top};
      } else {
        posOffset = {x: event.offsetX, y: event.offsetY};
      }

      var dim = {c: Math.ceil(posOffset.x / PX_PER_EM) || 1,
                 r: Math.ceil(posOffset.y / PX_PER_EM) || 1};

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
     * @param oLayoutInfo {object} - layout Informations
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
      $dropzone.on('drop', function (e) {
        hDropImage(e);
      }).on('dragover', false); // prevent default dragover event
    };

    /**
     * Attach eventhandler
     * @param {object} oLayoutInfo - layout Informations
     * @param {object} options - user options include custom event handlers
     * @param {function} options.enter - enter key handler
     */
    this.attach = function (oLayoutInfo, options) {
      oLayoutInfo.editable.on('keydown', hKeydown);
      oLayoutInfo.editable.on('mousedown', hMousedown);
      oLayoutInfo.editable.on('keyup mouseup', hToolbarAndPopoverUpdate);
      oLayoutInfo.editable.on('scroll', hScroll);

      attachDragAndDropEvent(oLayoutInfo);

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

      // callbacks for advanced features (camel)
      // All editor status will be saved on editable with jquery's data
      // for support multiple editor with singleton object.
      oLayoutInfo.editable.data('callbacks', {
        onChange: options.onChange,
        onAutoSave: options.onAutoSave,
        onPasteBefore: options.onPasteBefore,
        onPasteAfter: options.onPasteAfter,
        onImageUpload: options.onImageUpload,
        onImageUploadError: options.onImageUpload,
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
