import { afterEach, describe, expect, it } from 'vitest';
import $$ from '@/js/core/dom-query.js';
import Statusbar from '@/js/module/Statusbar';

function createStatusbar(options = {}) {
  const $statusbar = $$('<div class="note-statusbar"></div>').appendTo('body');
  const $editable = $$('<div class="note-editable"></div>').appendTo('body');
  const $codable = $$('<textarea class="note-codable"></textarea>').appendTo('body');

  $editable[0].getBoundingClientRect = () => ({ top: 100, left: 0, right: 0, bottom: 0, width: 0, height: 0 });
  $codable[0].getBoundingClientRect = () => ({ top: 100, left: 0, right: 0, bottom: 0, width: 0, height: 0 });

  const context = {
    layoutInfo: {
      statusbar: $statusbar,
      editable: $editable,
      codable: $codable,
    },
    options: {
      airMode: false,
      disableResizeEditor: false,
      minHeight: 50,
      maxHeight: 100,
      ...options,
    },
  };

  return {
    statusbar: new Statusbar(context),
    $statusbar,
    $editable,
    $codable,
  };
}

describe('Statusbar', () => {
  afterEach(() => {
    $$('body').empty();
  });

  it('locks the statusbar when resizing is disabled by options', () => {
    const airModeStatusbar = createStatusbar({ airMode: true });
    airModeStatusbar.statusbar.initialize();
    expect(airModeStatusbar.$statusbar.hasClass('locked')).to.be.true;

    airModeStatusbar.$statusbar.remove();
    airModeStatusbar.$editable.remove();
    airModeStatusbar.$codable.remove();

    const disabledStatusbar = createStatusbar({ disableResizeEditor: true });
    disabledStatusbar.statusbar.initialize();
    expect(disabledStatusbar.$statusbar.hasClass('locked')).to.be.true;
  });

  it('resizes editable and codable areas on mouse drag and removes move handlers on mouseup', () => {
    const { statusbar, $statusbar, $editable, $codable } = createStatusbar();

    statusbar.initialize();

    $statusbar[0].dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientY: 140 }));
    expect($editable.css('height')).to.equal('50px');
    expect($codable.css('height')).to.equal('50px');

    document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientY: 260 }));
    expect($editable.css('height')).to.equal('100px');
    expect($codable.css('height')).to.equal('100px');

    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientY: 180 }));
    expect($editable.css('height')).to.equal('100px');
    expect($codable.css('height')).to.equal('100px');
  });

  it('supports touch resizing and destroy removes statusbar handlers', () => {
    const { statusbar, $statusbar, $editable, $codable } = createStatusbar({
      minHeight: 0,
      maxHeight: 80,
    });

    statusbar.initialize();

    const touchStart = new Event('touchstart', { bubbles: true, cancelable: true });
    $statusbar[0].dispatchEvent(touchStart);

    const touchMove = new Event('touchmove', { bubbles: true, cancelable: true });
    Object.defineProperty(touchMove, 'touches', {
      configurable: true,
      value: [{ clientY: 250 }],
    });
    document.dispatchEvent(touchMove);

    expect($editable.css('height')).to.equal('80px');
    expect($codable.css('height')).to.equal('80px');

    document.dispatchEvent(new Event('touchend', { bubbles: true }));
    statusbar.destroy();
    expect($statusbar.hasClass('locked')).to.be.true;

    $editable.height(10);
    const mouseDown = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
    $statusbar[0].dispatchEvent(mouseDown);
    document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientY: 300 }));
    expect($editable.css('height')).to.equal('10px');
  });

  it('supports unclamped resize values when no min or max height is configured', () => {
    const { statusbar, $statusbar, $editable, $codable } = createStatusbar({
      minHeight: 0,
      maxHeight: 0,
    });

    statusbar.initialize();

    $statusbar[0].dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientY: 170 }));

    expect($editable.css('height')).to.equal('46px');
    expect($codable.css('height')).to.equal('46px');
  });
});
