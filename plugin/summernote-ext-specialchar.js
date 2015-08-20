(function (factory) {
  /* global define */
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else {
    // Browser globals: jQuery
    factory(window.jQuery);
  }
}(function ($) {
  // template
  var tmpl = $.summernote.renderer.getTemplate();

  // core functions: range, dom
  var range = $.summernote.core.range;
  var dom = $.summernote.core.dom;

  var KEY = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    ENTER: 13
  };
  var COLUMN_LENGTH = 15;
  var COLUMN_WIDTH = 35;

  var currentColumn, currentRow, totalColumn, totalRow = 0;

  // special characters data set
  var specialCharDataSet = [
    '&quot;',   // "
    '&amp;',    // &
    '&lt;',     // <
    '&gt;',     // >
    '&iexcl;',
    '&cent;',
    '&pound;',
    '&curren;',
    '&yen;',
    '&brvbar;',
    '&sect;',
    '&uml;',
    '&copy;',
    '&ordf;',
    '&laquo;',
    '&not;',
    //'&shy;',
    '&reg;',
    '&macr;',
    '&deg;',
    '&plusmn;',
    '&sup2;',
    '&sup3;',
    '&acute;',
    '&micro;',
    '&para;',
    '&middot;',
    '&cedil;',
    '&sup1;',
    '&ordm;',
    '&raquo;',
    '&frac14;',
    '&frac12;',
    '&frac34;',
    '&iquest;',
    '&times;',
    '&divide;',
    '&fnof;',
    '&circ;',
    '&tilde;',
    /*'&ensp;',
    '&emsp;',
    '&thinsp;',
    '&zwnj;',
    '&zwj;',
    '&lrm;',
    '&rlm;',*/
    '&ndash;',
    '&mdash;',
    '&lsquo;',
    '&rsquo;',
    '&sbquo;',
    '&ldquo;',
    '&rdquo;',
    '&bdquo;',
    '&dagger;',
    '&Dagger;',
    '&bull;',
    '&hellip;',
    '&permil;',
    '&prime;',
    '&Prime;',
    '&lsaquo;',
    '&rsaquo;',
    '&oline;',
    '&frasl;',
    '&euro;',
    '&image;',
    '&weierp;',
    '&real;',
    '&trade;',
    '&alefsym;',
    '&larr;',
    '&uarr;',
    '&rarr;',
    '&darr;',
    '&harr;',
    '&crarr;',
    '&lArr;',
    '&uArr;',
    '&rArr;',
    '&dArr;',
    '&hArr;',
    '&forall;',
    '&part;',
    '&exist;',
    '&empty;',
    '&nabla;',
    '&isin;',
    '&notin;',
    '&ni;',
    '&prod;',
    '&sum;',
    '&minus;',
    '&lowast;',
    '&radic;',
    '&prop;',
    '&infin;',
    '&ang;',
    '&and;',
    '&or;',
    '&cap;',
    '&cup;',
    '&int;',
    '&there4;',
    '&sim;',
    '&cong;',
    '&asymp;',
    '&ne;',
    '&equiv;',
    '&le;',
    '&ge;',
    '&sub;',
    '&sup;',
    '&nsub;',
    '&sube;',
    '&supe;',
    '&oplus;',
    '&otimes;',
    '&perp;',
    '&sdot;',
    '&lceil;',
    '&rceil;',
    '&lfloor;',
    '&rfloor;',
    //'&lang;',
    //'&rang;',
    '&loz;',
    '&spades;',
    '&clubs;',
    '&hearts;',
    '&diams;'
  ];

  /**
   * @member plugin.specialChar
   * @private
   * @param {jQuery} $editable
   * @return {String}
   */
  var getTextOnRange = function ($editable) {
    $editable.focus();

    var rng = range.create();

    // if range on anchor, expand range with anchor
    if (rng.isOnAnchor()) {
      var anchor = dom.ancestor(rng.sc, dom.isAnchor);
      rng = range.createFromNode(anchor);
    }

    return rng.toString();
  };

  /**
   * Make Special Characters Table
   *
   * @member plugin.specialChar
   * @private
   * @return {jQuery}
   */
  var makeSpecialCharSetTable = function () {
    var $table = $('<table/>');
    $.each(specialCharDataSet, function (idx, text) {
      var $td = $('<td/>').addClass('note-specialchar-node');
      var $tr = (idx % COLUMN_LENGTH === 0) ? $('<tr/>') : $table.find('tr').last();

      $td.append($(tmpl.button(text, {
        title: text,
        value: encodeURIComponent(text)
      })).css({
        width: COLUMN_WIDTH
      }));

      $tr.append($td);
      if (idx % COLUMN_LENGTH === 0) {
        $table.append($tr);
      }
    });

    totalRow = $table.find('tr').length;
    totalColumn = COLUMN_LENGTH;

    return $table;
  };

  /**
   * Show Special Characters and set event handlers on dialog controls.
   *
   * @member plugin.specialChar
   * @private
   * @param {jQuery} $dialog
   * @param {jQuery} $dialog
   * @param {Object} text
   * @return {Promise}
   */
  var showSpecialCharDialog = function ($editable, $dialog, text) {
    return $.Deferred(function (deferred) {
      var $specialCharDialog = $dialog.find('.note-specialchar-dialog');
      var $specialCharNode = $specialCharDialog.find('.note-specialchar-node');
      var $selectedNode = null;
      var ARROW_KEYS = [KEY.UP, KEY.DOWN, KEY.LEFT, KEY.RIGHT];
      var ENTER_KEY = KEY.ENTER;

      function addActiveClass($target) {
        if (!$target) {
          return;
        }
        $target.find('button').addClass('active');
        $selectedNode = $target;
      }

      function removeActiveClass($target) {
        $target.find('button').removeClass('active');
        $selectedNode = null;
      }

      // find next node
      function findNextNode(row, column) {
        var findNode = null;
        $.each($specialCharNode, function (idx, $node) {
          var findRow = Math.ceil((idx + 1) / COLUMN_LENGTH);
          var findColumn = ((idx + 1) % COLUMN_LENGTH === 0) ? COLUMN_LENGTH : (idx + 1) % COLUMN_LENGTH;
          if (findRow === row && findColumn === column) {
            findNode = $node;
            return false;
          }
        });
        return $(findNode);
      }

      function arrowKeyHandler(keyCode) {
        // left, right, up, down key
        var $nextNode;
        var lastRowColumnLength = $specialCharNode.length % totalColumn;

        if (KEY.LEFT === keyCode) {

          if (currentColumn > 1) {
            currentColumn = currentColumn - 1;
          } else if (currentRow === 1 && currentColumn === 1) {
            currentColumn = lastRowColumnLength;
            currentRow = totalRow;
          } else {
            currentColumn = totalColumn;
            currentRow = currentRow - 1;
          }

        } else if (KEY.RIGHT === keyCode) {

          if (currentRow === totalRow && lastRowColumnLength === currentColumn) {
            currentColumn = 1;
            currentRow = 1;
          } else if (currentColumn < totalColumn) {
            currentColumn = currentColumn + 1;
          } else {
            currentColumn = 1;
            currentRow = currentRow + 1;
          }

        } else if (KEY.UP === keyCode) {
          if (currentRow === 1 && lastRowColumnLength < currentColumn) {
            currentRow = totalRow - 1;
          } else {
            currentRow = currentRow - 1;
          }
        } else if (KEY.DOWN === keyCode) {
          currentRow = currentRow + 1;
        }

        if (currentRow === totalRow && currentColumn > lastRowColumnLength) {
          currentRow = 1;
        } else if (currentRow > totalRow) {
          currentRow = 1;
        } else if (currentRow < 1) {
          currentRow = totalRow;
        }

        $nextNode = findNextNode(currentRow, currentColumn);

        if ($nextNode) {
          removeActiveClass($selectedNode);
          addActiveClass($nextNode);
        }
      }

      function enterKeyHandler() {
        if (!$selectedNode) {
          return;
        }

        deferred.resolve(decodeURIComponent($selectedNode.find('button').attr('data-value')));
        $specialCharDialog.modal('hide');
      }

      function keyDownEventHandler(event) {
        event.preventDefault();
        var keyCode = event.keyCode;
        if (keyCode === undefined || keyCode === null) {
          return;
        }
        // check arrowKeys match
        if (ARROW_KEYS.indexOf(keyCode) > -1) {
          if ($selectedNode === null) {
            addActiveClass($specialCharNode.eq(0));
            currentColumn = 1;
            currentRow = 1;
            return;
          }
          arrowKeyHandler(keyCode);
        } else if (keyCode === ENTER_KEY) {
          enterKeyHandler();
        }
        return false;
      }

      // remove class
      removeActiveClass($specialCharNode);
      // find selected node
      if (text) {
        for (var i = 0; i < $specialCharNode.length; i++) {
          var $checkNode = $($specialCharNode[i]);
          if ($checkNode.text() === text) {
            addActiveClass($checkNode);
            currentRow = Math.ceil((i + 1) / COLUMN_LENGTH);
            currentColumn = (i + 1) % COLUMN_LENGTH;
          }
        }
      }

      $specialCharDialog.one('shown.bs.modal', function () {
        $(document).on('keydown', keyDownEventHandler);
        $specialCharNode.on('click', function (event) {
          event.preventDefault();
          deferred.resolve(decodeURIComponent($(event.currentTarget).find('button').attr('data-value')));
          $specialCharDialog.modal('hide');
        });
      }).one('hidden.bs.modal', function () {
        $specialCharNode.off('click');
        $(document).off('keydown', keyDownEventHandler);
        if (deferred.state() === 'pending') {
          deferred.reject();
        }
      }).modal('show');

      // tooltip
      $dialog.find('button').tooltip({
        container: $specialCharDialog.find('.form-group'),
        trigger: 'hover',
        placement: 'top'
      }).on('click', function () {
        $(this).tooltip('hide');
      });

      // $editable blur
      $editable.blur();
    });
  };

  /**
   * @class plugin.specialChar
   *
   * Special Characters Plugin
   *
   * ### load script
   *
   * ```
   * < script src="plugin/summernote-ext-specialchar.js"></script >
   * ```
   *
   * ### use a plugin in toolbar
   * ```
   *    $("#editor").summernote({
   *    ...
   *    toolbar : [
   *        ['group', [ 'specialChar' ]]
   *    ]
   *    ...    
   *    });
   * ```
   */
  $.summernote.addPlugin({
    /** @property {String} name name of plugin */
    name: 'specialChar',
    /**
     * @property {Object} buttons
     * @property {function(object): string} buttons.specialChar
     */
    buttons: {
      specialChar: function (lang, options) {
        return tmpl.iconButton(options.iconPrefix + 'font ' + options.iconPrefix + 'flip-vertical', {
          event: 'showSpecialCharDialog',
          title: lang.specialChar.specialChar,
          hide: true
        });
      }
    },

    /**
     * @property {Object} dialogs
     * @property {function(object, object): string} dialogs.specialChar
    */
    dialogs: {
      specialChar: function (lang) {
        var body = '<div class="form-group row-fluid">' +
                      makeSpecialCharSetTable()[0].outerHTML +
                   '</div>';
        return tmpl.dialog('note-specialchar-dialog', lang.specialChar.select, body);
      }
    },
    /**
     * @property {Object} events
     * @property {Function} events.showSpecialCharDialog
     */
    events: {
      showSpecialCharDialog: function (event, editor, layoutInfo) {
        var $dialog = layoutInfo.dialog(),
            $editable = layoutInfo.editable(),
            currentSpecialChar = getTextOnRange($editable);

        // save current range
        editor.saveRange($editable);

        showSpecialCharDialog($editable, $dialog, currentSpecialChar).then(function (selectChar) {
          // when ok button clicked

          // restore range
          editor.restoreRange($editable);
          
          // build node
          var $node = $('<span></span>').html(selectChar)[0];
          
          if ($node) {
            // insert video node
            editor.insertNode($editable, $node);
          }
        }).fail(function () {
          // when cancel button clicked
          editor.restoreRange($editable);
        });
      }
    },

    // define language
    langs: {
      'en-US': {
        specialChar: {
          specialChar: 'SPECIAL CHARACTERS',
          select: 'Select Special characters'
        }
      },
      'ko-KR': {
        specialChar: {
          specialChar: '특수문자',
          select: '특수문자를 선택하세요'
        }
      }
    }
  });
}));
