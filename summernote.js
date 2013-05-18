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
   * iter
   */
  var iter = function() {
    var hasAttr = function(sAttr) {
      return function(node) { return $(node).attr(sAttr); };
    };
    
    var hasClass = function(sClass) {
      return function(node) { return $(node).hasClass(sClass); };
    };
    
    return {
      hasAttr: hasAttr,
      hasClass: hasClass
    }
  }();
  
  /**
   * dom
   */
  var dom = function() {
    var isText = function (node) {
      return node && node.nodeName === "#text";
    };
    var isList = function(el) {
      return el && (el.nodeName.toLowerCase() === 'ul' || el.nodeName.toLowerCase() === 'ol');
    };
    var isAnchor = function(el) {
      return el && (el.nodeName.toLowerCase() === 'a');
    };

    /**
     * ancestor
     * find nearest ancestor predicate hit
     */
    var ancestor = function(node, pred) {
      while (node) {
        if (pred(node)) { return node; }
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
      if (document.getSelection) { // webkit, firefox
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
      if (document.createRange) {
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
          elEnd = dom.ancestor(ec, dom.isList);
      return elStart && (elStart === elEnd);
    };

    /**
     * isOnAnchor
     *
     * judge whether range is on anchor node or not
     */
    this.isOnAnchor = function() {
      var elStart = dom.ancestor(sc, dom.isAnchor),
          elEnd = dom.ancestor(ec, dom.isAnchor);
      return elStart && (elStart === elEnd);
    };

    /**
     * isCollapsed
     *
     * judge whether range was collapsed
     */
    this.isCollapsed = function() {
      return sc === ec && so === eo;
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
    var makeExecCommand = function(sCmd) {
      return function(sValue) { document.execCommand(sCmd, false, sValue); }
    };
    
    // native commands(with execCommand)
    var aCmd = ['bold', 'italic', 'underline', 'justifyLeft', 'justifyCenter',
                'justifyRight', 'justifyFull', 'insertOrderedList',
                'insertUnorderedList', 'indent', 'outdent', 'formatBlock',
                'removeFormat', 'backColor', 'foreColor'];
                
    for (var idx=0, len=aCmd.length; idx < len; idx ++) {
      this[aCmd[idx]] = makeExecCommand(aCmd[idx]);
    }                

    // custom commands
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
    
    this.color = function(sObjColor) {
      var oColor = JSON.parse(sObjColor);
      this.foreColor(oColor.foreColor);
      this.backColor(oColor.backColor);
    };
  };
  
  /**
   * Toolbar
   */
  var Toolbar = function() {
    this.update = function(welToolbar, oStyle) {
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
      btnState('button[data-event="justifyFull"]', function() {
        return oStyle.textAlign === 'justify';
      });

      btnState('button[data-event="insertUnorderedList"]', function() {
        return oStyle.listStyle === 'unordered';
      });
      btnState('button[data-event="insertOrderedList"]', function() {
        return oStyle.listStyle === 'ordered';
      });
    };
    
    this.updateRecentColor = function(elBtn, sEvent, sValue) {
      var elNoteColor = dom.ancestor(elBtn, iter.hasClass('note-color'));
      var welRecentColor = $(elNoteColor).find('.note-recent-color');
      var oColor = JSON.parse(welRecentColor.attr('data-value'));
      oColor[sEvent] = sValue;
      welRecentColor.attr('data-value', JSON.stringify(oColor));
      var sKey = sEvent === "backColor" ? 'background-color' : 'color';
      welRecentColor.find('i').css(sKey, sValue);
    };
  };
  
  /**
   * Popover
   */
  var Popover = function() {
    this.update = function(welPopover, oStyle) {
      var welAnchorPopover = welPopover.find('.note-anchor-popover');
      if (oStyle.anchor) {
        var welAnchor = welAnchorPopover.find('a');
        welAnchor.attr('href', oStyle.anchor.href).html(oStyle.anchor.href);
        
        //popover position
        var rect = oStyle.anchor.getBoundingClientRect();
        welAnchorPopover.css({
          display: 'block',
          left: rect.left,
          top: $(document).scrollTop() + rect.bottom
        });
      } else {
        welAnchorPopover.hide();
      }
    };
    
    this.hide = function(welPopover) {
      welPopover.children().hide();
    };
  };
  
  /**
   * Dialog
   */
  var Dialog = function() {
    this.showAnchorDialog = function(welDialog) {
      var welAnchorDialog = welDialog.find('.note-anchor-dialog');
      welAnchorDialog.modal('show');
      //welAnchorDialog.find('.note-anchor-text');
      //welAnchorDialog.find('.note-anchor-url');
    };
  };
  
  /**
   * EventHandler
   *
   * handle mouse & key event on note
   */
  var EventHandler = function() {
    var editor = new Editor(), style = new Style();
    var toolbar = new Toolbar(), popover = new Popover();
    var dialog = new Dialog();
    
    var key = { TAB: 9, B: 66, I: 73, U: 85, NUM0: 48, NUM1: 49, NUM4: 52 };

    var hKeydown = function(event) {
      var bCmd = bMac ? event.metaKey : event.ctrlKey;
      var bShift = event.shiftKey;
      if (bCmd && event.keyCode === key.B) { // bold
        editor.bold();
      } else if (bCmd && event.keyCode === key.I) { // italic
        editor.italic();
      } else if (bCmd && event.keyCode === key.U) { // underline
        editor.underline();
      } else if (bShift && event.keyCode === key.TAB) { // shift + tab
        editor.outdent();
      } else if (event.keyCode === key.TAB) { // tab
        editor.indent();
      } else if (bCmd && event.keyCode === key.NUM0) { // formatBlock Paragraph
        editor.formatBlock('P');
      } else if (bCmd && (key.NUM1 <= event.keyCode && event.keyCode <= key.NUM4)) { // formatBlock H1~H4
        editor.formatBlock('H' + String.fromCharCode(event.keyCode));
      } else {
        return; // not matched
      }
      event.preventDefault(); //prevent default event for FF
    };
    
    var hToolbarAndPopoverUpdate = function(event) {
      var elEditableOrToolbar = event.currentTarget || event.target;
      var welEditor = $(elEditableOrToolbar.parentNode);
      
      var oStyle = style.current();
      toolbar.update(welEditor.find('.note-toolbar'), oStyle);
      popover.update(welEditor.find('.note-popover'), oStyle);
    };
    
    var hScroll = function(event) {
      var elEditableOrToolbar = event.currentTarget || event.target;
      var welEditor = $(elEditableOrToolbar.parentNode);
      //hide popover when scrolled
      popover.hide(welEditor.find('.note-popover'));
    };
    
    var hToolbarAndPopoverClick = function(event) {
      var elBtn = dom.ancestor(event.target, iter.hasAttr('data-event'));
      
      if (elBtn) {
        var welBtn = $(elBtn);
        var sEvent = welBtn.attr('data-event');
        var sValue = welBtn.attr('data-value');

        if (editor[sEvent]) { editor[sEvent](sValue); } // execute editor method
        
        // check and update recent color
        if (sEvent === "backColor" || sEvent === "foreColor") {
          toolbar.updateRecentColor(elBtn, sEvent, sValue);
        } else if (sEvent === "showLink") { //popover to dialog
          dialog.showAnchorDialog($('.note-dialog'));
        }
      }
    };

    this.attach = function(layoutInfo) {
      layoutInfo.editable.bind('keydown', hKeydown);
      layoutInfo.editable.bind('keyup mouseup', hToolbarAndPopoverUpdate);
      layoutInfo.editable.bind('scroll', hScroll);
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
                      '<div class="note-insert btn-group">' +
                       '<button class="btn btn-small" title="Picture"><i class="icon-picture"></i></button>' +
                       '<button class="btn btn-small" title="Link" data-shortcut="Ctrl+K" data-mac-shortcut="⌘+K" ><i class="icon-link"></i></button>' +
                       '<button class="btn btn-small" title="Table"><i class="icon-table"></i></button>' +
                     '</div>' +
                     '<div class="note-style btn-group">' +
                       '<button class="btn btn-small dropdown-toggle" title="Style" data-toggle="dropdown"><i class="icon-magic"></i> <span class="caret"></span></button>' +
                       '<ul class="dropdown-menu">' +
                         '<li><a href="#" data-event="formatBlock" data-value="p">Paragraph</a></li>' +
                         '<li><a href="#" data-event="formatBlock" data-value="blockquote"><blockquote>Quote</blockquote></a></li>' +
                         '<li><a href="#" data-event="formatBlock" data-value="h1"><h1>Header 1</h1></a></li>' +
                         '<li><a href="#" data-event="formatBlock" data-value="h2"><h2>Header 2</h2></a></li>' +
                         '<li><a href="#" data-event="formatBlock" data-value="h3"><h3>Header 3</h3></a></li>' +
                         '<li><a href="#" data-event="formatBlock" data-value="h4"><h4>Header 4</h4></a></li>' +
                       '</ul>' +
                     '</div>' +
                     '<div class="note-color btn-group">' +
                       '<button class="btn btn-small note-recent-color" title="Recent Color" data-event="color" data-value=\'{"foreColor":"black","backColor":"yellow"}\'><i class="icon-font" style="color:black;background-color:yellow;"></i></button>' +
                       '<button class="btn btn-small dropdown-toggle" title="More Color" data-toggle="dropdown">' +
                         '<span class="caret"></span>' +
                       '</button>' +
                       '<ul class="dropdown-menu">' +
                         '<li>' +
                           '<div class="btn-group">' +
                             '<div class="note-palette-title">BackColor</div>' +
                             '<div class="note-color-palette" data-target-event="backColor"></div>' +
                           '</div>' +
                           '<div class="btn-group">' +
                             '<div class="note-palette-title">FontColor</div>' +
                             '<div class="note-color-palette" data-target-event="foreColor"></div>' +
                           '</div>' +
                         '</li>' +
                       '</ul>' +
                     '</div>' +
                     '<div class="note-style btn-group">' +
                       '<button class="btn btn-small" title="Bold" data-shortcut="Ctrl+B" data-mac-shortcut="⌘+B" data-event="bold"><i class="icon-bold"></i></button>' +
                       '<button class="btn btn-small" title="Italic" data-shortcut="Ctrl+I" data-mac-shortcut="⌘+I" data-event="italic"><i class="icon-italic"></i></button>' +
                       '<button class="btn btn-small" title="Underline" data-shortcut="Ctrl+U" data-mac-shortcut="⌘+U" data-event="underline"><i class="icon-underline"></i></button>' +
                     '</div>' +
                     '<div class="note-eraser btn-group">' +
                       '<button class="btn btn-small" title="Remove Font Style" data-event="removeFormat"><i class="icon-eraser"></i></button>' +
                     '</div>' +
                     '<div class="note-list btn-group">' +
                       '<button class="btn btn-small" title="Unordered list" data-event="insertUnorderedList"><i class="icon-list-ul"></i></button>' +
                       '<button class="btn btn-small" title="Ordered list" data-event="insertOrderedList"><i class="icon-list-ol"></i></button>' +
                     '</div>' +
                     '<div class="note-para btn-group">' +
                       '<button class="btn btn-small dropdown-toggle" title="Paragraph" data-toggle="dropdown"><i class="icon-align-left"></i>  <span class="caret"></span></button>' +
                       '<ul class="dropdown-menu">' +
                         '<li>' +
                           '<div class="note-align btn-group">' +
                             '<button class="btn btn-small" title="Align left" data-event="justifyLeft"><i class="icon-align-left"></i></button>' +
                             '<button class="btn btn-small" title="Align center" data-event="justifyCenter"><i class="icon-align-center"></i></button>' +
                             '<button class="btn btn-small" title="Align right" data-event="justifyRight"><i class="icon-align-right"></i></button>' +
                             '<button class="btn btn-small" title="Justify full" data-event="justifyFull"><i class="icon-align-justify"></i></button>' +
                           '</div>' +
                         '</li>' +
                         '<li>' +
                           '<div class="note-list btn-group">' +
                             '<button class="btn btn-small" title="Outdent" data-shortcut="Shift+TAB" data-mac-shortcut="⇧+TAB" data-event="outdent"><i class="icon-indent-left"></i></button>' +
                             '<button class="btn btn-small" title="Indent" data-shortcut="TAB" data-mac-shortcut="TAB" data-event="indent"><i class="icon-indent-right"></i></button>' +
                         '</li>' +
                       '</ul>' +
                     '</div>' +
                     '</div>' +
                   '</div>';
    var sPopover = '<div class="note-popover">' +
                     '<div class="note-anchor-popover popover fade bottom in" style="display: none;">' +
                       '<div class="arrow"></div>' +
                       '<div class="popover-content note-link-content">' +
                         '<a href="http://www.google.com" target="_blank">www.google.com</a>&nbsp;&nbsp;' +
                         '<div class="note-insert btn-group">' +
                           '<button class="btn btn-small" title="Edit" data-event="showLink"><i class="icon-edit"></i></button>' +
                           '<button class="btn btn-small" title="Unlink" data-event="unlink"><i class="icon-unlink"></i></button>' +
                         '</div>' +
                       '</div>' +
                     '</div>' +
                   '</div>';
    var sDialog = '<div class="note-dialog">' +
                    '<div class="note-anchor-dialog modal hide in" aria-hidden="false">' +
                      '<div class="modal-header">' +
                        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>' +
                        '<h4>Edit Link</h4>' +
                      '</div>' +
                      '<div class="modal-body">' +
                        '<div class="row-fluid">' +
                          '<label>Text to display</label>' +
                          '<input class="note-anchor-text span12" type="text" />' +
                          '<label>To what URL should this link go?</label>' +
                          '<input class="note-anchor-url span12" type="text" />' +
                        '</div>' +
                      '</div>' +
                      '<div class="modal-footer">' +
                        '<a href="#" class="btn disabled" data-event="editLink" disabled="disabled">Edit</a>' +
                      '</div>' +
                    '</div>' +
                  '</div>';
                        
    /**
     * createTooltip
     */
    var createTooltip = function(welContainer, sPlacement) {
      welContainer.find('button').each(function(i, elBtn) {
        var welBtn = $(elBtn);
        var sShortcut = welBtn.attr(bMac ? 'data-mac-shortcut':'data-shortcut');
        if (sShortcut) { welBtn.attr('title', function(i, v) { return v + ' (' + sShortcut + ')'}); }
      //bootstrap tooltip on btn-group bug: https://github.com/twitter/bootstrap/issues/5687
      }).tooltip({container: 'body', placement: sPlacement || 'top'});
    };
    
    // pallete colors
    var aaColor = [
      ['#000000', '#424242', '#636363', '#9C9C94', '#CEC6CE', '#EFEFEF', '#EFF7F7', '#FFFFFF'],
      ['#FF0000', '#FF9C00', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#9C00FF', '#FF00FF'],
      ['#F7C6CE', '#FFE7CE', '#FFEFC6', '#D6EFD6', '#CEDEE7', '#CEE7F7', '#D6D6E7', '#E7D6DE'],
      ['#E79C9C', '#FFC69C', '#FFE79C', '#B5D6A5', '#A5C6CE', '#9CC6EF', '#B5A5D6', '#D6A5BD'],
      ['#E76363', '#F7AD6B', '#FFD663', '#94BD7B', '#73A5AD', '#6BADDE', '#8C7BC6', '#C67BA5'],
      ['#CE0000', '#E79439', '#EFC631', '#6BA54A', '#4A7B8C', '#3984C6', '#634AA5', '#A54A7B'],
      ['#9C0000', '#B56308', '#BD9400', '#397B21', '#104A5A', '#085294', '#311873', '#731842'],
      ['#630000', '#7B3900', '#846300', '#295218', '#083139', '#003163', '#21104A', '#4A1031']
    ];
    
    /**
     * createPalette
     */
    var createPalette = function(welContainer) {
      welContainer.find('.note-color-palette').each(function() {
        var welPalette = $(this), sEvent = welPalette.attr('data-target-event');
        var sPaletteContents = ''
        for (var row = 0, szRow = aaColor.length; row < szRow; row++) {
          var aColor = aaColor[row];
          var sLine = '<div>'
          for (var col = 0, szCol = aColor.length; col < szCol; col++) {
            var sColor = aColor[col];
            var sButton = ['<button class="note-color-btn" style="background-color:', sColor,
                           ';" data-event="', sEvent,
                           '" data-value="', sColor,
                           '" title="', sColor,
                           '" data-toggle="button"></button>'].join('');
            sLine += sButton;
          }
          sLine += '</div>';
          sPaletteContents += sLine;
        }
        welPalette.html(sPaletteContents);
      });
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
      createPalette(welToolbar);
      createTooltip(welToolbar, 'bottom');
      
      //04. create Popover
      var welPopover = $(sPopover).prependTo(welEditor);
      createTooltip(welPopover);
      
      //05. create Dialog
      var welDialog = $(sDialog).prependTo(welEditor);
      
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
        popover: welEditor.find('.note-popover'),
        dialog: welEditor.find('.note-dialog')
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

  //extend jquery fn
  $.fn.extend({
    // create Editor Layout and attach Key and Mouse Event
    summernote : function(options) {
      options = options || {};

      // createLayout
      renderer.createLayout(this, options.height);

      var info = renderer.layoutInfo(this);
      eventHandler.attach(info);

      if (options.focus) { info.editable.focus(); } // options focus
    },
    // get the HTML contents of note or set the HTML contents of note.
    code : function(sHTML) {
      var info = renderer.layoutInfo(this);

      //get the HTML contents
      if (sHTML === undefined) {
        return info.editable.html();
      }

      // set the HTML contents
      info.editable.html(sHTML);
    },
    // destory Editor Layout and dettach Key and Mouse Event
    destory : function() {
      var info = renderer.layoutInfo(this);
      eventHandler.dettach(info);
      renderer.removeLayout(this);
    }
  });
})(jQuery); // jQuery
