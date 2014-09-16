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
      var emptyBookmark = {s: {path: [0], offset: 0}, e: {path: [0], offset: 0}};

      return {
        contents: $editable.html(),
        bookmark: (rng ? rng.bookmark(editable) : emptyBookmark)
      };
    };

    var applySnapshot = function ($editable, snapshot) {
      if (snapshot.contents !== null) {
        $editable.html(snapshot.contents);
      }
      if (snapshot.bookmark !== null) {
        range.createFromBookmark($editable[0], snapshot.bookmark).select();
      }
    };

    this.undo = function ($editable) {
      if (0 < stackOffset) {
        stackOffset--;
        applySnapshot($editable, stack[stackOffset]);
      }
    };

    this.redo = function ($editable) {
      if (stack.length - 1 > stackOffset) {
        stackOffset++;
        applySnapshot($editable, stack[stackOffset]);
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
