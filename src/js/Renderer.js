define([
  'summernote/core/agent', 'summernote/core/dom'
], function (agent, dom) {
  /**
   * renderer
   *
   * rendering toolbar and editable
   */
  var Renderer = function () {
    var tplToolbarInfo, tplPopovers, tplHandle, tplDialogs, tplStatusbar;

    /* jshint ignore:start */

    /**
     * bootstrap button template
     *
     * @param {String} sLabel
     * @param {Object} [options]
     * @param {String} [options.event]
     * @param {String} [options.value]
     * @param {String} [options.title]
     * @param {String} [options.dropdown]
     */
    var tplButton = function (sLabel, options) {
      var event = options.event;
      var value = options.value;
      var title = options.title;
      var dropdown = options.dropdown;

      return '<button type="button"' +
                 ' class="btn btn-default btn-sm btn-small' +
                   (dropdown ? ' dropdown-toggle' : '') + '"' +
                 (dropdown ? ' data-toggle="dropdown"' : '') +
                 (title ? ' title="' + title + '"' : '') +
                 (event ? ' data-event="' + event + '"' : '') +
                 (value ? ' data-value="' + value + '"' : '') +
                 ' tabindex="-1">' +
               sLabel +
               (dropdown ? ' <span class="caret"></span>' : '') +
             '</button>' +
             (dropdown || '');
    };

    /**
     * bootstrap icon button template
     *
     * @param {String} sIconClass
     * @param {Object} [options]
     * @param {String} [options.event]
     * @param {String} [options.value]
     * @param {String} [options.title]
     * @param {String} [options.dropdown]
     */
    var tplIconButton = function (sIconClass, options) {
      var sLabel = '<i class="' + sIconClass + '"></i>';
      return tplButton(sLabel, options);
    };

    tplToolbarInfo = {
      picture: function (lang) {
        return tplIconButton('fa fa-picture-o icon-picture', {
          event: 'showImageDialog',
          title: lang.image.image
        });
      },
      link: function (lang) {
        return tplIconButton('fa fa-link icon-link', {
          event: 'showLinkDialog',
          title: lang.link.link
        });
      },
      video: function (lang) {
        return tplIconButton('fa fa-youtube-play icon-play', {
          event: 'showVideoDialog',
          title: lang.link.link
        });
      },
      table: function (lang) {
        var dropdown = '<ul class="dropdown-menu">' +
                         '<div class="note-dimension-picker">' +
                           '<div class="note-dimension-picker-mousecatcher" data-event="insertTable" data-value="1x1"></div>' +
                           '<div class="note-dimension-picker-highlighted"></div>' +
                           '<div class="note-dimension-picker-unhighlighted"></div>' +
                         '</div>' +
                         '<div class="note-dimension-display"> 1 x 1 </div>' +
                       '</ul>';
        return tplIconButton('fa fa-table icon-table', {
          title: lang.table.table,
          dropdown: dropdown
        });
      },
      style: function (lang) {
        var aTagName = ['p', 'blockquote', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

        var dropdown = '<ul class="dropdown-menu">';
        for (var idx = 0; idx < aTagName.length; idx++) {
          var tagName = aTagName[idx];
          var label = lang.style[tagName === 'p' ? 'normal' : tagName];
          dropdown += '<li><a data-event="formatBlock" data-value="' + tagName + '">' +
                        (
                          (tagName === 'p' || tagName === 'pre') ? label :
                          '<' + tagName + '>' + label + '</' + tagName + '>'
                        ) +
                      '</a></li>';
        }
        dropdown += '</ul>';

        return tplIconButton('fa fa-magic icon-magic', {
          title: lang.style.style,
          dropdown: dropdown
        });
      },
      fontname: function (lang) {
        var aFont = [
          'Serif', 'Sans', 'Arial', 'Arial Black', 'Courier',
          'Courier New', 'Comic Sans MS', 'Helvetica', 'Impact', 'Lucida Grande',
          'Lucida Sans', 'Tahoma', 'Times', 'Times New Roman', 'Verdana'
        ];

        var dropdown = '<ul class="dropdown-menu">';
        for (var idx = 0; idx < aFont.length; idx++) {
          dropdown += '<li><a data-event="fontName" data-value="' + aFont[idx] + '">' +
                        '<i class="fa fa-check icon-ok"></i> ' + aFont[idx] +
                      '</a></li>';
        }
        dropdown += '</ul>';

        var sLabel = '<span class="note-current-fontname">Arial</span>';
        return tplButton(sLabel, {
          title: lang.font.name,
          dropdown: dropdown
        });
      },
      fontsize: function (lang) {
        var aFontSize = [8, 9, 10, 11, 12, 14, 18, 24, 36];

        var dropdown = '<ul class="dropdown-menu">';
        for (var idx = 0; idx < aFontSize.length; idx++) {
          dropdown += '<li><a data-event="fontSize" data-value="' + aFontSize[idx] + '">' +
                        '<i class="fa fa-check icon-ok"></i> ' + aFontSize[idx] +
                      '</a></li>';
        }
        dropdown += '</ul>';

        var sLabel = '<span class="note-current-fontsize">11</span>';
        return tplButton(sLabel, {
          title: lang.font.size,
          dropdown: dropdown
        });
      },

      color: function (lang) {
        return '<button type="button" class="btn btn-default btn-sm btn-small note-recent-color" title="' + lang.color.recent + '" data-event="color" data-value=\'{"backColor":"yellow"}\' tabindex="-1"><i class="fa fa-font icon-font" style="color:black;background-color:yellow;"></i></button>' +
               '<button type="button" class="btn btn-default btn-sm btn-small dropdown-toggle" title="' + lang.color.more + '" data-toggle="dropdown" tabindex="-1">' +
                 '<span class="caret"></span>' +
               '</button>' +
               '<ul class="dropdown-menu">' +
                 '<li>' +
                   '<div class="btn-group">' +
                     '<div class="note-palette-title">' + lang.color.background + '</div>' +
                     '<div class="note-color-reset" data-event="backColor" data-value="inherit" title="' + lang.color.transparent + '">' + lang.color.setTransparent + '</div>' +
                     '<div class="note-color-palette" data-target-event="backColor"></div>' +
                   '</div>' +
                   '<div class="btn-group">' +
                     '<div class="note-palette-title">' + lang.color.foreground + '</div>' +
                     '<div class="note-color-reset" data-event="foreColor" data-value="inherit" title="' + lang.color.reset + '">' + lang.color.resetToDefault + '</div>' +
                     '<div class="note-color-palette" data-target-event="foreColor"></div>' +
                   '</div>' +
                 '</li>' +
               '</ul>';
      },
      bold: function (lang) {
        return tplIconButton('fa fa-bold icon-bold', {
          event: 'bold',
          title: lang.font.bold
        });
      },
      italic: function (lang) {
        return tplIconButton('fa fa-italic icon-italic', {
          event: 'italic',
          title: lang.font.italic
        });
      },
      underline: function (lang) {
        return tplIconButton('fa fa-underline icon-underline', {
          event: 'underline',
          title: lang.font.underline
        });
      },
      strike: function (lang) {
        return tplIconButton('fa fa-strikethrough icon-strikethrough', {
          event: 'strikethrough',
          title: lang.font.strike
        });
      },
      clear: function (lang) {
        return tplIconButton('fa fa-eraser icon-eraser', {
          event: 'removeFormat',
          title: lang.font.clear
        });
      },
      ul: function (lang) {
        return tplIconButton('fa fa-list-ul icon-list-ul', {
          event: 'insertUnorderedList',
          title: lang.lists.unordered
        });
      },
      ol: function (lang) {
        return tplIconButton('fa fa-list-ol icon-list-ol', {
          event: 'insertOrderedList',
          title: lang.lists.ordered
        });
      },
      paragraph: function (lang) {
        var dropdown = '<div class="dropdown-menu">' +
                         '<div class="note-align btn-group">' +
                           '<button type="button" class="btn btn-default btn-sm btn-small" title="' + lang.paragraph.left + '" data-event="justifyLeft" tabindex="-1"><i class="fa fa-align-left icon-align-left"></i></button>' +
                           '<button type="button" class="btn btn-default btn-sm btn-small" title="' + lang.paragraph.center + '" data-event="justifyCenter" tabindex="-1"><i class="fa fa-align-center icon-align-center"></i></button>' +
                           '<button type="button" class="btn btn-default btn-sm btn-small" title="' + lang.paragraph.right + '" data-event="justifyRight" tabindex="-1"><i class="fa fa-align-right icon-align-right"></i></button>' +
                           '<button type="button" class="btn btn-default btn-sm btn-small" title="' + lang.paragraph.justify + '" data-event="justifyFull" tabindex="-1"><i class="fa fa-align-justify icon-align-justify"></i></button>' +
                         '</div>' +
                         '<div class="note-list btn-group">' +
                           '<button type="button" class="btn btn-default btn-sm btn-small" title="' + lang.paragraph.outdent + '" data-event="outdent" tabindex="-1"><i class="fa fa-outdent icon-indent-left"></i></button>' +
                           '<button type="button" class="btn btn-default btn-sm btn-small" title="' + lang.paragraph.indent + '" data-event="indent" tabindex="-1"><i class="fa fa-indent icon-indent-right"></i></button>' +
                         '</div>' +
                       '</div>';

        return tplIconButton('fa fa-align-left icon-align-left', {
          title: lang.paragraph.paragraph,
          dropdown: dropdown
        });
      },
      height: function (lang) {
        var aHeight = ['1.0', '1.2', '1.4', '1.5', '1.6', '1.8', '2.0', '3.0'];
        var dropdown = '<ul class="dropdown-menu">';
        for (var idx = 0; idx < aHeight.length; idx++) {
          dropdown += '<li><a data-event="lineHeight" data-value="' + aHeight[idx] + '"><i class="fa fa-check icon-ok"></i> ' + aHeight[idx] + '</a></li>';
        }
        dropdown += '</ul>';

        return tplIconButton('fa fa-text-height icon-text-height', {
          title: lang.font.height,
          dropdown: dropdown
        });

      },
      help: function (lang) {
        return tplIconButton('fa fa-question icon-question', {
          event: 'showHelpDialog',
          title: lang.options.help
        });
      },
      fullscreen: function (lang) {
        return tplIconButton('fa fa-arrows-alt icon-fullscreen', {
          event: 'fullscreen',
          title: lang.options.fullscreen
        });
      },
      codeview: function (lang) {
        return tplIconButton('fa fa-code icon-code', {
          event: 'codeview',
          title: lang.options.codeview
        });
      },
      undo: function (lang) {
        return tplIconButton('fa fa-undo icon-undo', {
          event: 'undo',
          title: lang.history.undo
        });
      },
      redo: function (lang) {
        return tplIconButton('fa fa-repeat icon-repeat', {
          event: 'redo',
          title: lang.history.redo
        });
      }
    };

    /**
     * bootstrap popover template
     *
     * @param {String} className
     * @param {String} content
     */
    var tplPopover = function (className, content) {
      return '<div class="' + className + ' popover bottom in" style="display: none;">' +
               '<div class="arrow"></div>' +
               '<div class="popover-content">' +
                 content +
               '</div>' +
             '</div>';
    };

    tplPopovers = function (lang) {
      var tplLinkPopover = function () {
        var content = '<a href="http://www.google.com" target="_blank">www.google.com</a>&nbsp;&nbsp;' +
                      '<div class="note-insert btn-group">' +
                        tplIconButton('fa fa-edit icon-edit', {
                          title: lang.link.edit,
                          event: 'showLinkDialog'
                        }) +
                        tplIconButton('fa fa-unlink icon-unlink', {
                          title: lang.link.unlink,
                          event: 'unlink'
                        }) +
                      '</div>';
        return tplPopover('note-link-popover', content);
      };

      var tplImagePopover = function () {
        var content = '<div class="btn-group">' +
                        tplButton('<span class="note-fontsize-10">100%</span>', {
                          title: lang.image.resizeFull,
                          event: 'resize',
                          value: '1'
                        }) +
                        tplButton('<span class="note-fontsize-10">50%</span>', {
                          title: lang.image.resizeHalf,
                          event: 'resize',
                          value: '0.5'
                        }) +
                        tplButton('<span class="note-fontsize-10">25%</span>', {
                          title: lang.image.resizeQuarter,
                          event: 'resize',
                          value: '0.25'
                        }) +
                      '</div>' +
                      '<div class="btn-group">' +
                        tplIconButton('fa fa-align-left icon-align-left', {
                          title: lang.image.floatLeft,
                          event: 'floatMe',
                          value: 'left'
                        }) +
                        tplIconButton('fa fa-align-left icon-align-right', {
                          title: lang.image.floatRight,
                          event: 'floatMe',
                          value: 'right'
                        }) +
                        tplIconButton('fa fa-align-justify icon-align-justify', {
                          title: lang.image.floatNone,
                          event: 'floatMe',
                          value: 'none'
                        }) +
                      '</div>' +
                      '<div class="btn-group">' +
                        tplIconButton('fa fa-trash-o icon-trash', {
                          title: lang.image.remove,
                          event: 'removeMedia',
                          value: 'none'
                        }) +
                      '</div>';
        return tplPopover('note-image-popover', content);
      };

      return '<div class="note-popover">' + tplLinkPopover() + tplImagePopover() + '</div>';
    };

    tplHandle = function () {
      return '<div class="note-handle">' +
               '<div class="note-control-selection">' +
                 '<div class="note-control-selection-bg"></div>' +
                 '<div class="note-control-holder note-control-nw"></div>' +
                 '<div class="note-control-holder note-control-ne"></div>' +
                 '<div class="note-control-holder note-control-sw"></div>' +
                 '<div class="note-control-sizing note-control-se"></div>' +
                 '<div class="note-control-selection-info"></div>' +
               '</div>' +
             '</div>';
    };

    /**
     * shortcut table template
     * @param {String} title
     * @param {String} body
     */
    var tplShortcut = function (title, body) {
      return '<table class="note-shortcut">' +
               '<thead>' +
                 '<tr><th></th><th>' + title + '</th></tr>' +
               '</thead>' +
               '<tbody>' + body + '</tbody>' +
             '</table>';
    };

    var tplShortcutText = function (lang) {
      var body = '<tr><td>⌘ + B</td><td>' + lang.font.bold + '</td></tr>' +
                 '<tr><td>⌘ + I</td><td>' + lang.font.italic + '</td></tr>' +
                 '<tr><td>⌘ + U</td><td>' + lang.font.underline + '</td></tr>' +
                 '<tr><td>⌘ + ⇧ + S</td><td>' + lang.font.strike + '</td></tr>' +
                 '<tr><td>⌘ + \\</td><td>' + lang.font.clear + '</td></tr>';

      return tplShortcut(lang.shortcut.textFormatting, body);
    };

    var tplShortcutAction = function (lang) {
      var body = '<tr><td>⌘ + Z</td><td>' + lang.history.undo + '</td></tr>' +
                 '<tr><td>⌘ + ⇧ + Z</td><td>' + lang.history.redo + '</td></tr>' +
                 '<tr><td>⌘ + ]</td><td>' + lang.paragraph.indent + '</td></tr>' +
                 '<tr><td>⌘ + [</td><td>' + lang.paragraph.outdent + '</td></tr>' +
                 '<tr><td>⌘ + ENTER</td><td>' + lang.hr.insert + '</td></tr>';

      return tplShortcut(lang.shortcut.action, body);
    };

    var tplShortcutPara = function (lang) {
      var body = '<tr><td>⌘ + ⇧ + L</td><td>' + lang.paragraph.left + '</td></tr>' +
                 '<tr><td>⌘ + ⇧ + E</td><td>' + lang.paragraph.center + '</td></tr>' +
                 '<tr><td>⌘ + ⇧ + R</td><td>' + lang.paragraph.right + '</td></tr>' +
                 '<tr><td>⌘ + ⇧ + J</td><td>' + lang.paragraph.justify + '</td></tr>' +
                 '<tr><td>⌘ + ⇧ + NUM7</td><td>' + lang.lists.ordered + '</td></tr>' +
                 '<tr><td>⌘ + ⇧ + NUM8</td><td>' + lang.lists.unordered + '</td></tr>';

      return tplShortcut(lang.shortcut.paragraphFormatting, body);
    };

    var tplShortcutStyle = function (lang) {
      var body = '<tr><td>⌘ + NUM0</td><td>' + lang.style.normal + '</td></tr>' +
                 '<tr><td>⌘ + NUM1</td><td>' + lang.style.h1 + '</td></tr>' +
                 '<tr><td>⌘ + NUM2</td><td>' + lang.style.h2 + '</td></tr>' +
                 '<tr><td>⌘ + NUM3</td><td>' + lang.style.h3 + '</td></tr>' +
                 '<tr><td>⌘ + NUM4</td><td>' + lang.style.h4 + '</td></tr>' +
                 '<tr><td>⌘ + NUM5</td><td>' + lang.style.h5 + '</td></tr>' +
                 '<tr><td>⌘ + NUM6</td><td>' + lang.style.h6 + '</td></tr>';

      return tplShortcut(lang.shortcut.documentStyle, body);
    };

    var tplExtraShortcuts = function (lang, options) {
      var extraKeys = options.extraKeys;
      var body = '';
      for (var key in extraKeys) {
        if (extraKeys.hasOwnProperty(key)) {
          body += '<tr><td>' + key + '</td><td>' + extraKeys[key] + '</td></tr>';
        }
      }

      return tplShortcut(lang.shortcut.extraKeys, body);
    };

    var tplShortcutTable = function (lang, options) {
      var template = '<table class="note-shortcut-layout">' +
                       '<tbody>' +
                         '<tr><td>' + tplShortcutAction(lang, options) + '</td><td>' + tplShortcutText(lang, options) + '</td></tr>' +
                         '<tr><td>' + tplShortcutStyle(lang, options) + '</td><td>' + tplShortcutPara(lang, options) + '</td></tr>';
      if (options.extraKeys) {
        template += '<tr><td colspan="2">' + tplExtraShortcuts(lang, options) + '</td></tr>';
      }
      template += '</tbody</table>';
      return template;
    };

    var replaceMacKeys = function (sHtml) {
      return sHtml.replace(/⌘/g, 'Ctrl').replace(/⇧/g, 'Shift');
    };

    /**
     * bootstrap dialog template
     *
     * @param {String} className
     * @param {String} [title]
     * @param {String} body
     * @param {String} [footer]
     */
    var tplDialog = function (className, title, body, footer) {
      return '<div class="' + className + ' modal" aria-hidden="false">' +
               '<div class="modal-dialog">' +
                 '<div class="modal-content">' +
                   (title ?
                   '<div class="modal-header">' +
                     '<button type="button" class="close" aria-hidden="true" tabindex="-1">&times;</button>' +
                     '<h4>' + title + '</h4>' +
                   '</div>' : ''
                   ) +
                   '<div class="modal-body">' +
                     '<div class="row-fluid">' + body + '</div>' +
                   '</div>' +
                   (footer ?
                   '<div class="modal-footer">' + footer + '</div>' : ''
                   ) +
                 '</div>' +
               '</div>' +
             '</div>';
    };

    tplDialogs = function (lang, options) {
      var tplImageDialog = function () {
        var body = '<h5>' + lang.image.selectFromFiles + '</h5>' +
                   '<input class="note-image-input" type="file" name="files" accept="image/*" />' +
                   '<h5>' + lang.image.url + '</h5>' +
                   '<input class="note-image-url form-control span12" type="text" />';
        var footer = '<button href="#" class="btn btn-primary note-image-btn disabled" disabled>' + lang.image.insert + '</button>';
        return tplDialog('note-image-dialog', lang.image.insert, body, footer);
      };

      var tplLinkDialog = function () {
        var body = '<div class="form-group">' +
                     '<label>' + lang.link.textToDisplay + '</label>' +
                     '<input class="note-link-text form-control span12" type="text" disabled />' +
                   '</div>' +
                   '<div class="form-group">' +
                     '<label>' + lang.link.url + '</label>' +
                     '<input class="note-link-url form-control span12" type="text" />' +
                   '</div>' +
                   (!options.disableLinkTarget ?
                     '<div class="checkbox">' +
                       '<label>' + '<input type="checkbox" checked> ' +
                         lang.link.openInNewWindow +
                       '</label>' +
                     '</div>' : ''
                   );
        var footer = '<button href="#" class="btn btn-primary note-link-btn disabled" disabled>' + lang.link.insert + '</button>';
        return tplDialog('note-link-dialog', lang.link.insert, body, footer);
      };

      var tplVideoDialog = function () {
        var body = '<div class="form-group">' +
                     '<label>' + lang.video.url + '</label>&nbsp;<small class="text-muted">' + lang.video.providers + '</small>' +
                     '<input class="note-video-url form-control span12" type="text" />' +
                   '</div>';
        var footer = '<button href="#" class="btn btn-primary note-video-btn disabled" disabled>' + lang.video.insert + '</button>';
        return tplDialog('note-video-dialog', lang.video.insert, body, footer);
      };

      var tplHelpDialog = function () {
        var body = '<a class="modal-close pull-right" aria-hidden="true" tabindex="-1">' + lang.shortcut.close + '</a>' +
                   '<div class="title">' + lang.shortcut.shortcuts + '</div>' +
                   (agent.bMac ? tplShortcutTable(lang, options) : replaceMacKeys(tplShortcutTable(lang, options))) +
                   '<p class="text-center">' +
                     '<a href="//hackerwins.github.io/summernote/" target="_blank">Summernote @VERSION</a> · ' +
                     '<a href="//github.com/HackerWins/summernote" target="_blank">Project</a> · ' +
                     '<a href="//github.com/HackerWins/summernote/issues" target="_blank">Issues</a>' +
                   '</p>';
        return tplDialog('note-help-dialog', '', body, '');
      };

      return '<div class="note-dialog">' +
               tplImageDialog() +
               tplLinkDialog() +
               tplVideoDialog() +
               tplHelpDialog() +
             '</div>';
    };

    tplStatusbar = function () {
      return '<div class="note-resizebar">' +
               '<div class="note-icon-bar"></div>' +
               '<div class="note-icon-bar"></div>' +
               '<div class="note-icon-bar"></div>' +
             '</div>';
    };

    /* jshint ignore:end */

    var invertObject = function (obj) {
      var inverted = {};
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          inverted[obj[key]] = key;
        }
      }
      return inverted;
    };

    var representShortcut = function (str) {
      if (agent.bMac) {
        str = str.replace('CMD', '⌘').replace('SHIFT', '⇧');
      }

      return str.replace('BACKSLASH', '\\')
                .replace('SLASH', '/')
                .replace('LEFTBRACKET', '[')
                .replace('RIGHTBRACKET', ']');
    };

    /**
     * createTooltip
     *
     * @param {jQuery} $container
     * @param {Object} keyMap
     * @param {String} [sPlacement]
     */
    var createTooltip = function ($container, keyMap, sPlacement) {
      var invertedKeyMap = invertObject(keyMap);
      var $buttons = $container.find('button');

      $buttons.each(function (i, elBtn) {
        var $btn = $(elBtn);
        var sShortcut = invertedKeyMap[$btn.data('event')];
        if (sShortcut) {
          $btn.attr('title', function (i, v) {
            return v + ' (' + representShortcut(sShortcut) + ')';
          });
        }
      // bootstrap tooltip on btn-group bug
      // https://github.com/twitter/bootstrap/issues/5687
      }).tooltip({
        container: 'body',
        trigger: 'hover',
        placement: sPlacement || 'top'
      }).on('click', function () {
        $(this).tooltip('hide');
      });
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
        var aPaletteContents = [];
        for (var row = 0, szRow = aaColor.length; row < szRow; row++) {
          var aColor = aaColor[row];
          var aButton = [];
          for (var col = 0, szCol = aColor.length; col < szCol; col++) {
            var sColor = aColor[col];
            aButton.push(['<button type="button" class="note-color-btn" style="background-color:', sColor,
                           ';" data-event="', sEvent,
                           '" data-value="', sColor,
                           '" title="', sColor,
                           '" data-toggle="button" tabindex="-1"></button>'].join(''));
          }
          aPaletteContents.push('<div>' + aButton.join('') + '</div>');
        }
        $palette.html(aPaletteContents.join(''));
      });
    };

    /**
     * create summernote layout
     *
     * @param {jQuery} $holder
     * @param {Object} options
     */
    this.createLayout = function ($holder, options) {
      //already created
      var next = $holder.next();
      if (next && next.hasClass('note-editor')) { return; }

      //01. create Editor
      var $editor = $('<div class="note-editor"></div>');
      if (options.width) {
        $editor.width(options.width);
      }

      //02. statusbar (resizebar)
      if (options.height > 0) {
        $('<div class="note-statusbar">' + tplStatusbar() + '</div>').prependTo($editor);
      }

      //03. create Editable
      var isContentEditable = !$holder.is(':disabled');
      var $editable = $('<div class="note-editable" contentEditable="' + isContentEditable + '"></div>')
          .prependTo($editor);
      if (options.height) {
        $editable.height(options.height);
      }
      if (options.direction) {
        $editable.attr('dir', options.direction);
      }

      $editable.html(dom.html($holder) || dom.emptyPara);

      //031. create codable
      $('<textarea class="note-codable"></textarea>').prependTo($editor);

      var langInfo = $.summernote.lang[options.lang];

      //04. create Toolbar
      var sToolbar = '';
      for (var idx = 0, sz = options.toolbar.length; idx < sz; idx ++) {
        var group = options.toolbar[idx];
        sToolbar += '<div class="note-' + group[0] + ' btn-group">';
        for (var i = 0, szGroup = group[1].length; i < szGroup; i++) {
          sToolbar += tplToolbarInfo[group[1][i]](langInfo);
        }
        sToolbar += '</div>';
      }

      sToolbar = '<div class="note-toolbar btn-toolbar">' + sToolbar + '</div>';

      var $toolbar = $(sToolbar).prependTo($editor);
      var keyMap = options.keyMap[agent.bMac ? 'mac' : 'pc'];
      createPalette($toolbar);
      createTooltip($toolbar, keyMap, 'bottom');

      //05. create Popover
      var $popover = $(tplPopovers(langInfo)).prependTo($editor);
      createTooltip($popover, keyMap);

      //06. handle(control selection, ...)
      $(tplHandle()).prependTo($editor);

      //07. create Dialog
      var $dialog = $(tplDialogs(langInfo, options)).prependTo($editor);
      $dialog.find('button.close, a.modal-close').click(function () {
        $(this).closest('.modal').modal('hide');
      });

      //08. create Dropzone
      $('<div class="note-dropzone"><div class="note-dropzone-message"></div></div>').prependTo($editor);

      //09. Editor/Holder switch
      $editor.insertAfter($holder);
      $holder.hide();
    };

    /**
     * returns layoutInfo from holder
     *
     * @param {jQuery} $holder - placeholder
     * @returns {Object}
     */
    this.layoutInfoFromHolder = function ($holder) {
      var $editor = $holder.next();
      if (!$editor.hasClass('note-editor')) { return; }

      var layoutInfo = dom.buildLayoutInfo($editor);
      // cache all properties.
      for (var key in layoutInfo) {
        if (layoutInfo.hasOwnProperty(key)) {
          layoutInfo[key] = layoutInfo[key].call();
        }
      }
      return layoutInfo;
    };

    /**
     * removeLayout
     *
     * @param {jQuery} $holder - placeholder
     */
    this.removeLayout = function ($holder) {
      var info = this.layoutInfoFromHolder($holder);
      if (!info) { return; }
      $holder.html(info.editable.html());

      info.editor.remove();
      $holder.show();
    };
  };

  return Renderer;
});
