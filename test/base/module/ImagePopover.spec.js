import { describe, it, expect } from 'vitest';
import { computeImagePopoverPlacement, IMAGE_POPOVER_ARROW_OFFSET, IMAGE_POPOVER_GAP } from '@/js/module/ImagePopover.js';

describe('ImagePopover', () => {
  it('anchors the toolbar close to the click position inside the image', () => {
    const position = computeImagePopoverPlacement({
      containerWidth: 800,
      containerHeight: 600,
      imageLeft: 240,
      imageTop: 180,
      imageHeight: 120,
      popoverWidth: 220,
      popoverHeight: 48,
      anchorLeft: 315,
      anchorTop: 215,
    });

    expect(position.left).to.equal(315 - IMAGE_POPOVER_ARROW_OFFSET);
    expect(position.top).to.equal(215 + IMAGE_POPOVER_GAP);
    expect(position.placement).to.equal('bottom');
  });

  it('keeps the toolbar fully inside the editor width', () => {
    const position = computeImagePopoverPlacement({
      containerWidth: 320,
      containerHeight: 600,
      imageLeft: 240,
      imageTop: 180,
      imageHeight: 120,
      popoverWidth: 220,
      popoverHeight: 48,
      anchorLeft: 310,
      anchorTop: 215,
    });

    expect(position.left).to.equal(100);
  });

  it('falls back above the image when there is no room near the click position', () => {
    const position = computeImagePopoverPlacement({
      containerWidth: 800,
      containerHeight: 220,
      imageTop: 180,
      imageHeight: 80,
      popoverWidth: 220,
      popoverHeight: 48,
      anchorLeft: 150,
      anchorTop: 205,
    });

    expect(position.top).to.equal(180 - 48 - IMAGE_POPOVER_GAP);
    expect(position.placement).to.equal('top');
  });

  it('keeps the fallback toolbar above the image near the top edge', () => {
    const position = computeImagePopoverPlacement({
      containerWidth: 800,
      containerHeight: 600,
      imageLeft: 120,
      imageTop: 10,
      imageHeight: 80,
      popoverWidth: 220,
      popoverHeight: 48,
      anchorLeft: 150,
      anchorTop: null,
    });

    expect(position.top).to.equal(0);
    expect(position.placement).to.equal('top');
  });
});
