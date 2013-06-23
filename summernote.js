/**
 * summernote.js
 * (c) 2013~ Youngteac Hong
 * summernote may be freely distributed under the MIT license./
 */
"use strict";
(function($) {
  //Check Platform/Agent
  var bMac = navigator.appVersion.indexOf('Mac') > -1; 
  var bMSIE = navigator.userAgent.indexOf('MSIE') > -1;
  
  /**
   * func utils (for high-order func's arg)
   */
  var func = function() {
    var eq = function(target) {
      return function(current) { return target === current; };
    };
    
    var fail = function() { return false; };
    return { eq: eq, fail: fail }
  }();
  
  /**
   * list utils
   */
  var list = function() {
    var head = function(array) { return array[0]; };
    var last = function(array) { return array[array.length - 1]; };
    var initial = function(array) { return array.slice(0, length - 1); };
    var tail = function(array) { return array.slice(1); };
    
    var clusterBy = function(array, fn) {
      if (array.length === 0) { return []; }
      var aTail = tail(array);
      return aTail.reduce(function (memo, v) {
        var aLast = last(memo);
        if (fn(last(aLast), v)) {
          aLast[aLast.length] = v;
        } else {
          memo[memo.length] = [v];
        }
        return memo;
      }, [[head(array)]]);
    };

    var compact = function(array) {
      var aResult = [];
      for(var idx = 0; idx < array.length; idx ++) {
        if (array[idx]) { aResult.push(array[idx]); };
      };
      return aResult;
    };

    return { head: head, last: last, initial: initial, tail: tail, 
             compact: compact, clusterBy: clusterBy };
  }();
  
  /**
   * dom utils
   */
  var dom = function() {
    // nodeName of element are always uppercase.
    // http://ejohn.org/blog/nodename-case-sensitivity/
    var makePredByNodeName = function(sNodeName) {
      return function(node) { return node && node.nodeName === sNodeName; };
    };
    
    var isPara = function(node) {
      return node && /^P|^LI|^H[1-7]/.test(node.nodeName);
    };

    var isList = function(node) {
      return node && /^UL|^OL/.test(node.nodeName);
    };

    // ancestor: find nearest ancestor predicate hit
    var ancestor = function(node, pred) {
      while (node) {
        if (pred(node)) { return node; }
        node = node.parentNode;
      }
      return null;
    };
    
    // listAncestor: listing ancestor nodes (until predicate hit: optional)
    var listAncestor = function(node, pred) {
      pred = pred || func.fail;      
      
      var aAncestor = [];
      ancestor(node, function(el) {
        aAncestor.push(el);
        return pred(el);
      });
      return aAncestor;
    };
    
    // commonAncestor: find commonAncestor
    var commonAncestor = function(nodeA, nodeB) {
      var aAncestor = listAncestor(nodeA);
      for (var n = nodeB; n; n = n.parentNode) {
        if ($.inArray(n, aAncestor) > -1) { return n; }
      }
      return null; // difference document area
    };

    // listBetween: listing all Nodes between nodeA and nodeB
    // FIXME: nodeA and nodeB must be sorted, use comparePoints later.
    var listBetween = function(nodeA, nodeB) {
      var aNode = [];
      var elAncestor = commonAncestor(nodeA, nodeB);
      //TODO: IE8, createNodeIterator
      var iterator = document.createNodeIterator(elAncestor,
                                                 NodeFilter.SHOW_ALL, null,
                                                 false);
      var node, bStart = false;
      while (node = iterator.nextNode()) {
        if (nodeA === node) { bStart = true; }
        if (bStart) { aNode.push(node); }
        if (nodeB === node) { break; }
      }
      return aNode;
    };
    
    // listNext: listing nextSiblings (until predicate hit: optional)
    var listNext = function(node, pred) {
      pred = pred || func.fail;      

      var aNext = [];
      while(node) {
        aNext.push(node);
        if (node === pred) { break; }
        node = node.nextSibling;
      };
      return aNext;
    };
    
    // insertAfter: insert node after preceding
    var insertAfter = function(node, preceding) {
      var next = preceding.nextSibling, parent = preceding.parentNode;
      if (next) {
        parent.insertBefore(node, next);
      } else {
        parent.appendChild(node);
      }
    };

    // appends: append children
    var appends = function(node, aChild) {
      $.each(aChild, function(idx, child) {
        node.appendChild(child);
      });
    };
    
    var isText = makePredByNodeName('#text');
    
    // split: split dom tree by boundaryPoint(pivot and offset)
    var split = function(root, pivot, offset) {
      var aAncestor = listAncestor(pivot, func.eq(root));
      aAncestor.reduce(function(node, parent) { // node: cloned
        var clone = parent.cloneNode(false); // shallow clone
        insertAfter(clone, parent);
        if (node === pivot && offset > 0) {
          if (isText(node)) { node.splitText(offset); } // splitText
          node = node.nextSibling;
        }
        appends(clone, listNext(node));
        return clone;
      });
    };
    
    return {
      isText: isText,
      isPara: isPara, isList: isList,
      isAnchor: makePredByNodeName('A'),
      isDiv: makePredByNodeName('DIV'), isSpan: makePredByNodeName('SPAN'),
      isB: makePredByNodeName('B'), isU: makePredByNodeName('U'),
      isS: makePredByNodeName('S'), isI: makePredByNodeName('I'),
      ancestor: ancestor, listAncestor: listAncestor,
      listNext: listNext,
      commonAncestor: commonAncestor, listBetween: listBetween,
      insertAfter: insertAfter, split: split
    };
  }();

  /**
   * Range
   * {startContainer, startOffset, endContainer, endOffset}
   * create Range Object From arguments or Browser Selection
   */
  var bW3CRangeSupport = !!document.createRange;
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

    // nativeRange: get nativeRange from sc, so, ec, eo
    var nativeRange = function() {
      if (bW3CRangeSupport) {
        var range = document.createRange();
        range.setStart(sc, so);
        range.setEnd(ec, eo);
        return range;
      } // TODO: handle IE8+ TextRange
    };
 
    // select: update visible range
    this.select = function() {
      var nativeRng = nativeRange();
      if (bW3CRangeSupport) {
        document.getSelection().addRange(nativeRng);
      } // TODO: handle IE8+ TextRange
    }
    
    // listPara: listing paragraphs on range
    this.listPara = function() {
      var aNode = dom.listBetween(sc, ec);
      var aPara = list.compact($.map(aNode, function(node) {
        return dom.ancestor(node, dom.isPara);
      }));
      var aaClustered = list.clusterBy(aPara, function(nodeA, nodeB) {
        return nodeA === nodeB;
      });
      return $.map(aaClustered, list.head);
    };
    
    // isOnList: judge whether range is on list node or not
    this.isOnList = function() {
      var elStart = dom.ancestor(sc, dom.isList),
          elEnd = dom.ancestor(ec, dom.isList);
      return elStart && (elStart === elEnd);
    };

    // isOnAnchor: judge whether range is on anchor node or not
    this.isOnAnchor = function() {
      var elStart = dom.ancestor(sc, dom.isAnchor),
          elEnd = dom.ancestor(ec, dom.isAnchor);
      return elStart && (elStart === elEnd);
    };

    // isCollapsed: judge whether range was collapsed
    this.isCollapsed = function() { return sc === ec && so === eo; };
    
    // insertNode
    this.insertNode = function(node) {
      var nativeRng = nativeRange();
      if (bW3CRangeSupport) {
        nativeRng.insertNode(node);
      } // TODO: IE8
    };
    
    // surroundContents
    this.surroundContents = function(sNodeName) {
      var node = $('<' + sNodeName + ' />')[0];
      var nativeRng = nativeRange();
      if (bW3CRangeSupport) {
        nativeRng.surroundContents(node);
      } // TODO: IE8
      
      return node;
    };

    this.toString = function() {
      var nativeRng = nativeRange();
      if (bW3CRangeSupport) {
        return nativeRng.toString();
      } // TODO: IE8
    };
  };
  
  /**
   * Style
   */
  var Style = function() {
    // font level style
    this.styleFont = function(rng, oStyle) {
      //TODO: complete styleFont later only works for webkit
      //rng.splitInline();
      var elSpan = rng.surroundContents('span');
      $.each(oStyle, function(sKey, sValue) {
        elSpan.style[sKey] = sValue;
      });
    };
    
    // para level style
    this.stylePara = function(rng, oStyle) {
      var aPara = rng.listPara();
      $.each(aPara, function(idx, elPara) {
        $.each(oStyle, function(sKey, sValue) {
          elPara.style[sKey] = sValue;
        });
      });
    };
    
    // get current style
    this.current = function(rng) {
      var welCont = $(dom.isText(rng.sc) ? rng.sc.parentNode : rng.sc);
      var oStyle = welCont.curStyles('font-size', 'font-weight', 'font-style',
                                     'text-decoration', 'text-align',
                                     'list-style-type', 'line-height') || {};
                                     
      oStyle.fontSize = parseInt(oStyle.fontSize);

      // FF fontWeight patch(number to 'bold' or 'normal')
      if (!isNaN(parseInt(oStyle.fontWeight))) {
        oStyle.fontWeight = oStyle.fontWeight > 400 ? 'bold' : 'normal';
      }
      
      // listStyleType to listStyle(unordered, ordered)
      if (!rng.isOnList()) {
        oStyle.listStyle = 'none';
      } else {
        var aOrderedType = ['circle', 'disc', 'disc-leading-zero', 'square'];
        var bUnordered = $.inArray(oStyle.listStyleType, aOrderedType) > -1;
        oStyle.listStyle = bUnordered ? 'unordered' : 'ordered';
      }
      
      oStyle.anchor = rng.isOnAnchor() ? dom.ancestor(rng.sc, dom.isAnchor) : null;

      var elPara = dom.ancestor(rng.sc, dom.isPara);
      if (elPara && elPara.style.lineHeight) {
        oStyle.lineHeight = elPara.style.lineHeight;
      } else {
        var lineHeight = parseInt(oStyle.lineHeight) / parseInt(oStyle.fontSize);
        oStyle.lineHeight = lineHeight.toFixed(1);
      }
      return oStyle;
    }
  };
  
  /**
   * Editor
   */
  var Editor = function() {
    var style = new Style();
    
    var makeExecCommand = function(sCmd) {
      return function(sValue) { document.execCommand(sCmd, false, sValue); }
    };

    // current style
    this.currentStyle = function() {
      if (document.getSelection().rangeCount == 0) { return null; }

      var rng = new Range();
      return style.current(rng);
    };
    
    // native commands(with execCommand)
    var aCmd = ['bold', 'italic', 'underline', 'justifyLeft', 'justifyCenter',
                'justifyRight', 'justifyFull', 'insertOrderedList',
                'insertUnorderedList', 'indent', 'outdent', 'formatBlock',
                'removeFormat', 'backColor', 'foreColor'];
    for (var idx=0, len=aCmd.length; idx < len; idx ++) {
      this[aCmd[idx]] = makeExecCommand(aCmd[idx]);
    }                
    
    this.fontSize = function(sValue) {
      style.styleFont(new Range(), {fontSize: sValue + 'px'});
    };
    
    this.lineHeight = function(sValue) {
      style.stylePara(new Range(), {lineHeight: sValue});
    };

    this.unlink = function() {
      var rng = new Range();
      if (rng.isOnAnchor()) {
        var elAnchor = dom.ancestor(rng.sc, dom.isAnchor);
        rng = new Range(elAnchor, 0, elAnchor, 1);
        rng.select();
        document.execCommand('unlink');
      }
    };

    this.setLinkDialog = function(fnShowDialog) {
      var rng = new Range();
      if (rng.isOnAnchor()) {
        var elAnchor = dom.ancestor(rng.sc, dom.isAnchor);
        rng = new Range(elAnchor, 0, elAnchor, 1);
      }
      fnShowDialog({
        range: rng,
        text: rng.toString(),
        url: rng.isOnAnchor() ? dom.ancestor(rng.sc, dom.isAnchor).href : ""
      }, function(sLinkUrl) {
        rng.select();
        if (sLinkUrl.toLowerCase().indexOf("http://") !== 0) {
          sLinkUrl = "http://" + sLinkUrl;
        }
        document.execCommand('createlink', false, sLinkUrl);
      });
    };
    
    this.color = function(sObjColor) {
      var oColor = JSON.parse(sObjColor);
      this.foreColor(oColor.foreColor);
      this.backColor(oColor.backColor);
    };
    
    this.insertTable = function(sDim) {
      var aDim = sDim.split('x');
      var nCol = aDim[0], nRow = aDim[1];
      
      var aTD = [], sTD;
      var sWhitespace = bMSIE ? '&nbsp;' : '<br/>';
      for (var idxCol = 0; idxCol < nCol; idxCol++) {
        aTD.push('<td>' + sWhitespace + '</td>');
      }
      sTD = aTD.join('');

      var aTR = [], sTR;
      for (var idxRow = 0; idxRow < nRow; idxRow++) {
        aTR.push('<tr>' + sTD + '</tr>');
      }
      sTR = aTR.join('');
      var sTable = '<table class="table table-bordered">' + sTR + '</table>';
      (new Range()).insertNode($(sTable)[0]);
    };

    this.insertImage = function(sURL) {
      document.execCommand('insertImage', false, sURL);
    };
  };

  /**
   * Toolbar
   */
  var Toolbar = function() {
    this.update = function(welToolbar, oStyle) {
      //handle selectbox for fontsize, lineHeight
      var checkDropdownMenu = function(welBtn, nValue) {
        welBtn.find('.dropdown-menu li a').each(function() {
          var bChecked = $(this).attr('data-value') == nValue;
          this.className = bChecked ? 'checked' : '';
        });
      };
      
      var welFontsize = welToolbar.find('.note-fontsize');
      welFontsize.find('.note-current-fontsize').html(oStyle.fontSize);
      checkDropdownMenu(welFontsize, parseFloat(oStyle.fontSize));
      
      var welLineHeight = welToolbar.find('.note-line-height');
      checkDropdownMenu(welLineHeight, parseFloat(oStyle.lineHeight));
      
      //check button state
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
      var welNoteColor = $(elBtn).closest('.note-color');
      var welRecentColor = welNoteColor.find('.note-recent-color');
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
      var welLinkPopover = welPopover.find('.note-link-popover');
      if (oStyle.anchor) {
        var welAnchor = welLinkPopover.find('a');
        welAnchor.attr('href', oStyle.anchor.href).html(oStyle.anchor.href);
        
        //popover position
        var rect = oStyle.anchor.getBoundingClientRect();
        welLinkPopover.css({
          display: 'block',
          left: rect.left,
          top: $(document).scrollTop() + rect.bottom
        });
      } else {
        welLinkPopover.hide();
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
    this.showImageDialog = function(welDialog, hDropImage, fnInsertImages) {
      var welImageDialog = welDialog.find('.note-image-dialog');
      var welDropzone = welDialog.find('.note-dropzone'),
          welImageInput = welDialog.find('.note-image-input');

      welImageDialog.on('shown', function(e) {
        welDropzone.on('dragenter dragover dragleave', false);
        welDropzone.on('drop', function(e) {
          hDropImage(e); welImageDialog.modal('hide');
        });
        welImageInput.on('change', function() {
          fnInsertImages(this.files); $(this).val('');
          welImageDialog.modal('hide');
        });
      }).on('hidden', function(e) {
        welDropzone.off('dragenter dragover dragleave drop');
        welImageInput.off('change');
      }).modal('show');
    };

    this.showLinkDialog = function(welDialog, linkInfo, callback) {
      var welLinkDialog = welDialog.find('.note-link-dialog');
      var welLinkText = welLinkDialog.find('.note-link-text'),
          welLinkUrl = welLinkDialog.find('.note-link-url'),
          welLinkBtn = welLinkDialog.find('.note-link-btn');

      welLinkDialog.on('shown', function(e) {
        welLinkText.html(linkInfo.text);
        welLinkUrl.val(linkInfo.url).keyup(function(event) {
          if (welLinkUrl.val()) {
            welLinkBtn.removeClass('disabled').attr('disabled', false);
          } else {
            welLinkBtn.addClass('disabled').attr('disabled', true);
          }

          if (!linkInfo.text) {welLinkText.html(welLinkUrl.val())}
        }).trigger('focus');
        welLinkBtn.click(function(event) {
          welLinkDialog.modal('hide'); //hide and createLink (ie9+)
          callback(welLinkUrl.val());
          event.preventDefault();
        });
      }).on('hidden', function(e) {
        welLinkUrl.off('keyup');
        welLinkDialog.off('shown hidden');
        welLinkBtn.off('click');
      }).modal('show');
    };
  };
  
  /**
   * EventHandler
   *
   * handle mouse & key event on note
   */
  var EventHandler = function() {
    var editor = new Editor();
    var toolbar = new Toolbar(), popover = new Popover();
    var dialog = new Dialog();
    
    var key = { TAB: 9, B: 66, E: 69, I: 73, J: 74, K: 75, L: 76, R: 82,
                U: 85, NUM0: 48, NUM1: 49, NUM4: 52, NUM7: 55, NUM8: 56};

    var hKeydown = function(event) {
      var bCmd = bMac ? event.metaKey : event.ctrlKey;
      var bShift = event.shiftKey;
      if (bCmd && event.keyCode === key.B) { // bold
        editor.bold();
      } else if (bCmd && event.keyCode === key.I) { // italic
        editor.italic();
      } else if (bCmd && event.keyCode === key.U) { // underline
        editor.underline();
      } else if (bCmd && event.keyCode === key.K) { // showLinkDialog
        editor.setLinkDialog(function(linkInfo, cb) {
          dialog.showLinkDialog($('.note-dialog'), linkInfo, cb);
        });
      } else if (bCmd && bShift && event.keyCode === key.L) {
        editor.justifyLeft();
      } else if (bCmd && bShift && event.keyCode === key.E) {
        editor.justifyCenter();
      } else if (bCmd && bShift && event.keyCode === key.R) {
        editor.justifyRight();
      } else if (bCmd && bShift && event.keyCode === key.J) {
        editor.justifyFull();
      } else if (bCmd && bShift && event.keyCode === key.NUM7) {
        editor.insertUnorderedList(); // insertUnorderedList
      } else if (bCmd && bShift && event.keyCode === key.NUM8) {
        editor.insertOrderedList(); // insertUnorderedList
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

    var insertImages = function(files) {
      $.each(files, function(idx, file) {
        var fileReader = new FileReader;
        fileReader.onload = function(event) {
          editor.insertImage(event.target.result); // sURL
        };
        fileReader.readAsDataURL(file);
      });
    };

    var hDropImage = function(event) {
      var dataTransfer = event.originalEvent.dataTransfer;
      if (dataTransfer && dataTransfer.files) {
        insertImages(dataTransfer.files);
      }
      event.stopPropagation();
      event.preventDefault();
    };
    
    var hToolbarAndPopoverUpdate = function(event) {
      var elEditableOrToolbar = event.currentTarget || event.target;
      var welEditor = $(elEditableOrToolbar.parentNode);
      
      var oStyle = editor.currentStyle();
      toolbar.update(welEditor.find('.note-toolbar'), oStyle);
      popover.update(welEditor.find('.note-popover'), oStyle);
    };
    
    var hScroll = function(event) {
      var elEditableOrToolbar = event.currentTarget || event.target;
      var welEditor = $(elEditableOrToolbar.parentNode);
      //hide popover when scrolled
      popover.hide(welEditor.find('.note-popover'));
    };
    
    var hToolbarAndPopoverMousedown = function(event) {
      // prevent default event when insertTable (FF, Webkit)
      var welBtn = $(event.target).closest('[data-event]');
      if (welBtn.length > 0) { event.preventDefault(); }
    };
    
    var hToolbarAndPopoverClick = function(event) {
      var welBtn = $(event.target).closest('[data-event]');
      
      if (welBtn.length > 0) {
        var sEvent = welBtn.attr('data-event');
        var sValue = welBtn.attr('data-value');

        if (editor[sEvent]) { editor[sEvent](sValue); } // execute editor method
        
        // check and update recent color
        if (sEvent === "backColor" || sEvent === "foreColor") {
          toolbar.updateRecentColor(welBtn[0], sEvent, sValue);
        } else if (sEvent === "showLinkDialog") { //popover to dialog
          editor.setLinkDialog(function(linkInfo, cb) {
            dialog.showLinkDialog($('.note-dialog'), linkInfo, cb);
          });
        } else if (sEvent === "showImageDialog") {
          dialog.showImageDialog($('.note-dialog'), hDropImage, insertImages);
        }

        event.preventDefault();
        hToolbarAndPopoverUpdate(event);
      }
    };
    
    var PX_PER_EM = 18;
    var hDimensionPickerMove = function(event) {
      var welPicker = $(event.target.parentNode); // target is mousecatcher
      var welDimensionDisplay = welPicker.next();
      var welCatcher = welPicker.find('.note-dimension-picker-mousecatcher');
      var welHighlighted = welPicker.find('.note-dimension-picker-highlighted');
      var welUnhighlighted = welPicker.find('.note-dimension-picker-unhighlighted');
      var posOffset;
      // HTML5 with jQuery - e.offsetX is undefined in Firefox
      // http://stackoverflow.com/questions/12704686/html5-with-jquery-e-offsetx-is-undefined-in-firefox
      if (event.offsetX === undefined) {
        var posMousecatcher = $(event.target).offset();
        posOffset = {x: event.pageX - posMousecatcher.left,
                     y: event.pageY - posMousecatcher.top};
      } else {
        posOffset = {x: event.offsetX, y: event.offsetY};
      }
      
      var dim = {c: Math.ceil(posOffset.x / PX_PER_EM) || 1,
                 r: Math.ceil(posOffset.y / PX_PER_EM) || 1};
      welHighlighted.css({ width: dim.c +'em', height: dim.r + 'em' });
      welCatcher.attr('data-value', dim.c + 'x' + dim.r);
      
      if (5 <= dim.c && dim.c < 20) {
        welUnhighlighted.css({ width: dim.c + 1 + 'em'});
      }

      if (5 <= dim.r && dim.r < 20) {
        welUnhighlighted.css({ height: dim.r + 1 + 'em'});
      }

      welDimensionDisplay.html(dim.c + ' x ' + dim.r);
    };

    this.attach = function(layoutInfo) {
      layoutInfo.editable.on('keydown', hKeydown);
      layoutInfo.editable.on('keyup mouseup', hToolbarAndPopoverUpdate);
      layoutInfo.editable.on('scroll', hScroll);
      //TODO: handle Drag point
      layoutInfo.editable.on('dragenter dragover dragleave', false);
      layoutInfo.editable.on('drop', hDropImage);

      layoutInfo.toolbar.on('click', hToolbarAndPopoverClick);
      layoutInfo.popover.on('click', hToolbarAndPopoverClick);
      layoutInfo.toolbar.on('mousedown', hToolbarAndPopoverMousedown);
      layoutInfo.popover.on('mousedown', hToolbarAndPopoverMousedown);
      
      //toolbar table dimension
      var welToolbar = layoutInfo.toolbar;
      var welCatcher = welToolbar.find('.note-dimension-picker-mousecatcher');
      welCatcher.on('mousemove', hDimensionPickerMove);
    };

    this.dettach = function(layoutInfo) {
      layoutInfo.editable.off();
      layoutInfo.toolbar.off();
      layoutInfo.popover.off();
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
                       '<button class="btn btn-small" title="Picture" data-event="showImageDialog"><i class="icon-picture"></i></button>' +
                       '<button class="btn btn-small" title="Link" data-event="showLinkDialog" data-shortcut="Ctrl+K" data-mac-shortcut="⌘+K" ><i class="icon-link"></i></button>' +
                     '</div>' +
                     '<div class="note-table btn-group">' +
                       '<button class="btn btn-small dropdown-toggle" title="Table" data-toggle="dropdown"><i class="icon-table"></i> <span class="caret"></span></button>' +
                        '<ul class="dropdown-menu">' +
                          '<div class="note-dimension-picker">' +
                            '<div class="note-dimension-picker-mousecatcher" data-event="insertTable" data-value="1x1"></div>' +
                            '<div class="note-dimension-picker-highlighted"></div>' +
                            '<div class="note-dimension-picker-unhighlighted"></div>' +
                          '</div>' +
                          '<div class="note-dimension-display"> 1 x 1 </div>' +
                        '</ul>' +
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
                     '<div class="note-fontsize btn-group">' +
                       '<button class="btn btn-small dropdown-toggle" data-toggle="dropdown" title="Font Size"><span class="note-current-fontsize">11</span> <b class="caret"></b></button>' +
                       '<ul class="dropdown-menu">' +
                         '<li><a href="#" data-event="fontSize" data-value="8"><i class="icon-ok"></i> 8</a></li>' +
                         '<li><a href="#" data-event="fontSize" data-value="9"><i class="icon-ok"></i> 9</a></li>' +
                         '<li><a href="#" data-event="fontSize" data-value="10"><i class="icon-ok"></i> 10</a></li>' +
                         '<li><a href="#" data-event="fontSize" data-value="11"><i class="icon-ok"></i> 11</a></li>' +
                         '<li><a href="#" data-event="fontSize" data-value="12"><i class="icon-ok"></i> 12</a></li>' +
                         '<li><a href="#" data-event="fontSize" data-value="14"><i class="icon-ok"></i> 14</a></li>' +
                         '<li><a href="#" data-event="fontSize" data-value="18"><i class="icon-ok"></i> 18</a></li>' +
                         '<li><a href="#" data-event="fontSize" data-value="24"><i class="icon-ok"></i> 24</a></li>' +
                         '<li><a href="#" data-event="fontSize" data-value="36"><i class="icon-ok"></i> 36</a></li>' +
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
                       '<button class="btn btn-small" title="Remove Font Style" data-event="removeFormat"><i class="icon-eraser"></i></button>' +
                     '</div>' +
                     '<div class="note-para btn-group">' +
                       '<button class="btn btn-small" title="Unordered list" data-shortcut="Ctrl+Shift+8" data-mac-shortcut="⌘+⇧+7" data-event="insertUnorderedList"><i class="icon-list-ul"></i></button>' +
                       '<button class="btn btn-small" title="Ordered list" data-shortcut="Ctrl+Shift+7" data-mac-shortcut="⌘+⇧+8" data-event="insertOrderedList"><i class="icon-list-ol"></i></button>' +
                       '<button class="btn btn-small dropdown-toggle" title="Paragraph" data-toggle="dropdown"><i class="icon-align-left"></i>  <span class="caret"></span></button>' +
                       '<ul class="dropdown-menu right">' +
                         '<li>' +
                           '<div class="note-align btn-group">' +
                             '<button class="btn btn-small" title="Align left" data-shortcut="Ctrl+Shift+L" data-mac-shortcut="⌘+⇧+L" data-event="justifyLeft"><i class="icon-align-left"></i></button>' +
                             '<button class="btn btn-small" title="Align center" data-shortcut="Ctrl+Shift+E" data-mac-shortcut="⌘+⇧+E" data-event="justifyCenter"><i class="icon-align-center"></i></button>' +
                             '<button class="btn btn-small" title="Align right" data-shortcut="Ctrl+Shift+R" data-mac-shortcut="⌘+⇧+R" data-event="justifyRight"><i class="icon-align-right"></i></button>' +
                             '<button class="btn btn-small" title="Justify full" data-shortcut="Ctrl+Shift+J" data-mac-shortcut="⌘+⇧+J" data-event="justifyFull"><i class="icon-align-justify"></i></button>' +
                           '</div>' +
                         '</li>' +
                         '<li>' +
                           '<div class="note-list btn-group">' +
                             '<button class="btn btn-small" title="Outdent" data-shortcut="Shift+TAB" data-mac-shortcut="⇧+TAB" data-event="outdent"><i class="icon-indent-left"></i></button>' +
                             '<button class="btn btn-small" title="Indent" data-shortcut="TAB" data-mac-shortcut="TAB" data-event="indent"><i class="icon-indent-right"></i></button>' +
                         '</li>' +
                       '</ul>' +
                     '</div>' +
                     '<div class="note-line-height btn-group">' +
                       '<button class="btn btn-small dropdown-toggle" data-toggle="dropdown" title="Line Height"><i class="icon-text-height"></i>&nbsp; <b class="caret"></b></button>' +
                       '<ul class="dropdown-menu right">' +
                       '<li><a href="#" data-event="lineHeight" data-value="1.0"><i class="icon-ok"></i> 1.0</a></li>' +
                       '<li><a href="#" data-event="lineHeight" data-value="1.2"><i class="icon-ok"></i> 1.2</a></li>' +
                       '<li><a href="#" data-event="lineHeight" data-value="1.4"><i class="icon-ok"></i> 1.4</a></li>' +
                       '<li><a href="#" data-event="lineHeight" data-value="1.5"><i class="icon-ok"></i> 1.5</a></li>' +
                       '<li><a href="#" data-event="lineHeight" data-value="1.6"><i class="icon-ok"></i> 1.6</a></li>' +
                       '<li><a href="#" data-event="lineHeight" data-value="1.8"><i class="icon-ok"></i> 1.8</a></li>' +
                       '<li><a href="#" data-event="lineHeight" data-value="2.0"><i class="icon-ok"></i> 2.0</a></li>' +
                       '<li><a href="#" data-event="lineHeight" data-value="3.0"><i class="icon-ok"></i> 3.0</a></li>' +
                       '</ul>' +
                     '</div>' +
                   '</div>';
    var sPopover = '<div class="note-popover">' +
                     '<div class="note-link-popover popover fade bottom in" style="display: none;">' +
                       '<div class="arrow"></div>' +
                       '<div class="popover-content note-link-content">' +
                         '<a href="http://www.google.com" target="_blank">www.google.com</a>&nbsp;&nbsp;' +
                         '<div class="note-insert btn-group">' +
                           '<button class="btn btn-small" title="Edit" data-event="showLinkDialog"><i class="icon-edit"></i></button>' +
                           '<button class="btn btn-small" title="Unlink" data-event="unlink"><i class="icon-unlink"></i></button>' +
                         '</div>' +
                       '</div>' +
                     '</div>' +
                   '</div>';
    var sDialog = '<div class="note-dialog">' +
                    '<div class="note-image-dialog modal hide in" aria-hidden="false">' +
                      '<div class="modal-header">' +
                        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>' +
                        '<h4>Insert Image</h4>' +
                      '</div>' +
                      '<div class="modal-body">' +
                        '<div class="row-fluid">' +
                          '<div class="note-dropzone span12">Drag an image here</div>' +
                          '<div>or if you prefer...</div>' +
                          '<input class="note-image-input" type="file" class="note-link-url" type="text" />' +
                        '</div>' +
                      '</div>' +
                    '</div>' +
                    '<div class="note-link-dialog modal hide in" aria-hidden="false">' +
                      '<div class="modal-header">' +
                        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>' +
                        '<h4>Edit Link</h4>' +
                      '</div>' +
                      '<div class="modal-body">' +
                        '<div class="row-fluid">' +
                          '<label>Text to display</label>' +
                          '<span class="note-link-text input-xlarge uneditable-input" />' +
                          '<label>To what URL should this link go?</label>' +
                          '<input class="note-link-url span12" type="text" />' +
                        '</div>' +
                      '</div>' +
                      '<div class="modal-footer">' +
                        '<a href="#" class="btn disabled note-link-btn" disabled="disabled">Link</a>' +
                      '</div>' +
                    '</div>' +
                  '</div>';
                        
    // createTooltip
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
    
    // createPalette
    var createPalette = function(welContainer) {
      welContainer.find('.note-color-palette').each(function() {
        var welPalette = $(this), sEvent = welPalette.attr('data-target-event');
        var sPaletteContents = '';
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
    
    // createLayout
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
    
    // layoutInfo
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
    
    // removeLayout
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
   * extend jquery fn
   */
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
    },
    // inner object for test
    summernoteInner : function() {
      return { dom: dom, list: list, func: func };
    }
  });
})(jQuery); // jQuery
