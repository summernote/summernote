import { afterEach, describe, expect, it, vi } from 'vitest';
import { createImage, readFileAsDataURL } from '@/js/core/async';

describe('core/async', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('reads files as data URLs with native promises', async() => {
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
    const dataUrl = await readFileAsDataURL(file);

    expect(dataUrl).to.contain('data:text/plain;base64,');
  });

  it('rejects file reads when FileReader emits an error', async() => {
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
    const error = new Error('read failed');

    class BrokenFileReader {
      readAsDataURL() {
        this.onerror(error);
      }
    }

    vi.stubGlobal('FileReader', BrokenFileReader);

    await expect(readFileAsDataURL(file)).rejects.to.equal(error);
  });

  it('creates images with native promises', async() => {
    const dataUrl = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
    const promise = createImage(dataUrl);
    const img = document.body.lastChild;

    img.dispatchEvent(new Event('load'));
    const $image = await promise;

    expect($image.length).to.equal(1);
    expect($image[0].tagName).to.equal('IMG');
    expect($image.attr('src')).to.equal(dataUrl);
  });

  it('rejects image creation and removes appended nodes on error', async() => {
    const promise = createImage('broken-image');
    const img = document.body.lastChild;

    img.dispatchEvent(new Event('error'));

    const $image = await promise.catch((value) => value);
    expect($image[0]).to.equal(img);
    expect(document.body.contains(img)).to.be.false;
  });

  it('rejects image creation without attempting removal when the image is already detached', async() => {
    const promise = createImage('detached-image');
    const img = document.body.lastChild;
    document.body.removeChild(img);

    img.dispatchEvent(new Event('abort'));

    const $image = await promise.catch((value) => value);
    expect($image[0]).to.equal(img);
    expect(document.body.contains(img)).to.be.false;
  });
});
