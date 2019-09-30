import $ from 'jquery';
import ui from './ui';
import '../base/settings.js';

import '../../styles/summernote-bs4.scss';

$.summernote = $.extend($.summernote, {
  ui: ui,
});

$.summernote.options.styleTags = [
  'p',
  { title: 'Blockquote', tag: 'blockquote', className: 'blockquote', value: 'blockquote' },
  'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
];
