define([], function () {

  /** Button **/
  function Button(opt) {
    this._super(opt);
  }

  Button.prototype.create = function () {
    return $('<button class="note-btn" />');
  };

  var LiteUI = function (ui) {
    // redefine ui 
    //

    var Class = ui.Class;

    return {
      Button : Class.extend(Button, ui.Button)
    }
  };

  

  return LiteUI;
});
