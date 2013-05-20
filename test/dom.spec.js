/**
 * dom.spec.js
 * (c) 2013~ Youngteac Hong
 * summernote may be freely distributed under the MIT license./
 */
var dom = $.fn.summernoteInner().dom;

test('dom.ancestor', function() {
  var $cont, $b, elB;

  $cont = $('<div><b>b</b><u>u</u><s>s</s><i>i</i></div>'); //busi
  $b = $cont.find('b'), elB = $b[0].firstChild;

  equal(dom.ancestor(elB, dom.isB), $b[0], 'find ancestor B');
  equal(dom.ancestor(elB, dom.isDiv), $cont[0], 'find ancestor DIV');

  equal(dom.ancestor(elB, dom.isU), null, 'find ancestor U: null');
});

test('listAncestor', function() {
  var $cont, $b, $u, $s, $i;

  $cont = $('<div><i><s><u><b>b</b></u></s></i></div>'); //busi
  $b = $cont.find('b'), $u = $cont.find('u'),
  $s = $cont.find('s'), $i = $cont.find('i');

  deepEqual(dom.listAncestor($b[0], function(node) {
    return node === $i[0];
  }), [$b[0], $u[0], $s[0], $i[0]], 'listAncestor from b to i');

  deepEqual(dom.listAncestor($u[0], function(node) {
    return node === $s[0];
  }), [$u[0], $s[0]], 'listAncestor from u to s');

});

test('commonAncestor', function() {
  var $cont, $b, elB;

  $cont = $('<div><span><b>b</b><u>u</u></span><span><s>s</s><i>i</i></span></div>');
  $span = $cont.find('span');
  $b = $cont.find('b'), $u = $cont.find('u'),
  $s = $cont.find('s'), $i = $cont.find('i');

  equal(dom.commonAncestor($b[0], $u[0]), $span[0], 'common(b, u) => span');
  equal(dom.commonAncestor($b[0], $s[0]), $cont[0], 'common(b, s) => div');
});

test('dom.listBetween', function() {
  var $cont, $b, $u, $s, $i;
  
  $cont = $('<div><b>b</b><u>u</u><s>s</s><i>i</i></div>'); //busi
  $b = $cont.find('b'), $u = $cont.find('u'),
  $s = $cont.find('s'), $i = $cont.find('i');

  deepEqual(dom.listBetween($b[0], $b[0]), [$b[0]], 'same elements');
  deepEqual(dom.listBetween($b[0], $u[0]), [$b[0], $b[0].firstChild, $u[0]], 'adjacent');
  deepEqual(dom.listBetween($b[0], $s[0]), [$b[0], $b[0].firstChild,
                                            $u[0], $u[0].firstChild,
                                            $s[0]], 'distance 2');
});
