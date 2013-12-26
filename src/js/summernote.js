define([
  'jquery',
  'core/agent', 'core/dom', 'core/list', 'core/func', 'core/range', 'core/async', // level 1
  'editing/Style', 'editing/History', 'editing/Editor',                           // level 2
  'module/Toolbar', 'module/Popover', 'module/Handle', 'module/Dialog',           // level 3
  'EventHandler', 'Locale', 'Renderer'                                            // level 4
], function ($,
             agent, dom, list, func, range, async,
             Style, History, Editor,
             Toolbar, Popover, Handle, Dialog,
             EventHandler, Locale, Renderer) {
  var renderer = new Renderer();
  var eventHandler = new EventHandler();

  /**
   * extend jquery fn
   */
  $.fn.extend({
    // create Editor Layout and attach Key and Mouse Event
    summernote: function (options) {
      options = $.extend({
        toolbar: [
          ['style', ['style']],
          ['font', ['bold', 'italic', 'underline', 'clear']],
          ['fontsize', ['fontsize']],
          ['color', ['color']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['height', ['height']],
          ['table', ['table']],
          ['insert', ['link', 'picture', 'video']],
          ['view', ['fullscreen', 'codeview']],
          ['help', ['help']]
        ],
        locale: 'en-US'
      }, options);

      this.each(function (idx, elHolder) {
        var $holder = $(elHolder);

        // createLayout with options
        renderer.createLayout($holder, options);

        var info = renderer.layoutInfoFromHolder($holder);
        eventHandler.attach(info, options);

        // Textarea auto filling the code before form submit.
        if (dom.isTextarea($holder[0])) {
          $holder.closest('form').submit(function () {
            $holder.html($holder.code());
          });
        }
      });

      if (this.first() && options.focus) { // focus on first editable element
        var info = renderer.layoutInfoFromHolder(this.first());
        info.editable.focus();
      }
      if (this.length > 0 && options.oninit) { // callback on init
        options.oninit();
      }
    },
    // get the HTML contents of note or set the HTML contents of note.
    code: function (sHTML) {
      // get the HTML contents
      if (sHTML === undefined) {
        var $holder = this.first();
        if ($holder.length === 0) { return; }
        var info = renderer.layoutInfoFromHolder($holder);
        if (!!(info && info.editable)) {
          var bCodeview = info.editor.hasClass('codeview');
          if (agent.bCodeMirror) {
            info.codable.data('cmEditor').save();
          }
          return bCodeview ? info.codable.val() : info.editable.html();
        }
        return $holder.html();
      }

      // set the HTML contents
      this.each(function (i, elHolder) {
        var info = renderer.layoutInfoFromHolder($(elHolder));
        if (info && info.editable) { info.editable.html(sHTML); }
      });
    },
    // destroy Editor Layout and dettach Key and Mouse Event
    destroy: function () {
      this.each(function (idx, elHolder) {
        var $holder = $(elHolder);

        var info = renderer.layoutInfoFromHolder($holder);
        if (!info || !info.editable) { return; }
        eventHandler.dettach(info);
        renderer.removeLayout($holder);
      });
    },
    // inner object for test
    summernoteInner: function () {
      return { dom: dom, list: list, func: func, range: range };
    }
  });
});
