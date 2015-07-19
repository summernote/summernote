define([
  'summernote/core/list',
  'summernote/core/dom',
  'summernote/core/key',
  'summernote/core/agent'
], function (list, dom, key, agent) {
  var Clipboard = function (handler) {
    var $paste;

    this.attach = function (layoutInfo) {
      if (window.clipboardData || agent.isFF) {
        $paste = $('<div />').attr('contenteditable', true).css({
          position : 'absolute',
          left : -100000,
          opacity : 0
        });
        layoutInfo.editable().after($paste);
        $paste.on('paste', hPaste);

        layoutInfo.editable().on('keydown', function (e) {
          if (e.ctrlKey && e.keyCode === key.code.V) {
            handler.invoke('saveRange', layoutInfo.editable());
            $paste.focus();
          }
        });
      }

      layoutInfo.editable().on('paste', hPaste);
    };

    var hPasteContent = function (handler, $paste, $editable) {
      var pasteContent = $('<div />').html($paste.html());

      handler.invoke('restoreRange', $editable);
      handler.invoke('focus', $editable);
      handler.invoke('pasteHTML', $editable, pasteContent.html());
      $paste.empty();
    };

    /**
     * paste clipboard image
     *
     * @param {Event} event
     */
    var hPaste = function (event) {
      var clipboardData = event.originalEvent.clipboardData;
      var layoutInfo = dom.makeLayoutInfo(event.currentTarget || event.target);
      var $editable = layoutInfo.editable();

      if (clipboardData && clipboardData.items && clipboardData.items.length) {
        var item = list.head(clipboardData.items);
        if (item.kind === 'file' && item.type.indexOf('image/') !== -1) {
          handler.insertImages(layoutInfo, [item.getAsFile()]);
        }

        handler.invoke('editor.afterCommand', $editable);
      } else {
        // only can run if it has onImageUpload method
        if (!$editable.data('callbacks').onImageUpload || !$paste) {
          return;
        }

        setTimeout(function () {
          var imgNode = $paste[0].firstChild;
          if (!imgNode || !dom.isImg(imgNode)) {
            hPasteContent(handler, $paste, $editable);
          } else {
            handler.invoke('restoreRange', $editable);
            var dataURI = imgNode.src;

            var data = atob(dataURI.split(',')[1]);
            var array = new Uint8Array(data.length);
            for (var i = 0; i < data.length; i++) {
              array[i] = data.charCodeAt(i);
            }

            var blob = new Blob([array], { type : 'image/png' });
            blob.name = 'clipboard.png';
            handler.invoke('focus', $editable);
            handler.insertImages(layoutInfo, [blob]);

            $paste.empty();
          }
        }, 0);
      }
    };
  };

  return Clipboard;
});
