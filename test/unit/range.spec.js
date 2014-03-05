/**
 * range.spec.js
 * (c) 2013~ Alan Hong
 * summernote may be freely distributed under the MIT license./
 */
define(['jquery', 'summernote/core/dom', 'summernote/core/range'], function ($, dom, range) {
  return function () {
    test('rng.nodes', function () {
      var rng, $cont, $para, $li, $h1, $h2, $b;

      //01. 1 depth 
      $cont = $('<div><p>para1</p><p>para2</p></div>');
      $para = $cont.find('p');
      rng = range.create($para[0].firstChild, 0, $para[1].firstChild, 1);
      equal(rng.nodes(dom.isPara).length, 2, 'should nodes return array of paragraphs[2]');

      rng = range.create($para[0].firstChild, 0, $para[0].firstChild, 0);
      equal(rng.nodes(dom.isPara).length, 1, 'should nodes return array of a para');

      //02. multi depth
      $cont = $('<div><p>p<b>ar</b>a1</p><p>para2</p></div>');
      $b = $cont.find('b');
      rng = range.create($b[0].firstChild, 0, $b[0].firstChild, 0);
      equal(rng.nodes(dom.isPara).length, 1, 'should nodes return array of a para');

      //03. on list, on heading
      $cont = $('<div><ul><li>para1</li><li>para2</li></ul></div>');
      $li = $cont.find('li');
      rng = range.create($li[0].firstChild, 0, $li[1].firstChild, 1);
      equal(rng.nodes(dom.isPara).length, 2, 'should nodes return array of list paragraphs');

      $cont = $('<div><h1>heading1</h1><h2>heading2</h2></div>');
      $h1 = $cont.find('h1');
      $h2 = $cont.find('h2');
      rng = range.create($h1[0].firstChild, 0, $h2[0].firstChild, 1);
      equal(rng.nodes(dom.isPara).length, 2, 'should nodes return array of list paragraphs');
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
  };
});
