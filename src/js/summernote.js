define([
  'summernote/core/agent', 'summernote/core/dom',
  'summernote/core/range',
  'summernote/settings',
  'summernote/EventHandler', 'summernote/Renderer'
], function (agent, dom, range, settings, EventHandler, Renderer) {

  /**
   * @class jQuery
   * jQuery Object
   */
    
  // jQuery namespace for summernote
  /**
   * @class summernote 
   * 
   * summernote attribute  
   * 
   * @member jQuery
   * @extends settings
   * @singleton  
   * 
   */
  $.summernote = $.summernote || {};

  // extends default `settings`
  $.extend($.summernote, settings);

  var renderer = new Renderer();
  var eventHandler = new EventHandler();

  $.extend($.summernote, {
    /** @property */
    renderer: renderer,
    /** @property */
    eventHandler: eventHandler,
    /** 
     * @property {Object} core
     */  
    core: {
      agent: agent,
      dom: dom,
      range: range
    },
    /** @property */
    pluginEvents: {}
  });

  /**
   * @method addPlugin
   *
   * add Plugin in Summernote 
   *  
   * @param {Object} plugin
   */
  $.summernote.addPlugin = function (plugin) {
    if (plugin.buttons) {
      $.each(plugin.buttons, function (name, button) {
        renderer.addButtonInfo(name, button);
      });
    }

    if (plugin.dialogs) {
      $.each(plugin.dialogs, function (name, dialog) {
        renderer.addDialogInfo(name, dialog);
      });
    }

    if (plugin.events) {
      $.each(plugin.events, function (name, event) {
        $.summernote.pluginEvents[name] = event;
      });
    }

    if (plugin.langs) {
      $.each(plugin.langs, function (locale, lang) {
        if ($.summernote.lang[locale]) {
          $.extend($.summernote.lang[locale], lang);
        }
      });
    }

    if (plugin.options) {
      $.extend($.summernote.options, plugin.options);
    }
  };

  /**
   * extend jquery fn
   */
  $.fn.extend({
    /**
     * @method
     * nitialize summernote
     *  - create editor layout and attach Mouse and keyboard events.
     * @member jQuery.fn
     * @param {Object} options
     * @returns {this}
     */
    summernote: function (options) {
      // extend default options
      options = $.extend({}, $.summernote.options, options);

      // Include langInfo in options for later use, e.g. for image drag-n-drop
      // Setup language info with en-US as default
      options.langInfo = $.extend(true, {}, $.summernote.lang['en-US'], $.summernote.lang[options.lang]);

      this.each(function (idx, holder) {
        var $holder = $(holder);

        // createLayout with options
        renderer.createLayout($holder, options);

        var info = renderer.layoutInfoFromHolder($holder);
        eventHandler.attach(info, options);

        // Textarea: auto filling the code before form submit.
        if (dom.isTextarea($holder[0])) {
          $holder.closest('form').submit(function () {
            var contents = $holder.code();
            $holder.val(contents);

            // callback on submit
            if (options.onsubmit) {
              options.onsubmit(contents);
            }
          });
        }
      });

      // focus on first editable element
      if (this.first().length && options.focus) {
        var info = renderer.layoutInfoFromHolder(this.first());
        info.editable.focus();
      }

      // callback on init
      if (this.length && options.oninit) {
        options.oninit();
      }

      return this;
    },
    //

    /**
     * @method 
     * 
     * get the HTML contents of note or set the HTML contents of note.
     *
     * @member jQuery.fn 
     * @param {String} [sHTML] - HTML contents(optional, set)
     * @returns {this|String} - context(set) or HTML contents of note(get).
     */
    code: function (sHTML) {
      // get the HTML contents of note
      if (sHTML === undefined) {
        var $holder = this.first();
        if (!$holder.length) { return; }
        var info = renderer.layoutInfoFromHolder($holder);
        if (!!(info && info.editable)) {
          var isCodeview = info.editor.hasClass('codeview');
          if (isCodeview && agent.hasCodeMirror) {
            info.codable.data('cmEditor').save();
          }
          return isCodeview ? info.codable.val() : info.editable.html();
        }
        return dom.isTextarea($holder[0]) ? $holder.val() : $holder.html();
      }

      // set the HTML contents of note
      this.each(function (i, holder) {
        var info = renderer.layoutInfoFromHolder($(holder));
        if (info && info.editable) { info.editable.html(sHTML); }
      });

      return this;
    },

    /**
     * @method
     * 
     * destroy Editor Layout and detach Key and Mouse Event
     *
     * @member jQuery.fn
     * @returns {this}
     */
    destroy: function () {
      this.each(function (idx, holder) {
        var $holder = $(holder);

        var info = renderer.layoutInfoFromHolder($holder);
        if (!info || !info.editable) { return; }

        var options = info.editor.data('options');

        eventHandler.detach(info, options);
        renderer.removeLayout($holder, info, options);
      });

      return this;
    }
  });
});
