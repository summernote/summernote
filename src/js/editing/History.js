define(['summernote/core/range'], function (range) {
  /**
   * History
   * @class
   */
  var History = function () {
    var stack = [], stackOffset = 0;

    var makeSnapshot = function ($editable) {
      var editable = $editable[0];
      var rng = range.create();

      return {
        contents: $editable.html(),
        bookmark: (rng ? rng.bookmark(editable) : null)
      };
    };

    var applySnapshot = function ($editable, snapshot) {
      $editable.html(snapshot.contents);
      // FIXME: Still buggy, use marker tag
      // range.createFromBookmark($editable[0], snapshot.bookmark).select();
    };

    this.undo = function ($editable) {
      if (0 < stackOffset) {
        stackOffset--;
        applySnapshot($editable, stack[stackOffset]);
      }
    };

    this.redo = function ($editable) {
      if (stack.length > stackOffset) {
        applySnapshot($editable, stack[stackOffset]);
        stackOffset++;
      }
    };

    this.recordUndo = function ($editable) {
      // Wash out stack after stackOffset
      if (stack.length > stackOffset) {
        stack = stack.slice(0, stackOffset);
      }

      // Create new snapshot and push it to the end
      stack.push(makeSnapshot($editable));
      stackOffset++;
    };
  };

  return History;
});
