import $ from 'jquery';
import ui from './ui';
import '../base/settings.js';

$.summernote = $.extend($.summernote, {
  ui: ui,
});
