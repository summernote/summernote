import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import $$ from '@/js/core/dom-query.js';

describe('summernote-de-DE', () => {
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

  it('registers the German translation on the existing summernote namespace', async() => {
    $$.summernote = {
      lang: {
        'en-US': {
          font: {
            bold: 'Bold',
          },
        },
      },
    };

    await import(/* @vite-ignore */ `/src/js/summernote-de-DE.js?fresh=${Math.random()}`);

    expect($$.summernote.lang['de-DE'].font.bold).to.equal('Fett');
    expect($$.summernote.lang['de-DE'].video.play).to.equal('Abspielen');
    expect($$.summernote.lang['de-DE'].output.noSelection).to.equal('Keine Auswahl getroffen!');
    expect($$.summernote.lang['de-DE'].color.colorsName[0][0]).to.equal('Schwarz');
    expect($$.summernote.lang['de-DE'].helpDialog.links.examples).to.equal('Beispiele');
  });

  it('creates the summernote namespace when it does not exist yet', async() => {
    delete $$.summernote;

    await import(/* @vite-ignore */ `/src/js/summernote-de-DE.js?reuse=${Math.random()}`);

    expect($$.summernote.lang['de-DE'].link.openInNewWindow).to.equal('In neuem Fenster öffnen');
    expect($$.summernote.lang['de-DE'].color.cpSelect).to.equal('Auswählen');
    expect($$.summernote.lang['de-DE'].helpDialog.platform.pc).to.equal('Windows und Linux');
  });
});
