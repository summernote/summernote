import $ from 'jquery';
import ui from './ui';
import '../base/settings.js';

import '../../less/summernote.scss';

$.summernote = $.extend($.summernote, {
  ui: ui,
});
