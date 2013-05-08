/**
 * renderer.js
 * (c) 2013~ Youngteac Hong
 * summernote may be freely distributed under the MIT license./
 */
"use strict";
define('renderer', [], function() {
  var sToolbar = '<div class="note-toolbar btn-toolbar">' + 
                   '<div class="note-style btn-group">' +
                     '<button class="btn btn-small"><i class="icon-bold"></i></button>' +
                     '<button class="btn btn-small"><i class="icon-italic"></i></button>' +
                     '<button class="btn btn-small"><i class="icon-underline"></i></button>' +
                   '</div>' +
                   '<div class="note-para btn-group">' +
                     '<button class="btn btn-small"><i class="icon-align-left"></i></button>' +
                     '<button class="btn btn-small"><i class="icon-align-center"></i></button>' +
                     '<button class="btn btn-small"><i class="icon-align-right"></i></button>' +
                   '</div>' +
                   '<div class="note-list btn-group">' +
                     '<button class="btn btn-small"><i class="icon-list-ul"></i></button>' +
                     '<button class="btn btn-small"><i class="icon-list-ol"></i></button>' +
                     '<button class="btn btn-small"><i class="icon-indent-left"></i></button>' +
                     '<button class="btn btn-small"><i class="icon-indent-right"></i></button>' +
                   '</div>' +
                   '<div class="note-insert btn-group">' +
                     '<button class="btn btn-small"><i class="icon-picture"></i></button>' +
                     '<button class="btn btn-small"><i class="icon-link"></i></button>' +
                     '<button class="btn btn-small"><i class="icon-table"></i></button>' +
                   '</div>' +
                 '</div>';
 
  var $ = jQuery;
  
  /**
   * createLayout
   */
  var createLayout = function(welHolder) {
    //already created
    if (welHolder.next().hasClass('note-editor')) { return; }
    
    //01. create Editor
    var welEditor = $('<div class="note-editor"></div>');

    //02. create Editable
    var welEditable = $('<div class="note-editable" contentEditable="true"></div>').prependTo(welEditor);
    welEditable.html(welHolder.html());
    
    //03. create Toolbar
    var welToolbar = $(sToolbar).prependTo(welEditor);
    
    //04. Editor/Holder switch
    welEditor.insertAfter(welHolder);
    welHolder.hide();
  };
  
  /**
   * layoutInfo
   */
  var layoutInfo = function(welHolder) {
    var welEditor = welHolder.next();
    if (!welEditor.hasClass('note-editor')) { return; }
    
    // editorInfo
    return {
      editor: welEditor,
      editable: welEditor.find('.note-editable'),
      toolbar: welEditor.find('.note-toolbar')
    }
  };
  
  /**
   * removeLayout
   */
  var removeLayout = function(welHolder) {
    var info = layoutInfo(welHolder);
    if (!info) { return; }
    welHolder.html(info.editable.html());
    
    info.editor.remove();
    welHolder.show();
  };

  return {
    createLayout: createLayout,
    removeLayout: removeLayout,
    layoutInfo: layoutInfo
  }
});
