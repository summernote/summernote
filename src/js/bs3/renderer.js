define(function () {
  var Builder = function (markup, children, options) {
    this.build = function ($parent) {
      var $node = $(markup);
      if (options && options.contents) {
        $node.html(options.contents);
      }

      if (options && options.click) {
        $node.click(options.click);
      }

      if (options && options.tooltip) {
        $node.attr({
          title: options.tooltip
        }).tooltip({
          container: 'body',
          trigger: 'hover',
          placement: 'bottom'
        });
      }

      if (children) {
        children.forEach(function (child) {
          child.build($node);
        });
      }

      if ($parent) {
        $parent.append($node);
      }

      return $node;
    };
  };

  var createBuilder = function (markup) {
    return function () {
      var children = $.isArray(arguments[0]) ? arguments[0] : [];
      var options = typeof arguments[1] === 'object' ? arguments[1] : arguments[0];
      return new Builder(markup, children, options);
    };
  };

  var renderer = {
    editor: createBuilder('<div class="note-editor panel panel-default">'),
    toolbar: createBuilder('<div class="note-toolbar panel-heading">'),
    editingArea: createBuilder('<div class="note-editingArea">'),
    codable: createBuilder('<div class="note-codable">'),
    editable: createBuilder('<div class="note-editable panel-body" contentEditable="true">'),
    buttonGroup: createBuilder('<div class="note-btn-group btn-group">'),
    button: createBuilder('<button class="note-btn btn btn-default btn-sm">')
  };

  return renderer;
});
