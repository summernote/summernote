import { describe, expect, it } from 'vitest';
import { createImage, readFileAsDataURL } from '@/js/core/async';

describe('core/async', () => {
  it('reads files as data URLs with native promises', async() => {
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
    const dataUrl = await readFileAsDataURL(file);

    expect(dataUrl).to.contain('data:text/plain;base64,');
  });

  it('creates images with native promises', async() => {
    const dataUrl = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
    const $image = await createImage(dataUrl);

    expect($image.length).to.equal(1);
    expect($image[0].tagName).to.equal('IMG');
    expect($image.attr('src')).to.equal(dataUrl);
  });
});
