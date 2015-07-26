/**
 * range.spec.js
 * (c) 2013~ Alan Hong
 * summernote may be freely distributed under the MIT license./
 */
define([
  'jquery',
  'summernote/core/agent',
  'summernote/core/dom',
  'summernote/core/range'
], function ($, agent, dom, range) {
  return function (helper) {
    test('rng.nodes', function () {
      var rng, $cont, $para, $li, $h1, $h2, $b;

      //01. 1 depth 
      $cont = $('<div class="note-editable"><p>para1</p><p>para2</p></div>');
      $para = $cont.find('p');
      rng = range.create($para[0].firstChild, 0, $para[1].firstChild, 1);
      equal(rng.nodes(dom.isPara, {
        includeAncestor: true
      }).length, 2, 'should nodes return array of paragraphs[2]');

      rng = range.create($para[0].firstChild, 0, $para[0].firstChild, 0);
      equal(rng.nodes(dom.isPara, {
        includeAncestor: true
      }).length, 1, 'should nodes return array of a para');

      //02. multi depth
      $cont = $('<div class="note-editable"><p>p<b>ar</b>a1</p><p>para2</p></div>');
      $b = $cont.find('b');
      rng = range.create($b[0].firstChild, 0, $b[0].firstChild, 0);
      equal(rng.nodes(dom.isPara, {
        includeAncestor: true
      }).length, 1, 'should nodes return array of a para');

      //03. on list, on heading
      $cont = $('<div class="note-editable"><ul><li>para1</li><li>para2</li></ul></div>');
      $li = $cont.find('li');
      rng = range.create($li[0].firstChild, 0, $li[1].firstChild, 1);
      equal(rng.nodes(dom.isPara, {
        includeAncestor: true
      }).length, 2, 'should nodes return array of list paragraphs');

      $cont = $('<div class="note-editable"><h1>heading1</h1><h2>heading2</h2></div>');
      $h1 = $cont.find('h1');
      $h2 = $cont.find('h2');
      rng = range.create($h1[0].firstChild, 0, $h2[0].firstChild, 1);
      equal(rng.nodes(dom.isPara, {
        includeAncestor: true
      }).length, 2, 'should nodes return array of list paragraphs');
    });

    test('rng.commonAncestor', function () {
      var rng, $cont, $span, $b, $u;
      $cont = $('<div><span><b>b</b><u>u</u></span></div>');
      $span = $cont.find('span');
      $b = $cont.find('b');
      $u = $cont.find('u');

      rng = range.create($b[0].firstChild, 0, $u[0].firstChild, 1);
      equal(rng.commonAncestor(), $span[0], 'rng.commonAncestor on between <b>|b</b> and <u>u|</u> should returns <span>');

      rng = range.create($b[0].firstChild, 0, $b[0].firstChild, 1);
      equal(rng.commonAncestor(), $b[0].firstChild, 'rng.commonAncestor on <b>|b|</b> should returns b(#textNode)');

    });

    test('rng.normalize', function () {
      var rng, $cont, $p, $b, $u, $s;
      $cont = $('<div><p><b>b</b><u>u</u><s>s</s></p></div>');
      $p = $cont.find('p');
      $b = $cont.find('b');
      $u = $cont.find('u');
      $s = $cont.find('s');

      rng = range.create($p[0], 0,  $p[0], 2).normalize();
      deepEqual([
        rng.sc, rng.so, rng.ec, rng.eo
      ], [
        $b[0].firstChild, 0, $u[0].firstChild, 1
      ], 'rng.normalize on `|<b>b</b> ~ <u>u</u>|` should returns `<b>|b</b> ~ <u>u|</u>`');

      rng = range.create($p[0], 1,  $p[0], 1).normalize();
      deepEqual([
        rng.sc, rng.so, rng.ec, rng.eo
      ], [
        $b[0].firstChild, 1, $b[0].firstChild, 1
      ], 'rng.normalize on `<b>b</b>|<u>u</u>` should returns `<b>b|</b><u>u</u>`');

      rng = range.create($p[0], 1,  $p[0], 1).normalize();
      deepEqual([
        rng.sc, rng.so, rng.ec, rng.eo
      ], [
        $b[0].firstChild, 1, $b[0].firstChild, 1
      ], 'rng.normalize on `<b>b</b>|<u>u</u>` should returns `<b>b|</b><u>u</u>`');

      rng = range.create($b[0].firstChild, 1,  $s[0].firstChild, 0).normalize();
      deepEqual([
        rng.sc, rng.so, rng.ec, rng.eo
      ], [
        $u[0].firstChild, 0, $u[0].firstChild, 1
      ], 'rng.normalize on `<b>b|</b><u>u</u><s>|s</s>` should returns `<b>b</b><u>|u|</u><s>s</s>`');

      rng = range.create($b[0].firstChild, 1,  $b[0].firstChild, 1).normalize();
      deepEqual([
        rng.sc, rng.so, rng.ec, rng.eo
      ], [
        $b[0].firstChild, 1, $b[0].firstChild, 1
      ], 'rng.normalize on `<b>b|</b><u>u</u><s>s</s>` should returns `<b>b|</b><u>u</u><s>s</s>`');
    });

    test('rng.normalize (block level)', function () {
      var rng, $cont, $p;
      $cont = $('<div><p>text</p><p><br></p></div>');
      $p = $cont.find('p');

      rng = range.create($p[1], 0,  $p[1], 0).normalize();
      deepEqual([
        rng.sc, rng.so, rng.ec, rng.eo
      ], [
        $p[1], 0, $p[1], 0
      ], 'rng.normalize on `<p>text</p><p>|<br></p>` should returns `<p>text</p><p>|<br></p>`');

      $cont = $('<div><p>text</p><p>text</p></div>');
      $p = $cont.find('p');

      rng = range.create($p[1], 0,  $p[1], 0).normalize();
      deepEqual([
        rng.sc, rng.so, rng.ec, rng.eo
      ], [
        $p[1].firstChild, 0, $p[1].firstChild, 0
      ], 'rng.normalize on `<p>text</p><p>|text</p>` should returns `<p>text</p><p>|text</b></p>`');

      $cont = $('<div class="note-editable"><p>text</p><p>text</p></div>');
      $p = $cont.find('p');

      rng = range.create($cont[0], 0,  $cont[0], 2).normalize();
      deepEqual([
        rng.sc, rng.so, rng.ec, rng.eo
      ], [
        $p[0].firstChild, 0, $p[1].firstChild, 4
      ], 'rng.normalize on `|<p>text</p><p>text</p>|` should returns `<p>|text</p><p>text|</b></p>`');
    });

    test('rng.normalize (void element)', function () {
      var rng, $cont, $p, $b;
      $cont = $('<div><p><img><b>bold</b></p></div>');
      $p = $cont.find('p');
      $b = $cont.find('b');

      rng = range.create($p[0], 1,  $p[0], 1).normalize();
      deepEqual([
        rng.sc, rng.so, rng.ec, rng.eo
      ], [
        $b[0].firstChild, 0, $b[0].firstChild, 0
      ], 'rng.normalize on `<p><img>|<b>bold</b></p>` should returns `<p><img>|<b>bold</b></p>`');
    });

    test('rng.insertNode', function () {
      var $cont, $p, $p2, $b, $u;

      // insertNode with block split
      $cont = $('<div class="note-editable"><p><b>bold</b></p></div>');
      $p = $cont.find('p');
      $b = $cont.find('b');
      $p2 = $('<p>p</p>');

      range.create($b[0].firstChild, 2, $b[0].firstChild, 2).insertNode($p2[0]);
      helper.equalsToUpperCase(
        $cont.html(),
        '<p><b>bo</b></p><p>p</p><p><b>ld</b></p>',
        'rng.insertNode with block should split paragraph.'
      );

      $cont = $('<div class="note-editable"><p>text</p></div>');
      $p = $cont.find('p');
      $u = $('<u>u</u>');

      // insertNode with inline split
      range.create($p[0].firstChild, 2, $p[0].firstChild, 2).insertNode($u[0]);
      helper.equalsToUpperCase($cont.html(), '<p>te<u>u</u>xt</p>', 'rng.insertNode with inline should not split paragraph.');

      $cont = $('<div class="note-editable"><p><b>bold</b></p></div>');
      $p = $cont.find('p');
      $b = $cont.find('b');
      $u = $('<u>u</u>');

      range.create($b[0].firstChild, 2, $b[0].firstChild, 2).insertNode($u[0]);
      helper.equalsToUpperCase($cont.html(), '<p><b>bo</b><u>u</u><b>ld</b></p>', 'rng.insertNode with inline should not split paragraph.');
    });

    test('rng.pasteHTML', function () {
      var $cont, $p, $b, markup;

      // split text with inline nodes
      $cont = $('<div class="note-editable"><p>text</p></div>');
      $p = $cont.find('p');
      markup = '<span>span</span><i>italic</i>';

      range.create($p[0].firstChild, 2).pasteHTML(markup);
      helper.equalsToUpperCase(
        $cont.html(),
        '<p>te<span>span</span><i>italic</i>xt</p>',
        'rng.pasteHTML with inlines should not split text.'
      );

      // split inline node with inline nodes
      $cont = $('<div class="note-editable"><p><b>bold</b></p></div>');
      $p = $cont.find('p');
      $b = $cont.find('b');
      markup = '<span>span</span><i>italic</i>';

      range.create($b[0].firstChild, 2).pasteHTML(markup);
      helper.equalsToUpperCase(
        $cont.html(),
        '<p><b>bo</b><span>span</span><i>italic</i><b>ld</b></p>',
        'rng.pasteHTML with inlines should not split text.'
      );

      // split inline node with inline and block nodes
      $cont = $('<div class="note-editable"><p><b>bold</b></p></div>');
      $p = $cont.find('p');
      $b = $cont.find('b');
      markup = '<span>span</span><p><i>italic</i></p>';

      range.create($b[0].firstChild, 2).pasteHTML(markup);
      helper.equalsToUpperCase(
        $cont.html(),
        '<p><b>bo</b><span>span</span></p><p><i>italic</i></p><p><b>ld</b></p>',
        'rng.pasteHTML with inlines should not split text.'
      );

      // split inline node with inline and block
      $cont = $('<div class="note-editable"><p><b>bold</b></p></div>');
      $p = $cont.find('p');
      $b = $cont.find('b');
      markup = '<span>span</span><p><i>italic</i></p>';

      range.create($b[0].firstChild, 2).pasteHTML(markup);
      helper.equalsToUpperCase(
        $cont.html(),
        '<p><b>bo</b><span>span</span></p><p><i>italic</i></p><p><b>ld</b></p>',
        'rng.pasteHTML with inlines should not split text.'
      );
    });

    test('rng.deleteContents', function () {
      var $cont, $p, $b, $u;

      // deleteContents on partial text
      $cont = $('<div class="note-editable"><p><b>bold</b><u>u</u></p></div>');
      $p = $cont.find('p');
      $b = $cont.find('b');
      $u = $cont.find('u');

      range.create($b[0].firstChild, 1, $b[0].firstChild, 3).deleteContents();
      helper.equalsToUpperCase($cont.html(), '<p><b>bd</b><u>u</u></p>', 'rng.deleteContents on partial text should remove only text');

      // deleteContents on full text
      $cont = $('<div class="note-editable"><p><b>bold</b><u>u</u></p></div>');
      $p = $cont.find('p');
      $b = $cont.find('b');
      $u = $cont.find('u');

      range.create($b[0].firstChild, 0, $b[0].firstChild, 4).deleteContents();
      helper.equalsToUpperCase($cont.html(), '<p><b></b><u>u</u></p>', 'rng.deleteContents on full text should remove text');

    });

    test('rng.wrapBodyInlineWithPara', function () {
      var $cont, $b;

      // empty contents case
      $cont = $('<div class="note-editable"></div>');
      range.create($cont[0], 0).wrapBodyInlineWithPara();
      helper.equalsToUpperCase($cont.html(), '<p><br></p>', 'rng.wrapBodyInlineWithPara with blank should insert empty paragraph.');

      // body text case
      $cont = $('<div class="note-editable">text</div>');
      range.create($cont[0].firstChild, 2).wrapBodyInlineWithPara();
      helper.equalsToUpperCase($cont.html(), '<p>text</p>', 'rng.wrapBodyInlineWithPara with body text should wrap text with paragraph.');

      // body inline case 1
      $cont = $('<div class="note-editable"><b>bold</b></div>');
      $b = $cont.find('b');
      range.create($b[0].firstChild, 2).wrapBodyInlineWithPara();
      helper.equalsToUpperCase(
        $cont.html(),
        '<p><b>bold</b></p>',
        'rng.wrapBodyInlineWithPara with inline text should wrap text with paragraph.'
      );

      // body inline case 2
      $cont = $('<div class="note-editable"><b>b</b><i>i</i></div>');
      range.create($cont[0], 0).wrapBodyInlineWithPara();
      helper.equalsToUpperCase(
        $cont.html(),
        '<p><b>b</b><i>i</i></p>',
        'rng.wrapBodyInlineWithPara with inline should wrap text with paragraph.'
      );

      // body inline case 3
      $cont = $('<div class="note-editable"><b>b</b><i>i</i></div>');
      range.create($cont[0], 1).wrapBodyInlineWithPara();
      helper.equalsToUpperCase(
        $cont.html(),
        '<p><b>b</b><i>i</i></p>',
        'rng.wrapBodyInlineWithPara with inline should wrap text with paragraph.'
      );

      // body inline case 4
      $cont = $('<div class="note-editable"><b>b</b><i>i</i></div>');
      range.create($cont[0], 2).wrapBodyInlineWithPara();
      helper.equalsToUpperCase(
        $cont.html(),
        '<p><b>b</b><i>i</i></p>',
        'rng.wrapBodyInlineWithPara with inline should wrap text with paragraph.'
      );
    });

    test('rng.getWordRange', function () {
      var $cont, rng;

      $cont = $('<div class="note-editable">super simple wysiwyg editor</div>');

      // no word before cursor
      rng = range.create(
        $cont[0].firstChild, 0
      ).getWordRange();

      deepEqual([
        rng.sc, rng.so, rng.ec, rng.eo
      ], [
        $cont[0].firstChild, 0, $cont[0].firstChild, 0
      ], 'rng.getWordRange with no word before cursor should return itself');

      // find word before cursor
      rng = range.create(
        $cont[0].firstChild, 5
      ).getWordRange();

      deepEqual([
        rng.sc, rng.so, rng.ec, rng.eo
      ], [
        $cont[0].firstChild, 0, $cont[0].firstChild, 5
      ], 'rng.getWordRange with word before cursor should return expanded range');

      rng = range.create(
        $cont[0].firstChild, 3
      ).getWordRange();

      deepEqual([
        rng.sc, rng.so, rng.ec, rng.eo
      ], [
        $cont[0].firstChild, 0, $cont[0].firstChild, 3
      ], 'rng.getWordRange with half word before cursor should expanded range');

      rng = range.create(
        $cont[0].firstChild, 12
      ).getWordRange();

      deepEqual([
        rng.sc, rng.so, rng.ec, rng.eo
      ], [
        $cont[0].firstChild, 6, $cont[0].firstChild, 12
      ], 'rng.getWordRange with half word before cursor should expanded range');

    });
  };
});
