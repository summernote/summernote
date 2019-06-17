import $ from 'jquery';
import ui from './ui';
import '../base/settings.js';

import '../../styles/summernote.scss';

$.summernote = $.extend($.summernote, {
  ui: ui,
});
