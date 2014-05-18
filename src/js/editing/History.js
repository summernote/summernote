define(['summernote/core/range'], function (range) {
  /**
   * History
   * @class
   */
  var History = function () {
    var aUndo = [], aRedo = [];

    var makeSnap = function ($editable) {
      var elEditable = $editable[0], rng = range.create();
      return {
        contents: $editable.html(),
        bookmark: rng.bookmark(elEditable),
        scrollTop: $editable.scrollTop()
      };
    };

    var applySnap = function ($editable, oSnap) {
      $editable.html(oSnap.contents).scrollTop(oSnap.scrollTop);
      range.createFromBookmark($editable[0], oSnap.bookmark).select();
    };

    this.undo = function ($editable) {
      var oSnap = makeSnap($editable);
      if (!aUndo.length) { return; }
      applySnap($editable, aUndo.pop());
      aRedo.push(oSnap);
    };

    this.redo = function ($editable) {
      var oSnap = makeSnap($editable);
      if (!aRedo.length) { return; }
      applySnap($editable, aRedo.pop());
      aUndo.push(oSnap);
    };

    this.recordUndo = function ($editable) {
      aRedo = [];
      aUndo.push(makeSnap($editable));
    };
  };

  return History;
});
