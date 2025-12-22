import { describe, it, expect } from 'vitest';
import $ from 'jquery';
import '@/js/settings';
import '@/styles/lite/summernote-lite';
import AirPopover from '@/js/module/AirPopover';

describe('AirPopover', () => {
  it('should not throw when word range returns no client rects', () => {
    $('body').empty();
    const container = $('<div></div>').appendTo('body');

    // Minimal UI stub for popover rendering
    $.summernote.ui = {
      popover: () => {
        const $el = $('<div class="note-air-popover"><div class="popover-content"></div></div>');
        return { render: () => $el };
      },
    };

    const options = $.extend({}, $.summernote.options, {
      airMode: true,
      editing: true,
      popover: { air: [] },
      container,
    });

    const fakeContext = {
      options,
      layoutInfo: { editable: $('<div></div>') },
      invoke: (name) => {
        if (name === 'buttons.build' || name === 'buttons.updateCurrentStyle') {
          return null;
        }
        if (name === 'editor.getLastRange') {
          return {
            getWordRange: () => ({
              getClientRects: () => [],
              toString: () => '',
            }),
          };
        }
        if (name === 'editor.currentStyle') {
          return { range: { isCollapsed: () => true } };
        }
        return null;
      },
    };

    const popover = new AirPopover(fakeContext);
    popover.initialize();

    const handler = popover.events['summernote.keyup summernote.mouseup summernote.scroll'];
    expect(() => handler(null, new $.Event('keyup'))).not.to.throw();

    container.remove();
  });
});

