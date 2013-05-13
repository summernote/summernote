/**
 * summernote.js
 * (c) 2013~ Youngteac Hong
 * summernote may be freely distributed under the MIT license./
 */
"use strict";
(function($) {
  //Check Platform/Agent
  var bMac = navigator.appVersion.indexOf('Mac') > -1; 
  
  /**
   * dom
   */
  var dom = function() {
    var isText = function (node) {
      return node && node.nodeName === "#text";
    };
    var isList = function(el) {
      return el && (el.nodeName === 'UL' || el.nodeName === 'OL');
    };
    var isAnchor = function(el) {
      return el && (el.nodeName === 'A');
    };

    /**
     * ancestor
     * find nearest ancestor predicate hit
     */
    var ancestor = function(node, pred) {
      while (node) {
        if(pred(node)) { return node; }
        node = node.parentNode;
      }
      return null;
    };
    return {
      isText: isText,
      isList: isList,
      isAnchor: isAnchor,
      ancestor: ancestor
    };
  }();

  /**
   * Range
   * {startContainer, startOffset, endContainer, endOffset}
   * create Range Object From arguments or Browser Selection
   */
  var Range = function(sc, so, ec, eo) {
    if (arguments.length === 0) { // from Browser Selection
      if(document.getSelection) { // webkit, firefox
        var nativeRng = document.getSelection().getRangeAt(0);
        sc = nativeRng.startContainer, so = nativeRng.startOffset,
        ec = nativeRng.endContainer, eo = nativeRng.endOffset;
      } // TODO: handle IE8+ TextRange
    }
    
    this.sc = sc; this.so = so;
    this.ec = ec; this.eo = eo;
 
    /**
     * select
     *
     * update visible range
     */
    this.select = function() {
      if(document.createRange) {
        var range = document.createRange();
        range.setStart(sc, so);
        range.setEnd(ec, eo);
        document.getSelection().addRange(range);
      } // TODO: handle IE8+ TextRange
    }
   
    /**
     * isOnList
     *
     * judge whether range is on list node or not
     */
    this.isOnList = function() {
      var elStart = dom.ancestor(sc, dom.isList),
          elEnd = dom.ancestor(sc, dom.isList);
      return elStart && (elStart === elEnd);
    };

    /**
     * isOnAnchor
     *
     * judge whether range is on anchor node or not
     */
    this.isOnAnchor = function() {
      var elStart = dom.ancestor(sc, dom.isAnchor),
          elEnd = dom.ancestor(sc, dom.isAnchor);
      return elStart && (elStart === elEnd);
    };
  };
  
  /**
   * Style
   */
  var Style = function() {
    /**
     * current
     */
    this.current = function() {
      var rng = new Range();
      var welCont = $(dom.isText(rng.sc) ? rng.sc.parentNode : rng.sc);
      var oStyle = welCont.curStyles('font-weight', 'font-style', 'text-decoration',
                                     'text-align', 'list-style-type') || {};

      //FF fontWeight patch(number to 'bold' or 'normal')
      if (!isNaN(parseInt(oStyle.fontWeight))) {
        oStyle.fontWeight = oStyle.fontWeight > 400 ? 'bold' : 'normal';
      }
      
      // listStyleType to listStyle(unordered, ordered)
      if (!rng.isOnList()) {                                                    
        oStyle.listStyle = 'none';
      } else {
        if (oStyle.listStyleType === 'circle' || oStyle.listStyleType === 'disc' ||
            oStyle.listStyleType === 'disc-leading-zero' || oStyle.listStyleType === 'sqare') {
          oStyle.listStyle = 'unordered';
        } else {                                                                
          oStyle.listStyle = 'ordered';
        }
      } 
      
      oStyle.anchor = rng.isOnAnchor() ? dom.ancestor(rng.sc, dom.isAnchor) : null;
      return oStyle;
    }
  };
  
  /**
   * Editor
   */
  var Editor = function() {
    var makeExecCommand = function(sCmd) { return function() { document.execCommand(sCmd); } };
    
    this.bold = makeExecCommand('bold');
    this.italic = makeExecCommand('italic');
    this.underline = makeExecCommand('underline');
    this.justifyLeft = makeExecCommand('justifyLeft');
    this.justifyCenter = makeExecCommand('justifyCenter');
    this.justifyRight = makeExecCommand('justifyRight');
    this.insertOrderedList = makeExecCommand('insertOrderedList');
    this.insertUnorderedList = makeExecCommand('insertUnorderedList');
    this.indent = makeExecCommand('indent');
    this.outdent = makeExecCommand('outdent');
    this.unlink = function() {
      var range = new Range();
      if (range.isOnAnchor()) {
        var elAnchor = dom.ancestor(range.sc, dom.isAnchor);
        range = new Range(elAnchor, 0, elAnchor, 1);
        range.select();
        document.execCommand('unlink');
      }
    };
    this.editLink = function() {
      console.log('editLink');
    };
  };
  
  /**
   * EventHandler
   *
   * handle keydown event on editable area
   */
  var EventHandler = function() {
    var editor = new Editor();
    var style = new Style();
    var key = { B: 66, I: 73, U: 85 };

    var updateToolbar = function(welToolbar, oStyle) {
      var btnState = function(sSelector, pred) {
        var welBtn = welToolbar.find(sSelector);
        welBtn[pred() ? 'addClass' : 'removeClass']('active');
      };
      
      btnState('button[data-event="bold"]', function() {
        return oStyle.fontWeight === 'bold';
      });
      btnState('button[data-event="italic"]', function() {
        return oStyle.fontStyle === 'italic';
      });
      btnState('button[data-event="underline"]', function() {
        return oStyle.textDecoration === 'underline';
      });
      btnState('button[data-event="justifyLeft"]', function() {
        return oStyle.textAlign === 'left' || oStyle.textAlign === 'start';
      });
      btnState('button[data-event="justifyCenter"]', function() {
        return oStyle.textAlign === 'center';
      });
      btnState('button[data-event="justifyRight"]', function() {
        return oStyle.textAlign === 'right';
      });
      btnState('button[data-event="insertUnorderedList"]', function() {
        return oStyle.listStyle === 'unordered';
      });
      btnState('button[data-event="insertOrderedList"]', function() {
        return oStyle.listStyle === 'ordered';
      });
    };
    
    var updatePopover = function(welPopover, oStyle) {
      var welAnchorPopover = welPopover.find('.note-anchor-popover');
      if (oStyle.anchor) {
        var welAnchor = welAnchorPopover.find('a');
        welAnchor.attr('href', oStyle.anchor.href).html(oStyle.anchor.href);
        
        //popover position
        var rect = oStyle.anchor.getBoundingClientRect();
        welAnchorPopover.css({
          display: 'block',
          left: rect.left,
          top: rect.bottom
        });
      } else {
        welAnchorPopover.hide();
      }
    };

    var hKeydown = function(event) {
      var bCmd = bMac ? event.metaKey : event.ctrlKey;
      if(bCmd && event.keyCode === key.B) { // bold
        editor.bold();
      } else if(bCmd && event.keyCode === key.I) { // italic
        editor.italic();
      } else if(bCmd && event.keyCode === key.U) { // underline
        editor.underline();
      } else {
        return; // not matched
      }
      event.preventDefault(); //prevent default event for FF
    };
    
    var hToolbarAndPopoverUpdate = function(event) {
      var elEditableOrToolbar = event.currentTarget || event.target;
      var welEditor = $(elEditableOrToolbar.parentNode);
      
      var oStyle = style.current();
      updateToolbar(welEditor.find('.note-toolbar'), oStyle);
      updatePopover(welEditor.find('.note-popover'), oStyle);
    };

    var hToolbarAndPopoverClick = function(event) {
      var elBtn = dom.ancestor(event.target, function(node) {
        return $(node).attr('data-event');
      });
      if (elBtn) { editor[$(elBtn).attr('data-event')](); }
    };

    this.attach = function(layoutInfo) {
      layoutInfo.editable.bind('keydown', hKeydown);
      layoutInfo.editable.bind('keyup mouseup', hToolbarAndPopoverUpdate);
      layoutInfo.toolbar.bind('click', hToolbarAndPopoverClick);
      layoutInfo.toolbar.bind('click', hToolbarAndPopoverUpdate);
      layoutInfo.popover.bind('click', hToolbarAndPopoverClick);
      layoutInfo.popover.bind('click', hToolbarAndPopoverUpdate);
    };

    this.dettach = function(layoutInfo) {
      layoutInfo.editable.unbind();
      layoutInfo.toolbar.unbind();
      layoutInfo.popover.unbind();
    };
  };

  /**
   * Renderer
   *
   * rendering toolbar and editable
   */
  var Renderer = function() {
    var sToolbar = '<div class="note-toolbar btn-toolbar">' + 
                     '<div class="note-style btn-group">' +
                       '<button class="btn btn-small" title="Bold" data-shortcut="Ctrl+B" data-mac-shortcut="⌘+B" data-event="bold"><i class="icon-bold"></i></button>' +
                       '<button class="btn btn-small" title="Italic" data-shortcut="Ctrl+I" data-mac-shortcut="⌘+I" data-event="italic"><i class="icon-italic"></i></button>' +
                       '<button class="btn btn-small" title="Underline" data-shortcut="Ctrl+U" data-mac-shortcut="⌘+U" data-event="underline"><i class="icon-underline"></i></button>' +
                     '</div>' +
                     '<div class="note-para btn-group">' +
                       '<button class="btn btn-small" title="Align left" data-event="justifyLeft"><i class="icon-align-left"></i></button>' +
                       '<button class="btn btn-small" title="Align center" data-event="justifyCenter"><i class="icon-align-center"></i></button>' +
                       '<button class="btn btn-small" title="Align right" data-event="justifyRight"><i class="icon-align-right"></i></button>' +
                     '</div>' +
                     '<div class="note-list btn-group">' +
                       '<button class="btn btn-small" title="Unordered list" data-event="insertUnorderedList"><i class="icon-list-ul"></i></button>' +
                       '<button class="btn btn-small" title="Ordered list" data-event="insertOrderedList"><i class="icon-list-ol"></i></button>' +
                       '<button class="btn btn-small" title="Outdent" data-event="outdent"><i class="icon-indent-left"></i></button>' +
                       '<button class="btn btn-small" title="Indent" data-event="indent"><i class="icon-indent-right"></i></button>' +
                     '</div>' +
                     '<div class="note-insert btn-group">' +
                       '<button class="btn btn-small" title="Picture"><i class="icon-picture"></i></button>' +
                       '<button class="btn btn-small" title="Link" data-shortcut="Ctrl+K" data-mac-shortcut="⌘+K" ><i class="icon-link"></i></button>' +
                       '<button class="btn btn-small" title="Table"><i class="icon-table"></i></button>' +
                     '</div>' +
                   '</div>';
    var sPopover = '<div class="note-popover">' +
                     '<div class="note-anchor-popover popover fade bottom in" style="display: none;">' +
                       '<div class="arrow"></div>' +
                       '<div class="popover-content">' +
                         '<a href="http://www.naver.com" target="_blank">www.naver.com</a>&nbsp;&nbsp;' +
                         '<div class="note-insert btn-group">' +
                           '<button class="btn btn-small" title="Edit" data-event="editLink"><i class="icon-edit"></i></button>' +
                           '<button class="btn btn-small" title="Unlink" data-event="unlink"><i class="icon-unlink"></i></button>' +
                         '</div>' +
                       '</div>' +
                     '</div>' +
                   '</div>';
    /**
     * createTooltip
     */
    var createTooltip = function(welContainer) {
      welContainer.find('button').each(function(i, elBtn) {
        var welBtn = $(elBtn);
        var sShortcut = welBtn.attr(bMac ? 'data-mac-shortcut':'data-shortcut');
        if (sShortcut) { welBtn.attr('title', function(i, v) { return v + ' (' + sShortcut + ')'}); }
      //bootstrap tooltip on btn-group bug: https://github.com/twitter/bootstrap/issues/5687
      }).tooltip({container: 'body'});
    };
    
    /**
     * createLayout
     */
    var createLayout = this.createLayout = function(welHolder, nHeight) {
      //already created
      if (welHolder.next().hasClass('note-editor')) { return; }
      
      //01. create Editor
      var welEditor = $('<div class="note-editor"></div>');

      //02. create Editable
      var welEditable = $('<div class="note-editable" contentEditable="true"></div>').prependTo(welEditor);
      if (nHeight) { welEditable.height(nHeight); }

      welEditable.html(welHolder.html());
      
      //03. create Toolbar
      var welToolbar = $(sToolbar).prependTo(welEditor);
      createTooltip(welToolbar);
      
      //04. create Popover
      var welPopover = $(sPopover).prependTo(welEditor);
      createTooltip(welPopover);
      
      //05. Editor/Holder switch
      welEditor.insertAfter(welHolder);
      welHolder.hide();
    };
    
    /**
     * layoutInfo
     */
    var layoutInfo = this.layoutInfo = function(welHolder) {
      var welEditor = welHolder.next();
      if (!welEditor.hasClass('note-editor')) { return; }
      
      return {
        editor: welEditor,
        editable: welEditor.find('.note-editable'),
        toolbar: welEditor.find('.note-toolbar'),
        popover: welEditor.find('.note-popover')
      }
    };
    
    /**
     * removeLayout
     */
    var removeLayout = this.removeLayout = function(welHolder) {
      var info = layoutInfo(welHolder);
      if (!info) { return; }
      welHolder.html(info.editable.html());
      
      info.editor.remove();
      welHolder.show();
    };
  };

  var renderer = new Renderer();
  var eventHandler = new EventHandler();

  /**
   * summernote 
   *
   * create Editor Layout and attach Key and Mouse Event
   */
  $.fn.summernote = function(options) {
    options = options || {};
    
    // createLayout
    renderer.createLayout(this, options.height);
    
    var info = renderer.layoutInfo(this);
    eventHandler.attach(info);
    
    if(options.focus) { info.editable.focus(); } // options focus
  };
  
  /**
   * code
   *
   * get the HTML contents of note or set the HTML contents of note.
   */
  $.fn.code = function(sHTML) {
    var info = renderer.layoutInfo(this);
    
    //get the HTML contents
    if (sHTML === undefined) {
      return info.editable.html();
    }
    
    // set the HTML contents
    info.editable.html(sHTML);
  };
  
  /**
   * finish
   */
  $.fn.destory = function() {
    var info = renderer.layoutInfo(this);
    eventHandler.dettach(info);
    renderer.removeLayout(this);
  };
  
// jQuery
})(jQuery);
