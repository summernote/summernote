import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import $ from 'jquery';
import Context from '@/js/Context';
import range from '@/js/core/range';
import '@/styles/lite/summernote-lite';

describe('Lite dropdown dismissal', () => {
  let $note, context, $toolbar;

  beforeEach(() => {
    $note = $('<div><p>hello</p></div>').appendTo('body');
    const options = $.extend({}, $.summernote.options, {
      toolbar: [
        ['test-table', ['table']],
        ['test-color', ['color']],
        ['test-paragraph', ['paragraph']],
        ['test-style', ['style']],
        ['font', ['bold']],
        ['view', ['codeview']],
      ],
    });
    context = new Context($note, options);
    $toolbar = context.layoutInfo.toolbar;
    range.createFromNode(context.layoutInfo.editable.find('p')[0]).normalize().select();
  });

  afterEach(() => {
    context.destroy();
    $note.remove();
  });

  function openDropdown(name) {
    const $toggle = $toolbar.find(`.note-test-${name} .dropdown-toggle`);
    $toggle[0].click();
    expect($toggle.parent().hasClass('open')).to.be.true;
    expect($toggle.hasClass('active')).to.be.true;
    return $toggle;
  }

  it.each(['table', 'color', 'paragraph'])('closes the %s dropdown when clicking the code view icon', (name) => {
    const $toggle = openDropdown(name);
    $toolbar.find('.btn-codeview i')[0].click();

    expect(context.layoutInfo.editor.hasClass('codeview')).to.be.true;
    expect($toggle.parent().hasClass('open')).to.be.false;
    expect($toggle.hasClass('active')).to.be.false;
  });

  it('closes a dropdown when applying bold without clearing the bold state', () => {
    const $toggle = openDropdown('table');
    const $bold = $toolbar.find('.note-btn-bold');
    $bold[0].click();

    expect($toggle.parent().hasClass('open')).to.be.false;
    expect($toggle.hasClass('active')).to.be.false;
    expect($bold.hasClass('active')).to.be.true;
    expect(context.layoutInfo.editable.html()).to.equalsIgnoreCase('<p><b>hello</b></p>');
  });

  it('still toggles closed when clicking the same dropdown button', () => {
    const $toggle = openDropdown('table');
    $toggle[0].click();

    expect($toggle.parent().hasClass('open')).to.be.false;
    expect($toggle.hasClass('active')).to.be.false;
  });

  it('closes the previous dropdown while keeping a newly opened dropdown visible', () => {
    const $previous = openDropdown('table');
    const $next = openDropdown('paragraph');

    expect($previous.parent().hasClass('open')).to.be.false;
    expect($previous.hasClass('active')).to.be.false;
    expect($next.next().is(':visible')).to.be.true;
  });

  it('still closes after selecting a menu item', () => {
    const $toggle = openDropdown('style');
    $toggle.next().find('[data-value="h2"]')[0].click();

    expect($toggle.parent().hasClass('open')).to.be.false;
    expect($toggle.hasClass('active')).to.be.false;
    expect(context.layoutInfo.editable.find('h2').text()).to.equal('hello');
  });

  it('still closes when clicking the editing area', () => {
    const $toggle = openDropdown('table');
    context.layoutInfo.editable[0].click();

    expect($toggle.parent().hasClass('open')).to.be.false;
    expect($toggle.hasClass('active')).to.be.false;
  });
});
