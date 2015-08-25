define(function () {

  var Builder = function (markup, children) {
    this.build = function ($parent) {
      var $node = $(markup);

      if ($parent) {
        $parent.append($node);
      }

      if (children) {
        children.forEach(function (child) {
          child.build($node);
        });
      }

      return $node;
    };
  };

  var createBuilder = function (markup) {
    return function (children) {
      return new Builder(markup, children);
    };
  };

  var renderer = {
    editor: createBuilder('<div class="note-editor">editor</div>'),
    editingArea: createBuilder('<div class="note-editingArea">editingArea</div>'),
    codable: createBuilder('<div class="note-codable">codable</div>'),
    editable: createBuilder('<div class="note-editable" contentEditable="true">editable</div>')
  };

  return renderer;
});
