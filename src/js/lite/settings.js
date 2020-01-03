import $ from 'jquery';
import ui from './ui';
import '../base/settings.js';

import '../../styles/summernote-lite.scss';

$.summernote = $.extend($.summernote, {
  ui_template: ui,
  interface: 'lite',
});
