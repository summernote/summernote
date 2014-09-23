/**
 * dom.spec.js
 * (c) 2013~ Alan Hong
 * summernote may be freely distributed under the MIT license./
 */
define(['jquery', 'summernote/core/dom', 'summernote/core/func'], function ($, dom, func) {
  return function () {
    test('dom.ancestor', function () {
      var $cont, $b, elB;

      // basic case
      $cont = $('<div class="note-editable"><b>b</b><u>u</u><s>s</s><i>i</i></div>'); //busi
      $b = $cont.find('b');
      elB = $b[0].firstChild;

      equal(dom.ancestor(elB, dom.isB), $b[0], 'find ancestor B');
      equal(dom.ancestor(elB, dom.isDiv), $cont[0], 'find ancestor DIV');

      equal(dom.ancestor(elB, dom.isU), null, 'find ancestor U: null');

      // keep boundary
      $cont = $('<ul><li><div class="note-editable"><b>b</b></div></li></ul>'); //b
      elB = $cont.find('b')[0].firstChild;
      equal(dom.ancestor(elB, dom.isLi), null, 'find paragraph ancestor outside note-editable: null');
    });

    test('dom.listAncestor', function () {
      var $cont, $b, $u, $s, $i;

      $cont = $('<div class="note-editable"><i><s><u><b>b</b></u></s></i></div>'); //busi
      $b = $cont.find('b');
      $u = $cont.find('u');
      $s = $cont.find('s');
      $i = $cont.find('i');

      deepEqual(dom.listAncestor($b[0], function (node) {
        return node === $i[0];
      }), [$b[0], $u[0], $s[0], $i[0]], 'listAncestor from b to i should returns [$b, $u, $s, $i]');

      deepEqual(dom.listAncestor($u[0], function (node) {
        return node === $s[0];
      }), [$u[0], $s[0]], 'listAncestor from u to s should returns [$u, $s]');

    });

    test('dom.listDescendant', function () {
      var $cont, $b, $u, $s, $i;

      $cont = $('<div class="note-editable"><b></b><u></u><s></s><i></i></div>'); //busi
      $b = $cont.find('b');
      $u = $cont.find('u');
      $s = $cont.find('s');
      $i = $cont.find('i');

      deepEqual(
        dom.listDescendant($cont[0]), [$b[0], $u[0], $s[0], $i[0]],
        'listDescendant($cont) should returns [$b, $u, $s, $i]'
      );

      deepEqual(
        dom.listDescendant($cont[0], function (node) {
          return node.nodeName === 'B' || node.nodeName === 'S';
        }),
        [$b[0], $s[0]], 'listDescendant($cont, pred(b,s) should returns [$b, $s]'
      );

    });

    test('dom.commonAncestor', function () {
      var $cont, $span, $div, $b, $u, $s, $i;

      $cont = $('<div class="note-editable"><div><span><b>b</b><u>u</u></span><span><s>s</s><i>i</i></span></div></div>');
      $span = $cont.find('span');
      $div = $cont.find('div');
      $b = $cont.find('b');
      $u = $cont.find('u');
      $s = $cont.find('s');
      $i = $cont.find('i');

      equal(dom.commonAncestor($b[0], $u[0]), $span[0], 'common(b, u) => span');
      equal(dom.commonAncestor($b[0], $s[0]), $div[0], 'common(b, s) => div');
    });

    test('dom.listNext', function () {
      var $cont, $b, $u, $s, $i;

      $cont = $('<div class="note-editable"><b>b</b><u>u</u><s>s</s><i>i</i></div>'); //busi
      $b = $cont.find('b');
      $u = $cont.find('u');
      $s = $cont.find('s');
      $i = $cont.find('i');

      deepEqual(dom.listNext($u[0]), [$u[0], $s[0], $i[0]], 'with no pred');
      deepEqual(dom.listNext($i[0]), [$i[0]], 'last item with no pred');

      deepEqual(dom.listNext($s[0], func.eq($i[0])), [$s[0]], 's to i');
    });

    test('dom.listPrev', function () {
      var $cont, $b, $u, $s, $i;

      $cont = $('<div class="note-editable"><b>b</b><u>u</u><s>s</s><i>i</i></div>'); //busi
      $b = $cont.find('b');
      $u = $cont.find('u');
      $s = $cont.find('s');
      $i = $cont.find('i');

      deepEqual(dom.listPrev($s[0]), [$s[0], $u[0], $b[0]], 'with no pred');
      deepEqual(dom.listPrev($b[0]), [$b[0]], 'first item with no pred');

      deepEqual(dom.listPrev($i[0], func.eq($s[0])), [$i[0]], 'i to s');
    });

    test('dom.position', function () {
      var $cont, $b, $u, $s, $i;

      $cont = $('<div class="note-editable"><b>b</b><u>u</u><s>s</s><i>i</i></div>'); //busi
      $b = $cont.find('b');
      $u = $cont.find('u');
      $s = $cont.find('s');
      $i = $cont.find('i');

      equal(dom.position($b[0]), 0, 'should b return zero');
      equal(dom.position($u[0]), 1, 'should u return one');
      equal(dom.position($s[0]), 2, 'should s return three');
      equal(dom.position($i[0]), 3, 'should i return four');

      equal(dom.position($b[0].firstChild), 0, 'should text in b return zero');
    });

    test('dom.makeOffsetPath', function () {
      var $cont, $b, $u, $s, $i;

      $cont = $('<div class="note-editable"><b>b</b><u>u</u><s>s</s><i>i</i></div>'); //busi
      $b = $cont.find('b');
      $u = $cont.find('u');
      $s = $cont.find('s');
      $i = $cont.find('i');

      deepEqual(dom.makeOffsetPath($cont[0], $cont[0]), [], 'should return empty list');

      deepEqual(dom.makeOffsetPath($cont[0], $b[0]), [0], 'should return [0]');
      deepEqual(dom.makeOffsetPath($cont[0], $b[0].firstChild), [0, 0], 'should return [0, 0]');

      deepEqual(dom.makeOffsetPath($cont[0], $u[0]), [1], 'shuold return [1]');
      deepEqual(dom.makeOffsetPath($cont[0], $u[0].firstChild), [1, 0], 'shuold return [1, 0]');

      deepEqual(dom.makeOffsetPath($cont[0], $s[0]), [2], 'shuold return [2]');
      deepEqual(dom.makeOffsetPath($cont[0], $s[0].firstChild), [2, 0], 'shuold return [2, 0]');

      deepEqual(dom.makeOffsetPath($cont[0], $i[0]), [3], 'shuold return [3]');
      deepEqual(dom.makeOffsetPath($cont[0], $i[0].firstChild), [3, 0], 'shuold return [3, 0]');
    });

    test('dom.fromOffsetPath', function () {
      var $cont, $b, $u, $s, $i;

      $cont = $('<div class="note-editable"><b>b</b><u>u</u><s>s</s><i>i</i></div>'); //busi
      $b = $cont.find('b');
      $u = $cont.find('u');
      $s = $cont.find('s');
      $i = $cont.find('i');

      var cont = $cont[0];
      $.each([$b[0], $u[0], $s[0], $i[0]], function (idx, node) {
        equal(dom.fromOffsetPath(cont, dom.makeOffsetPath(cont, node)), node);
        var child = node.firstChild;
        equal(dom.fromOffsetPath(cont, dom.makeOffsetPath(cont, child)), child);
      });
    });

    var equalsToUpperCase = function (actual, expected, comment) {
      ok(actual.toUpperCase() === expected.toUpperCase(), comment);
    };

    test('dom.splitTree', function () {
      var $busi, $para, $cont, $b, $u, $s, $i, $span;
      $busi = $('<div class="note-editable"><p><b>b</b><u>u</u><s>strike</s><i>i</i></p></div>'); //busi

      // 01. element pivot case
      $para = $busi.clone().find('p');
      $u = $para.find('u');
      dom.splitTree($para[0], {node: $u[0], offset: 0 });
      equalsToUpperCase($para.html(), '<b>b</b><u><br></u>', 'splitBy u tag with offset 0');
      equalsToUpperCase($para.next().html(), '<u>u</u><s>strike</s><i>i</i>', 'right hand side');

      $para = $busi.clone().find('p');
      $u = $para.find('u');
      dom.splitTree($para[0], {node: $u[0], offset: 1 });
      equalsToUpperCase($para.html(), '<b>b</b><u>u</u>', 'splitBy u tag with offset 1');
      equalsToUpperCase($para.next().html(), '<u><br></u><s>strike</s><i>i</i>', 'right hand side');

      $para = $busi.clone().find('p');
      $b = $para.find('b');
      dom.splitTree($para[0], {node: $b[0], offset: 0 });
      equalsToUpperCase($para.html(), '<b><br></b>', 'splitBy b tag with offset 0 (left edge case)');
      equalsToUpperCase($para.next().html(), '<b>b</b><u>u</u><s>strike</s><i>i</i>', 'right hand side');

      $para = $busi.clone().find('p');
      $i = $para.find('i');
      dom.splitTree($para[0], {node: $i[0], offset: 1 });
      equalsToUpperCase($para.html(),
                        '<b>b</b><u>u</u><s>strike</s><i>i</i>', 'splitBy i tag with offset 1 (right edge case)');
      equalsToUpperCase($para.next().html(), '<i><br></i>', 'right hand side');

      // 02. textNode case
      $para = $busi.clone().find('p');
      $s = $para.find('s');
      dom.splitTree($para[0], {node: $s[0].firstChild, offset: 3 });
      equalsToUpperCase($para.html(), '<b>b</b><u>u</u><s>str</s>', 'splitBy s tag with offset 3 (middle case)');
      equalsToUpperCase($para.next().html(), '<s>ike</s><i>i</i>', 'right hand side');

      $para = $busi.clone().find('p');
      $s = $para.find('s');
      dom.splitTree($para[0], {node: $s[0].firstChild, offset: 0 });
      equalsToUpperCase($para.html(), '<b>b</b><u>u</u><s><br></s>', 'splitBy s tag with offset 0 (left edge case)');
      equalsToUpperCase($para.next().html(), '<s>strike</s><i>i</i>', 'right hand side');

      $para = $busi.clone().find('p');
      $s = $para.find('s');
      dom.splitTree($para[0], {node: $s[0].firstChild, offset: 6});
      equalsToUpperCase($para.html(), '<b>b</b><u>u</u><s>strike</s>', 'splitBy s tag with offset 6 (right edge case)');
      equalsToUpperCase($para.next().html(), '<s><br></s><i>i</i>', 'right hand side');

      $para = $busi.clone().find('p');
      $s = $para.find('s');
      dom.splitTree($s[0], {node: $s[0].firstChild, offset: 3});
      equalsToUpperCase($para.html(), '<b>b</b><u>u</u><s>str</s><s>ike</s><i>i</i>',
                        'splitBy s tag with offset 3 (2 depth case)');

      $para = $busi.clone().find('p');
      $s = $para.find('s');
      dom.splitTree($s[0].firstChild, {node: $s[0].firstChild, offset: 3});
      equalsToUpperCase($para.html(), '<b>b</b><u>u</u><s>strike</s><i>i</i>',
                        'splitBy s tag with offset 3 (1 depth, textNode case)');

      $cont = $('<div class="note-editable"><p><span><b>b</b><u>u</u><s>s</s><i>i</i></span></p></div>'); //busi
      $span = $cont.find('span');
      dom.splitTree($span[0], {node: $span[0], offset: 2});
      equalsToUpperCase($cont.html(), '<p><span><b>b</b><u>u</u></span><span><s>s</s><i>i</i></span></p>',
                        'splitBy span tag with offset 2 (1 depth, element case)');
    });
  };
});
