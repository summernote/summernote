import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import $$ from '@/js/core/dom-query.js';

describe('summernote-en-US', () => {
  let previousSummernote;

  beforeEach(() => {
    previousSummernote = $$.summernote;
  });

  afterEach(() => {
    if (previousSummernote === undefined) {
      delete $$.summernote;
    } else {
      $$.summernote = previousSummernote;
    }
  });

  it('creates the summernote namespace when it does not exist yet', async() => {
    delete $$.summernote;

    await import(/* @vite-ignore */ `/src/js/summernote-en-US.js?fresh=${Math.random()}`);

    expect($$.summernote.lang['en-US'].font.bold).to.equal('Bold');
    expect($$.summernote.lang['en-US'].image.dragImageHere).to.equal('Drag image or text here');
  });

  it('reuses the existing summernote namespace object when already defined', async() => {
    const existingNamespace = {
      lang: {},
      marker: 'keep-existing-object',
    };
    $$.summernote = existingNamespace;

    await import(/* @vite-ignore */ `/src/js/summernote-en-US.js?reuse=${Math.random()}`);

    expect($$.summernote).to.equal(existingNamespace);
    expect($$.summernote.marker).to.equal('keep-existing-object');
    expect($$.summernote.lang['en-US'].help['linkDialog.show']).to.equal('Show Link Dialog');
  });
});
