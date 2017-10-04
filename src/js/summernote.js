import $ from 'jquery';
import env from './base/core/env';
import lists from './base/core/lists';
import Context from './base/Context';

$.fn.extend({
  /**
   * Summernote API
   *
   * @param {Object|String}
   * @return {this}
   */
  summernote: function () {
    var type = $.type(lists.head(arguments));
    var isExternalAPICalled = type === 'string';
    var hasInitOptions = type === 'object';

    var options = hasInitOptions ? lists.head(arguments) : {};

    options = $.extend({}, $.summernote.options, options);

    // Update options
    options.langInfo = $.extend(true, {}, $.summernote.lang['en-US'], $.summernote.lang[options.lang]);
    options.icons = $.extend(true, {}, $.summernote.options.icons, options.icons);
    options.tooltip = options.tooltip === 'auto' ? !env.isSupportTouch : options.tooltip;

    this.each((idx, note) => {
      var $note = $(note);
      if (!$note.data('summernote')) {
        var context = new Context($note, options);
        $note.data('summernote', context);
        $note.data('summernote').triggerEvent('init', context.layoutInfo);
      }
    });

    var $note = this.first();
    if ($note.length) {
      var context = $note.data('summernote');
      if (isExternalAPICalled) {
        return context.invoke.apply(context, lists.from(arguments));
      } else if (options.focus) {
        context.invoke('editor.focus');
      }
    }

    return this;
  }
});
