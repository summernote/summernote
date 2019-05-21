import $ from 'jquery';
import ui from './ui';
import '../base/settings.js';

import '../../less/summernote-lite.less';

$.summernote = $.extend($.summernote, {
  ui: ui,
});
