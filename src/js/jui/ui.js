define([
  'summernote/base/renderer'
], function (renderer) {


  $.fn.jui = function () {
    var arr = Array.prototype.slice.call(arguments, 0);
    var method = arr.shift();

    if (this[0].jui) {
      var juiInstance = this[0].jui;
      if (juiInstance[method]) {
        return juiInstance[method].apply(juiInstance, arr);
      } else {
        return juiInstance;
      }
    }
  };

  var editor = renderer.create('<div class="note-editor">');
  var toolbar = renderer.create('<div class="note-toolbar">');
  var editingArea = renderer.create('<div class="note-editing-area">');
  var codable = renderer.create('<textarea class="note-codable"/>');
  var editable = renderer.create('<div class="note-editable" contentEditable="true">');
  var statusbar = renderer.create([
    '<div class="note-statusbar">',
    '  <div class="note-resizebar">',
    '    <div class="note-icon-bar"/>',
    '    <div class="note-icon-bar"/>',
    '    <div class="note-icon-bar"/>',
    '  </div>',
    '</div>'
  ].join(''));

  var buttonGroup = renderer.create('<div class="note-btn-group btngroup">');
  var button = renderer.create('<button class="note-btn btn ">', function ($node, options) {
    if (options && options.tooltip) {
      $node.attr({
        title: options.tooltip
      });

      window.jui.create('ui.tooltip', $node, {
        position : 'bottom',
        showType : 'mouseenter',
        hideType : 'mouseleave'
      });

    }

    if (options && options.data && options.data.toggle === 'dropdown') {
      $node.on('click', function () {
        var dropdown = $(this).closest('.btngroup').find('.dropdown')[0].jui;
        if (dropdown.type === 'show') {
          dropdown.hide();
        } else {
          dropdown.show();
        }
      });
    }
  });

  var dropdown = renderer.create('<div class="dropdown">', function ($node, options) {
    var markup = $.isArray(options.items) ? options.items.map(function (item) {
      return '<li><a href="#" data-value="' + item + '">' + item + '</a></li>';
    }).join('') : options.items;

    if (markup && markup !== '') {
      markup = $('<ul>').html(markup);
      $node.append(markup);
    }

    window.jui.create('ui.dropdown', $node);
  });

  var dropdownCheck = renderer.create('<div class="dropdown note-check">', function ($node, options) {
    var markup = $.isArray(options.items) ? options.items.map(function (item) {
      return '<li><a href="#" data-value="' + item + '"><i class="icon-check" /> ' + item + '</a></li>';
    }).join('') : options.items;

    if (markup && markup !== '') {
      markup = $('<ul>').html(markup);
      $node.append(markup);
    }

    window.jui.create('ui.dropdown', $node);
  });

  var palette = renderer.create('<div class="note-color-palette"/>', function ($node, options) {
    var contents = [];
    for (var row = 0, rowSize = options.colors.length; row < rowSize; row++) {
      var eventName = options.eventName;
      var colors = options.colors[row];
      var buttons = [];
      for (var col = 0, colSize = colors.length; col < colSize; col++) {
        var color = colors[col];
        buttons.push([
          '<button type="button" class="note-color-btn"',
          'style="background-color:', color, '" ',
          'data-event="', eventName, '" ',
          'data-value="', color, '" ',
          'title="', color, '" ',
          'data-toggle="button" tabindex="-1"></button>'
        ].join(''));
      }
      contents.push('<div class="note-color-row">' + buttons.join('') + '</div>');
    }
    $node.html(contents.join(''));

    window.jui.create('ui.tooltip', $node.find('.note-color-btn'), {
      position : 'bottom',
      showType : 'mouseenter',
      hideType : 'mouseleave'
    });
  });

  var dialog = renderer.create('<div class="window window-white" aria-hidden="false"/>', function ($node, options) {
    $node.html([
      (options.title ?
      '<div class="head">' +
        '<div class="right"><a class="close" tabindex="-1"><i class="icon-exit" /></a></div>' +
        '<div class="left">' + options.title + '</div>' +
      '</div>' : ''
      )
    ].join(''));

    var $body = $('<div class="body" />').html(options.body);
    $node.append($body);

    if (options.footer) {
      var $footer = $('<div class="foot" />').html(options.footer);
      $node.append($footer);
    }

    window.jui.create('uix.window', $node, {
      modal : true
    });

  });

  var ui = {
    editor: editor,
    toolbar: toolbar,
    editingArea: editingArea,
    codable: codable,
    editable: editable,
    statusbar: statusbar,
    buttonGroup: buttonGroup,
    button: button,
    dropdown: dropdown,
    dropdownCheck: dropdownCheck,
    palette: palette,
    dialog: dialog,

    createLayout: function ($note) {
      var $editor = ui.editor([
        ui.toolbar(),
        ui.editingArea([
          ui.codable(),
          ui.editable()
        ]),
        ui.statusbar()
      ]).render();

      $editor.insertAfter($note);

      return {
        note: $note,
        editor: $editor,
        toolbar: $editor.find('.note-toolbar'),
        editingArea: $editor.find('.note-editing-area'),
        editable: $editor.find('.note-editable'),
        codable: $editor.find('.note-codable'),
        statusbar: $editor.find('.note-statusbar')
      };
    }
  };
  return ui;
});
