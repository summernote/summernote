define([
  'core/agent', 'core/dom',
  'settings',
  'EventHandler', 'Renderer'
], function (agent, dom, settings, EventHandler, Renderer) {
  // jQuery namespace for summernote
  $.summernote = $.summernote || {};

  // extends default `settings`
  $.extend($.summernote, settings);

  var renderer = new Renderer();
  var eventHandler = new EventHandler();

  /**
   * extend jquery fn
   */
  $.fn.extend({
    /**
     * initialize summernote
     *  - create editor layout and attach Mouse and keyboard events.
     *
     * @param {Object} options
     * @returns {this}
     */
    summernote: function (options) {
      // extend default options
      options = $.extend({}, $.summernote.options, options);

      this.each(function (idx, elHolder) {
        var $holder = $(elHolder);

        // createLayout with options
        renderer.createLayout($holder, options);

        var info = renderer.layoutInfoFromHolder($holder);
        eventHandler.attach(info, options);

        // Textarea: auto filling the code before form submit.
        if (dom.isTextarea($holder[0])) {
          $holder.closest('form').submit(function () {
            $holder.html($holder.code());
          });
        }
      });

      // focus on first editable element
      if (this.first() && options.focus) {
        var info = renderer.layoutInfoFromHolder(this.first());
        info.editable.focus();
      }

      // callback on init
      if (this.length > 0 && options.oninit) {
        options.oninit();
      }

      return this;
    },
    // 

    /**
     * get the HTML contents of note or set the HTML contents of note.
     *
     * @param {String} [sHTML] - HTML contents(optional, set)
     * @returns {this|String} - context(set) or HTML contents of note(get).
     */
    code: function (sHTML) {
      // get the HTML contents of note
      if (sHTML === undefined) {
        var $holder = this.first();
        if ($holder.length === 0) { return; }
        var info = renderer.layoutInfoFromHolder($holder);
        if (!!(info && info.editable)) {
          var bCodeview = info.editor.hasClass('codeview');
          if (bCodeview && agent.bCodeMirror) {
            info.codable.data('cmEditor').save();
          }
          return bCodeview ? info.codable.val() : info.editable.html();
        }
        return $holder.html();
      }

      // set the HTML contents of note
      this.each(function (i, elHolder) {
        var info = renderer.layoutInfoFromHolder($(elHolder));
        if (info && info.editable) { info.editable.html(sHTML); }
      });

      return this;
    },

    /**
     * destroy Editor Layout and dettach Key and Mouse Event
     * @returns {this}
     */
    destroy: function () {
      this.each(function (idx, elHolder) {
        var $holder = $(elHolder);

        var info = renderer.layoutInfoFromHolder($holder);
        if (!info || !info.editable) { return; }
        eventHandler.dettach(info);
        renderer.removeLayout($holder);
      });

      return this;
    }
  });
});
