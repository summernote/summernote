define([
  'core/agent', 'core/dom', 'editing/History', 'Locale'
], function (agent, dom, History, Locale) {
  /**
   * Renderer
   *
   * rendering toolbar and editable
   */
  var Renderer = function () {
    var aToolbarItem, sPopover, sHandle, sDialog, sStatusbar;

    /* jshint ignore:start */
    aToolbarItem = {
      picture: function(locale) {
        return '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.image.image + '" data-event="showImageDialog" tabindex="-1"><i class="fa fa-picture-o icon-picture"></i></button>';
      },
      link: function(locale) {
        return '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.link.link + '" data-event="showLinkDialog" data-shortcut="Ctrl+K" data-mac-shortcut="⌘+K" tabindex="-1"><i class="fa fa-link icon-link"></i></button>';
      },
      video: function(locale){
          return '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.video.video + '" data-event="showVideoDialog" tabindex="-1"><i class="fa fa-youtube-play icon-play"></i></button>';
      },
      table: function(locale) {
        return '<button type="button" class="btn btn-default btn-sm btn-small dropdown-toggle" title="' + locale.table.table + '" data-toggle="dropdown" tabindex="-1"><i class="fa fa-table icon-table"></i> <span class="caret"></span></button>' +
        '<ul class="dropdown-menu">' +
        '<div class="note-dimension-picker">' +
        '<div class="note-dimension-picker-mousecatcher" data-event="insertTable" data-value="1x1"></div>' +
        '<div class="note-dimension-picker-highlighted"></div>' +
        '<div class="note-dimension-picker-unhighlighted"></div>' +
        '</div>' +
        '<div class="note-dimension-display"> 1 x 1 </div>' +
        '</ul>';
      },
      style: function(locale) {
        return '<button type="button" class="btn btn-default btn-sm btn-small dropdown-toggle" title="' + locale.style.style + '" data-toggle="dropdown" tabindex="-1"><i class="fa fa-magic icon-magic"></i> <span class="caret"></span></button>' +
        '<ul class="dropdown-menu">' +
        '<li><a data-event="formatBlock" data-value="p">' + locale.style.normal + '</a></li>' +
        '<li><a data-event="formatBlock" data-value="blockquote"><blockquote>' + locale.style.blockquote + '</blockquote></a></li>' +
        '<li><a data-event="formatBlock" data-value="pre">' + locale.style.pre + '</a></li>' +
        '<li><a data-event="formatBlock" data-value="h1"><h1>' + locale.style.h1 + '</h1></a></li>' +
        '<li><a data-event="formatBlock" data-value="h2"><h2>' + locale.style.h2 + '</h2></a></li>' +
        '<li><a data-event="formatBlock" data-value="h3"><h3>' + locale.style.h3 + '</h3></a></li>' +
        '<li><a data-event="formatBlock" data-value="h4"><h4>' + locale.style.h4 + '</h4></a></li>' +
        '<li><a data-event="formatBlock" data-value="h5"><h5>' + locale.style.h5 + '</h5></a></li>' +
        '<li><a data-event="formatBlock" data-value="h6"><h6>' + locale.style.h6 + '</h6></a></li>' +
        '</ul>';
      },
      fontsize: function(locale) {
        return '<button type="button" class="btn btn-default btn-sm btn-small dropdown-toggle" data-toggle="dropdown" title="' + locale.font.size + '" tabindex="-1"><span class="note-current-fontsize">11</span> <b class="caret"></b></button>' +
        '<ul class="dropdown-menu">' +
        '<li><a data-event="fontSize" data-value="8"><i class="fa fa-check icon-ok"></i> 8</a></li>' +
        '<li><a data-event="fontSize" data-value="9"><i class="fa fa-check icon-ok"></i> 9</a></li>' +
        '<li><a data-event="fontSize" data-value="10"><i class="fa fa-check icon-ok"></i> 10</a></li>' +
        '<li><a data-event="fontSize" data-value="11"><i class="fa fa-check icon-ok"></i> 11</a></li>' +
        '<li><a data-event="fontSize" data-value="12"><i class="fa fa-check icon-ok"></i> 12</a></li>' +
        '<li><a data-event="fontSize" data-value="14"><i class="fa fa-check icon-ok"></i> 14</a></li>' +
        '<li><a data-event="fontSize" data-value="18"><i class="fa fa-check icon-ok"></i> 18</a></li>' +
        '<li><a data-event="fontSize" data-value="24"><i class="fa fa-check icon-ok"></i> 24</a></li>' +
        '<li><a data-event="fontSize" data-value="36"><i class="fa fa-check icon-ok"></i> 36</a></li>' +
        '</ul>';
      },
      color: function(locale) {
        return '<button type="button" class="btn btn-default btn-sm btn-small note-recent-color" title="' + locale.color.recent + '" data-event="color" data-value=\'{"backColor":"yellow"}\' tabindex="-1"><i class="fa fa-font icon-font" style="color:black;background-color:yellow;"></i></button>' +
        '<button type="button" class="btn btn-default btn-sm btn-small dropdown-toggle" title="' + locale.color.more + '" data-toggle="dropdown" tabindex="-1">' +
        '<span class="caret"></span>' +
        '</button>' +
        '<ul class="dropdown-menu">' +
        '<li>' +
        '<div class="btn-group">' +
        '<div class="note-palette-title">' + locale.color.background + '</div>' +
        '<div class="note-color-reset" data-event="backColor" data-value="inherit" title="' + locale.color.transparent + '">' + locale.color.setTransparent + '</div>' +
        '<div class="note-color-palette" data-target-event="backColor"></div>' +
        '</div>' +
        '<div class="btn-group">' +
        '<div class="note-palette-title">' + locale.color.foreground + '</div>' +
        '<div class="note-color-reset" data-event="foreColor" data-value="inherit" title="' + locale.color.reset + '">' + locale.color.resetToDefault + '</div>' +
        '<div class="note-color-palette" data-target-event="foreColor"></div>' +
        '</div>' +
        '</li>' +
        '</ul>';
      },
      bold: function(locale) {
        return '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.font.bold + '" data-shortcut="Ctrl+B" data-mac-shortcut="⌘+B" data-event="bold" tabindex="-1"><i class="fa fa-bold icon-bold"></i></button>';
      },
      italic: function(locale) {
        return '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.font.italic + '" data-shortcut="Ctrl+I" data-mac-shortcut="⌘+I" data-event="italic" tabindex="-1"><i class="fa fa-italic icon-italic"></i></button>';
      },
      underline: function(locale) {
        return '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.font.underline + '" data-shortcut="Ctrl+U" data-mac-shortcut="⌘+U" data-event="underline" tabindex="-1"><i class="fa fa-underline icon-underline"></i></button>';
      },
      clear: function(locale) {
        return '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.font.clear + '" data-shortcut="Ctrl+\\" data-mac-shortcut="⌘+\\" data-event="removeFormat" tabindex="-1"><i class="fa fa-eraser icon-eraser"></i></button>';
      },
      ul: function(locale) {
        return '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.lists.unordered + '" data-shortcut="Ctrl+Shift+8" data-mac-shortcut="⌘+⇧+7" data-event="insertUnorderedList" tabindex="-1"><i class="fa fa-list-ul icon-list-ul"></i></button>';
      },
      ol: function(locale) {
        return '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.lists.ordered + '" data-shortcut="Ctrl+Shift+7" data-mac-shortcut="⌘+⇧+8" data-event="insertOrderedList" tabindex="-1"><i class="fa fa-list-ol icon-list-ol"></i></button>';
      },
      paragraph: function(locale) {
        return '<button type="button" class="btn btn-default btn-sm btn-small dropdown-toggle" title="' + locale.paragraph.paragraph + '" data-toggle="dropdown" tabindex="-1"><i class="fa fa-align-left icon-align-left"></i>  <span class="caret"></span></button>' +
        '<ul class="dropdown-menu">' +
          '<li>' +
          '<div class="note-align btn-group">' +
          '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.paragraph.left + '" data-shortcut="Ctrl+Shift+L" data-mac-shortcut="⌘+⇧+L" data-event="justifyLeft" tabindex="-1"><i class="fa fa-align-left icon-align-left"></i></button>' +
          '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.paragraph.center + '" data-shortcut="Ctrl+Shift+E" data-mac-shortcut="⌘+⇧+E" data-event="justifyCenter" tabindex="-1"><i class="fa fa-align-center icon-align-center"></i></button>' +
          '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.paragraph.right + '" data-shortcut="Ctrl+Shift+R" data-mac-shortcut="⌘+⇧+R" data-event="justifyRight" tabindex="-1"><i class="fa fa-align-right icon-align-right"></i></button>' +
          '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.paragraph.justify + '" data-shortcut="Ctrl+Shift+J" data-mac-shortcut="⌘+⇧+J" data-event="justifyFull" tabindex="-1"><i class="fa fa-align-justify icon-align-justify"></i></button>' +
          '</div>' +
          '</li>' +
          '<li>' +
          '<div class="note-list btn-group">' +
          '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.paragraph.outdent + '" data-shortcut="Ctrl+[" data-mac-shortcut="⌘+[" data-event="outdent" tabindex="-1"><i class="fa fa-outdent icon-indent-left"></i></button>' +
          '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.paragraph.indent + '" data-shortcut="Ctrl+]" data-mac-shortcut="⌘+]" data-event="indent" tabindex="-1"><i class="fa fa-indent icon-indent-right"></i></button>' +
          '</li>' +
        '</ul>';
      },
      height: function(locale) {
        return '<button type="button" class="btn btn-default btn-sm btn-small dropdown-toggle" data-toggle="dropdown" title="' + locale.font.height + '" tabindex="-1"><i class="fa fa-text-height icon-text-height"></i>&nbsp; <b class="caret"></b></button>' +
        '<ul class="dropdown-menu">' +
        '<li><a data-event="lineHeight" data-value="1.0"><i class="fa fa-check icon-ok"></i> 1.0</a></li>' +
        '<li><a data-event="lineHeight" data-value="1.2"><i class="fa fa-check icon-ok"></i> 1.2</a></li>' +
        '<li><a data-event="lineHeight" data-value="1.4"><i class="fa fa-check icon-ok"></i> 1.4</a></li>' +
        '<li><a data-event="lineHeight" data-value="1.5"><i class="fa fa-check icon-ok"></i> 1.5</a></li>' +
        '<li><a data-event="lineHeight" data-value="1.6"><i class="fa fa-check icon-ok"></i> 1.6</a></li>' +
        '<li><a data-event="lineHeight" data-value="1.8"><i class="fa fa-check icon-ok"></i> 1.8</a></li>' +
        '<li><a data-event="lineHeight" data-value="2.0"><i class="fa fa-check icon-ok"></i> 2.0</a></li>' +
        '<li><a data-event="lineHeight" data-value="3.0"><i class="fa fa-check icon-ok"></i> 3.0</a></li>' +
        '</ul>';
      },
      help: function(locale) {
        return '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.options.help + '" data-shortcut="Ctrl+/" data-mac-shortcut="⌘+/" data-event="showHelpDialog" tabindex="-1"><i class="fa fa-question icon-question"></i></button>';
      },
      fullscreen: function(locale) {
        return '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.options.fullscreen + '" data-event="fullscreen" tabindex="-1"><i class="fa fa-arrows-alt icon-fullscreen"></i></button>';
      },
      codeview: function(locale) {
        return '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.options.codeview + '" data-event="codeview" tabindex="-1"><i class="fa fa-code icon-code"></i></button>';
      }
    };
    sPopover = function(locale) {
      return '<div class="note-popover">' +
                '<div class="note-link-popover popover bottom in" style="display: none;">' +
                  '<div class="arrow"></div>' +
                  '<div class="popover-content note-link-content">' +
                    '<a href="http://www.google.com" target="_blank">www.google.com</a>&nbsp;&nbsp;' +
                    '<div class="note-insert btn-group">' +
                    '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.link.edit + '" data-event="showLinkDialog" tabindex="-1"><i class="fa fa-edit icon-edit"></i></button>' +
                    '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.link.unlink + '" data-event="unlink" tabindex="-1"><i class="fa fa-unlink icon-unlink"></i></button>' +
                    '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.video.videoLink +'" data-event="showVideoDialog" tabindex="-1"><i class="fa fa-youtube-play icon-play"></i></button>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
                '<div class="note-image-popover popover bottom in" style="display: none;">' +
                  '<div class="arrow"></div>' +
                  '<div class="popover-content note-image-content">' +
                    '<div class="btn-group">' +
                      '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.image.resizeFull + '" data-event="resize" data-value="1" tabindex="-1"><span class="note-fontsize-10">100%</span> </button>' +
                      '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.image.resizeHalf + '" data-event="resize" data-value="0.5" tabindex="-1"><span class="note-fontsize-10">50%</span> </button>' +
                      '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.image.resizeQuarter + '" data-event="resize" data-value="0.25" tabindex="-1"><span class="note-fontsize-10">25%</span> </button>' +
                    '</div>' +
                    '<div class="btn-group">' +
                      '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.image.floatLeft + '" data-event="floatMe" data-value="left" tabindex="-1"><i class="fa fa-align-left icon-align-left"></i></button>' +
                      '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.image.floatRight + '" data-event="floatMe" data-value="right" tabindex="-1"><i class="fa fa-align-right icon-align-right"></i></button>' +
                      '<button type="button" class="btn btn-default btn-sm btn-small" title="' + locale.image.floatNone + '" data-event="floatMe" data-value="none" tabindex="-1"><i class="fa fa-align-justify icon-align-justify"></i></button>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>';
    };

    sHandle = '<div class="note-handle">' +
                '<div class="note-control-selection">' +
                  '<div class="note-control-selection-bg"></div>' +
                  '<div class="note-control-holder note-control-nw"></div>' +
                  '<div class="note-control-holder note-control-ne"></div>' +
                  '<div class="note-control-holder note-control-sw"></div>' +
                  '<div class="note-control-sizing note-control-se"></div>' +
                  '<div class="note-control-selection-info"></div>' +
                '</div>' +
              '</div>';

    var sShortcutText = function(locale) {
      return '<table class="note-shortcut">' +
               '<thead>' +
                 '<tr><th></th><th>' + locale.shortcut.textFormatting + '</th></tr>' +
               '</thead>' +
               '<tbody>' +
                 '<tr><td>⌘ + B</td><td>' + locale.font.bold + '</td></tr>' +
                 '<tr><td>⌘ + I</td><td>' + locale.font.italic + '</td></tr>' +
                 '<tr><td>⌘ + U</td><td>' + locale.font.underline + '</td></tr>' +
                 '<tr><td>⌘ + ⇧ + S</td><td>' + locale.font.strike + '</td></tr>' +
                 '<tr><td>⌘ + \\</td><td>' + locale.font.clear + '</td></tr>' +
                 '</tr>' +
               '</tbody>' +
             '</table>';
    };

    var sShortcutAction = function(locale) {
      return '<table class="note-shortcut">' +
               '<thead>' +
                 '<tr><th></th><th>' + locale.shortcut.action + '</th></tr>' +
               '</thead>' +
               '<tbody>' +
                 '<tr><td>⌘ + Z</td><td>' + locale.history.undo + '</td></tr>' +
                 '<tr><td>⌘ + ⇧ + Z</td><td>' + locale.history.redo + '</td></tr>' +
                 '<tr><td>⌘ + ]</td><td>' + locale.paragraph.indent + '</td></tr>' +
                 '<tr><td>⌘ + [</td><td>' + locale.paragraph.outdent + '</td></tr>' +
                 '<tr><td>⌘ + K</td><td>' + locale.link.insert + '</td></tr>' +
                 '<tr><td>⌘ + ENTER</td><td>' + locale.hr.insert + '</td></tr>' +
               '</tbody>' +
             '</table>';
    };

    var sShortcutPara = function(locale) {
      return '<table class="note-shortcut">' +
                '<thead>' +
                  '<tr><th></th><th>' + locale.shortcut.paragraphFormatting + '</th></tr>' +
                '</thead>' +
                '<tbody>' +
                  '<tr><td>⌘ + ⇧ + L</td><td>' + locale.paragraph.left + '</td></tr>' +
                  '<tr><td>⌘ + ⇧ + E</td><td>' + locale.paragraph.center + '</td></tr>' +
                  '<tr><td>⌘ + ⇧ + R</td><td>' + locale.paragraph.right + '</td></tr>' +
                  '<tr><td>⌘ + ⇧ + J</td><td>' + locale.paragraph.justify + '</td></tr>' +
                  '<tr><td>⌘ + ⇧ + NUM7</td><td>' + locale.lists.ordered + '</td></tr>' +
                  '<tr><td>⌘ + ⇧ + NUM8</td><td>' + locale.lists.unordered + '</td></tr>' +
                '</tbody>' +
              '</table>';
    };

    var sShortcutStyle = function(locale) {
      return '<table class="note-shortcut">' +
               '<thead>' +
                 '<tr><th></th><th>' + locale.shortcut.documentStyle + '</th></tr>' +
               '</thead>' +
               '<tbody>' +
                 '<tr><td>⌘ + NUM0</td><td>' + locale.style.normal + '</td></tr>' +
                 '<tr><td>⌘ + NUM1</td><td>' + locale.style.h1 + '</td></tr>' +
                 '<tr><td>⌘ + NUM2</td><td>' + locale.style.h2 + '</td></tr>' +
                 '<tr><td>⌘ + NUM3</td><td>' + locale.style.h3 + '</td></tr>' +
                 '<tr><td>⌘ + NUM4</td><td>' + locale.style.h4 + '</td></tr>' +
                 '<tr><td>⌘ + NUM5</td><td>' + locale.style.h5 + '</td></tr>' +
                 '<tr><td>⌘ + NUM6</td><td>' + locale.style.h6 + '</td></tr>' +
               '</tbody>' +
             '</table>';
    };

    var sShortcutTable = function(locale) {
      return '<table class="note-shortcut-layout">' +
               '<tbody>' +
                 '<tr><td>' + sShortcutAction(locale) + '</td><td>' + sShortcutText(locale) + '</td></tr>' +
                 '<tr><td>' + sShortcutStyle(locale) + '</td><td>' + sShortcutPara(locale) + '</td></tr>' +
               '</tbody>' +
             '</table>';
    };

    var replaceMacKeys = function (sHtml) {
        return sHtml.replace(/⌘/g, 'Ctrl').replace(/⇧/g, 'Shift');
    };

    var sDialog = function(locale) {
      return '<div class="note-dialog">' +
               '<div class="note-image-dialog modal" aria-hidden="false">' +
                 '<div class="modal-dialog">' +
                   '<div class="modal-content">' +
                     '<div class="modal-header">' +
                       '<button type="button" class="close" aria-hidden="true" tabindex="-1">×</button>' +
                       '<h4>' + locale.image.insert + '</h4>' +
                     '</div>' +
                     '<div class="modal-body">' +
                       '<div class="row-fluid">' +
                         '<h5>' + locale.image.selectFromFiles + '</h5>' +
                         '<input class="note-image-input" type="file" name="files" accept="image/*" />' +
                         '<h5>' + locale.image.url + '</h5>' +
                         '<input class="note-image-url form-control span12" type="text" />' +
                       '</div>' +
                     '</div>' +
                     '<div class="modal-footer">' +
                       '<button href="#" class="btn btn-primary note-image-btn disabled" disabled="disabled">' + locale.image.insert + '</button>' +
                     '</div>' +
                   '</div>' +
                 '</div>' +
               '</div>' +
               '<div class="note-link-dialog modal" aria-hidden="false">' +
                 '<div class="modal-dialog">' +
                   '<div class="modal-content">' +
                     '<div class="modal-header">' +
                       '<button type="button" class="close" aria-hidden="true" tabindex="-1">×</button>' +
                       '<h4>' + locale.link.insert + '</h4>' +
                     '</div>' +
                     '<div class="modal-body">' +
                       '<div class="row-fluid">' +

                       '<div class="form-group">' +
                         '<label>' + locale.link.textToDisplay + '</label>' +
                         '<span class="note-link-text form-control input-xlarge uneditable-input" />' +
                       '</div>' +
                       '<div class="form-group">' +
                         '<label>' + locale.link.url + '</label>' +
                         '<input class="note-link-url form-control span12" type="text" />' +
                       '</div>' +
                       '</div>' +
                     '</div>' +
                     '<div class="modal-footer">' +
                       '<button href="#" class="btn btn-primary note-link-btn disabled" disabled="disabled">' + locale.link.insert + '</button>' +
                     '</div>' +
                   '</div>' +
                 '</div>' +
               '</div>' +
                   '<div class="note-video-dialog modal" aria-hidden="false">' +
                     '<div class="modal-dialog">' +
                       '<div class="modal-content">' +
                         '<div class="modal-header">' +
                           '<button type="button" class="close" aria-hidden="true" tabindex="-1">×</button>' +
                           '<h4>' + locale.video.insert +'</h4>' +
                         '</div>' +
                         '<div class="modal-body">' +
                           '<div class="row-fluid">' +

                           '<div class="form-group">' +
                             '<label>' + locale.video.url + '</label>&nbsp;<small class="text-muted">' + locale.video.providers + '</small>' +
                             '<input class="note-video-url form-control span12" type="text" />' +
                           '</div>' +
                           '</div>' +
                         '</div>' +
                         '<div class="modal-footer">' +
                           '<button href="#" class="btn btn-primary note-video-btn disabled" disabled="disabled">' + locale.video.insert + '</button>' +
                         '</div>' +
                       '</div>' +
                     '</div>' +
                   '</div>' +
               '<div class="note-help-dialog modal" aria-hidden="false">' +
                 '<div class="modal-dialog">' +
                   '<div class="modal-content">' +
                     '<div class="modal-body">' +
                       '<div class="modal-background">' +
                       '<a class="modal-close pull-right" aria-hidden="true" tabindex="-1">' + locale.shortcut.close + '</a>' +
                       '<div class="title">' + locale.shortcut.shortcuts + '</div>' +
                       (agent.bMac ? sShortcutTable(locale) : replaceMacKeys(sShortcutTable(locale))) +
                       '<p class="text-center"><a href="//hackerwins.github.io/summernote/" target="_blank">Summernote v0.4</a> · <a href="//github.com/HackerWins/summernote" target="_blank">Project</a> · <a href="//github.com/HackerWins/summernote/issues" target="_blank">Issues</a></p>' +
                     '</div>' +
                   '</div>' +
                 '</div>' +
               '</div>' +
             '</div>';
    };

    sStatusbar = '<div class="note-resizebar"><div class="note-icon-bar"></div><div class="note-icon-bar"></div><div class="note-icon-bar"></div></div>';
    /* jshint ignore:end */

    // createTooltip
    var createTooltip = function ($container, sPlacement) {
      $container.find('button').each(function (i, elBtn) {
        var $btn = $(elBtn);
        var sShortcut = $btn.attr(agent.bMac ? 'data-mac-shortcut': 'data-shortcut');
        if (sShortcut) { $btn.attr('title', function (i, v) { return v + ' (' + sShortcut + ')'; }); }
      // bootstrap tooltip on btn-group bug: https://github.com/twitter/bootstrap/issues/5687
      }).tooltip({container: 'body', placement: sPlacement || 'top'});
    };

    // pallete colors
    var aaColor = [
      ['#000000', '#424242', '#636363', '#9C9C94', '#CEC6CE', '#EFEFEF', '#F7F7F7', '#FFFFFF'],
      ['#FF0000', '#FF9C00', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#9C00FF', '#FF00FF'],
      ['#F7C6CE', '#FFE7CE', '#FFEFC6', '#D6EFD6', '#CEDEE7', '#CEE7F7', '#D6D6E7', '#E7D6DE'],
      ['#E79C9C', '#FFC69C', '#FFE79C', '#B5D6A5', '#A5C6CE', '#9CC6EF', '#B5A5D6', '#D6A5BD'],
      ['#E76363', '#F7AD6B', '#FFD663', '#94BD7B', '#73A5AD', '#6BADDE', '#8C7BC6', '#C67BA5'],
      ['#CE0000', '#E79439', '#EFC631', '#6BA54A', '#4A7B8C', '#3984C6', '#634AA5', '#A54A7B'],
      ['#9C0000', '#B56308', '#BD9400', '#397B21', '#104A5A', '#085294', '#311873', '#731842'],
      ['#630000', '#7B3900', '#846300', '#295218', '#083139', '#003163', '#21104A', '#4A1031']
    ];

    // createPalette
    var createPalette = function ($container) {
      $container.find('.note-color-palette').each(function () {
        var $palette = $(this), sEvent = $palette.attr('data-target-event');
        var sPaletteContents = '';
        for (var row = 0, szRow = aaColor.length; row < szRow; row++) {
          var aColor = aaColor[row];
          var sLine = '<div>';
          for (var col = 0, szCol = aColor.length; col < szCol; col++) {
            var sColor = aColor[col];
            var sButton = ['<button type="button" class="note-color-btn" style="background-color:', sColor,
                           ';" data-event="', sEvent,
                           '" data-value="', sColor,
                           '" title="', sColor,
                           '" data-toggle="button" tabindex="-1"></button>'].join('');
            sLine += sButton;
          }
          sLine += '</div>';
          sPaletteContents += sLine;
        }
        $palette.html(sPaletteContents);
      });
    };

    // createLayout
    this.createLayout = function ($holder, options) {
      var nHeight = options.height,
          nTabsize = options.tabsize,
          aToolbarSetting = options.toolbar;

      //already created
      if ($holder.next().hasClass('note-editor')) { return; }

      //01. create Editor
      var $editor = $('<div class="note-editor"></div>');
      $editor.data('options', options);

      //02. statusbar
      if (nHeight > 0) {
        $('<div class="note-statusbar">' + sStatusbar + '</div>').prependTo($editor);
      }

      //03. create Editable
      var $editable = $('<div class="note-editable" contentEditable="true"></div>').prependTo($editor);
      if (nHeight) {
        $editable.height(nHeight);
        $editable.data('optionHeight', nHeight);
      }
      if (nTabsize) {
        $editable.data('tabsize', nTabsize);
      }

      $editable.html(dom.html($holder) || dom.emptyPara);
      $editable.data('NoteHistory', new History());

      //031. create codable
      $('<textarea class="note-codable"></textarea>').prependTo($editor);

      //032. set styleWithCSS for backColor / foreColor clearing with 'inherit'.
      setTimeout(function () { // protect FF Error: NS_ERROR_FAILURE: Failure
        document.execCommand('styleWithCSS', 0, true);
      });

      //04. create Toolbar
      var sToolbar = '';
      for (var idx = 0, sz = aToolbarSetting.length; idx < sz; idx ++) {
        var group = aToolbarSetting[idx];
        sToolbar += '<div class="note-' + group[0] + ' btn-group">';
        for (var i = 0, szGroup = group[1].length; i < szGroup; i++) {
          sToolbar += aToolbarItem[group[1][i]](Locale[options.locale]);
        }
        sToolbar += '</div>';
      }

      sToolbar = '<div class="note-toolbar btn-toolbar">' + sToolbar + '</div>';

      var $toolbar = $(sToolbar).prependTo($editor);
      createPalette($toolbar);
      createTooltip($toolbar, 'bottom');

      //05. create Popover
      var $popover = $(sPopover(Locale[options.locale])).prependTo($editor);
      createTooltip($popover);

      //06. handle(control selection, ...)
      $(sHandle).prependTo($editor);

      //07. create Dialog
      var $dialog = $(sDialog(Locale[options.locale])).prependTo($editor);
      $dialog.find('button.close, a.modal-close').click(function () {
        $(this).closest('.modal').modal('hide');
      });

      //08. create Dropzone
      $('<div class="note-dropzone"><div class="note-dropzone-message"></div></div>').prependTo($editor);

      //09. Editor/Holder switch
      $editor.insertAfter($holder);
      $holder.hide();
    };

    // layoutInfoFromHolder
    var layoutInfoFromHolder = this.layoutInfoFromHolder = function ($holder) {
      var $editor = $holder.next();
      if (!$editor.hasClass('note-editor')) { return; }

      return {
        editor: $editor,
        dropzone: $editor.find('.note-dropzone'),
        toolbar: $editor.find('.note-toolbar'),
        editable: $editor.find('.note-editable'),
        codable: $editor.find('.note-codable'),
        statusbar: $editor.find('.note-statusbar'),
        popover: $editor.find('.note-popover'),
        handle: $editor.find('.note-handle'),
        dialog: $editor.find('.note-dialog')
      };
    };

    // removeLayout
    this.removeLayout = function ($holder) {
      var info = layoutInfoFromHolder($holder);
      if (!info) { return; }
      $holder.html(info.editable.html());

      info.editor.remove();
      $holder.show();
    };
  };

  return Renderer;
});
