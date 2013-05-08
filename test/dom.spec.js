// dom reference
var dom = summernote.dom;
test('isText', function() {
  var $cont = $('<div>asdf</div>');
  ok(!dom.isText($cont[0]), 'div is false');
  ok(dom.isText($cont[0].firstChild), 'text is true');
});

test('listPrev', function() {
  var $cont, $b, $u, $s, $i;
  
  $cont = $('<div><b>b</b><u>u</u><s>s</s><i>i</i></div>'); //busi
  $b = $cont.find('b'), $u = $cont.find('u'),
  $s = $cont.find('s'), $i = $cont.find('i');

  deepEqual(dom.listPrev($i[0]), [$i[0], $s[0], $u[0], $b[0]], 'i, s, u ,b');
  deepEqual(dom.listPrev($s[0]), [$s[0], $u[0], $b[0]], 's, u ,b');
  deepEqual(dom.listPrev($u[0]), [$u[0], $b[0]], 'u ,b');
  deepEqual(dom.listPrev($b[0]), [$b[0]], 'b');
});
