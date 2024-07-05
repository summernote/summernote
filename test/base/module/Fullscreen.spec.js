/**
 * Fullscreen.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */

import { describe, it, expect } from 'vitest';
import $ from 'jquery';
import Context from '@/js/Context';
import Fullscreen from '@/js/module/Fullscreen';
import '@/styles/lite/summernote-lite';

describe('Fullscreen', () => {
  var fullscreen, context;

  beforeEach(() => {
    var options = $.extend({}, $.summernote.options);
    context = new Context($('<div><p>hello</p></div>'), options);
    fullscreen = new Fullscreen(context);
  });

  it('should toggle fullscreen mode', () => {
    expect(fullscreen.isFullscreen()).to.be.false;
    fullscreen.toggle();
    expect(fullscreen.isFullscreen()).to.be.true;
    fullscreen.toggle();
    expect(fullscreen.isFullscreen()).to.be.false;
  });
});
