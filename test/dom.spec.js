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
