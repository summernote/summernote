/**
 * HelpDialog.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */

import { describe, it, expect } from 'vitest';
import $ from 'jquery';
import Context from '@/js/Context';
import { version } from '../../../package.json';
import '@/styles/lite/summernote-lite';

describe('HelpDialog', () => {
  it('should show the package version', () => {
    expect($.summernote.version).to.equal(version);

    var $note = $('<div></div>').appendTo('body');
    var context = new Context($note, $.extend({}, $.summernote.options));
    context.initialize();

    var footer = context.modules.helpDialog.$dialog.text();
    expect(footer).to.have.string('Summernote ' + version);
    context.destroy();
  });
});
