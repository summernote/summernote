/**
 * Style.spec.js
 * (c) 2015~ Summernote Team
 * summernote may be freely distributed under the MIT license./
 */
define([
  'jquery',
  'summernote/base/core/dom',
  'summernote/base/core/range',
  'summernote/base/editing/Style'
], function ($, dom, range, Style) {
  return function () {
    var style = new Style();

    var equalsToUpperCase = function (actual, expected, comment) {
      ok(actual.toUpperCase() === expected.toUpperCase(), comment);
    };

    test('style.styleNodes basic', function () {
      var $cont, $p, $b, $span, rng, nodes;

      $cont = $('<div class="note-editable"><p>text</p></div>');
      $p = $cont.find('p');
      rng = range.create($p[0].firstChild, 0, $p[0].firstChild, 4);
      nodes = style.styleNodes(rng);

      equalsToUpperCase(
        $cont.html(),
        '<p><span>text</span></p>',
        'should wrap selected text with span'
      );

      $cont = $('<div class="note-editable"><p>text</p></div>');
      $p = $cont.find('p');
      rng = range.create($p[0].firstChild, 1, $p[0].firstChild, 3);
      nodes = style.styleNodes(rng);

      equalsToUpperCase(
        $cont.html(),
        '<p>t<span>ex</span>t</p>',
        'should split text and wrap selected text with span'
      );

      $cont = $('<div class="note-editable"><p>text</p></div>');
      $p = $cont.find('p');
      rng = range.create($p[0].firstChild, 2, $p[0].firstChild, 2);
      nodes = style.styleNodes(rng);

      equalsToUpperCase(
        $cont.html(),
        '<p>te<span></span>xt</p>',
        'should split text and insert span'
      );

      $cont = $('<div class="note-editable"><p><span>text</span></p></div>');
      $span = $cont.find('span');
      rng = range.create($span[0].firstChild, 0, $span[0].firstChild, 4);
      nodes = style.styleNodes(rng);

      equalsToUpperCase(
        $cont.html(),
        '<p><span>text</span></p>',
        'should just return parent span'
      );

      $cont = $('<div class="note-editable"><p><b>bold</b><span>span</span></p></div>');
      $b = $cont.find('b');
      $span = $cont.find('span');
      rng = range.create($b[0].firstChild, 2, $span[0].firstChild, 2);
      nodes = style.styleNodes(rng);

      equalsToUpperCase(
        $cont.html(),
        '<p><b>bo<span>ld</span></b><span><span>sp</span>an</span></p>',
        'should wrap each texts with span'
      );

      $cont = $('<div class="note-editable"><p><b>bold</b><span>span</span></p></div>');
      $b = $cont.find('b');
      $span = $cont.find('span');
      rng = range.create($b[0].firstChild, 2, $span[0].firstChild, 4);
      nodes = style.styleNodes(rng);

      equalsToUpperCase(
        $cont.html(),
        '<p><b>bo<span>ld</span></b><span>span</span></p>',
        'should wrap each texts with span except not single blood line'
      );
    });

    test('style.styleNodes options', function () {
      var $cont, $p, rng, nodes;

      $cont = $('<div class="note-editable"><p>text<b>bold</b></p></div>');
      $p = $cont.find('p');
      rng = range.create($p[0].firstChild, 0, $p[0].firstChild, 4);
      nodes = style.styleNodes(rng, {
        nodeName: 'B',
        expandClosestSibling: true
      });

      equalsToUpperCase(
        $cont.html(),
        '<p><b>textbold</b></p>',
        'should expand b tag with expandClosestSibling option'
      );

      $cont = $('<div class="note-editable"><p>text<b>bold</b></p></div>');
      $p = $cont.find('p');
      rng = range.create($p[0].firstChild, 0, $p[0].firstChild, 4);
      nodes = style.styleNodes(rng, {
        nodeName: 'B',
        expandClosestSibling: true,
        onlyPartialContains: true
      });

      equalsToUpperCase(
        $cont.html(),
        '<p><b>text</b><b>bold</b></p>',
        'should not expand b tag with onlyPartialContains option'
      );
    });

    test('style.current basic', function () {
      var $cont, $p, rng, styleInfo;

      $cont = $('<div class="note-editable"><p style="font-family: Arial;">text</p></div>');
      $p = $cont.find('p');
      rng = range.create($p[0].firstChild, 0, $p[0].firstChild, 0);
      styleInfo = style.current(rng);

      equal(
        styleInfo['font-family'],
        'Arial',
        'should return parent style when text node is selected'
      );

      $cont = $('<div class="note-editable"><p style="font-family: Arial;"><!-- comment --></p></div>');
      $p = $cont.find('p');
      rng = range.create($p[0].firstChild, 0, $p[0].firstChild, 0);
      styleInfo = style.current(rng);

      equal(
        styleInfo['font-family'],
        'Arial',
        'should return parent style when comment node is selected'
      );
    });
  };
});
