define(['summernote/core/range'], function (range) {
  /**
   * History
   * @class
   */
  var History = function () {
    var undoStack = [], redoStack = [];

    var makeSnapshot = function ($editable) {
      var editable = $editable[0];
      var rng = range.create();

      return {
        contents: $editable.html(),
        bookmark: rng.bookmark(editable),
        scrollTop: $editable.scrollTop()
      };
    };

    var applySnapshot = function ($editable, snapshot) {
      $editable.html(snapshot.contents).scrollTop(snapshot.scrollTop);
      range.createFromBookmark($editable[0], snapshot.bookmark).select();
    };

    this.undo = function ($editable) {
      var snapshot = makeSnapshot($editable);
      if (!undoStack.length) {
        return;
      }
      applySnapshot($editable, undoStack.pop());
      redoStack.push(snapshot);
    };

    this.redo = function ($editable) {
      var snapshot = makeSnapshot($editable);
      if (!redoStack.length) {
        return;
      }
      applySnapshot($editable, redoStack.pop());
      undoStack.push(snapshot);
    };

    this.recordUndo = function ($editable) {
      redoStack = [];
      undoStack.push(makeSnapshot($editable));
    };
  };

  return History;
});
