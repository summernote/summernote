/**
 * range.spec.js
 * (c) 2013~ Alan Hong
 * summernote may be freely distributed under the MIT license./
 */
var range = $.fn.summernoteInner().range;

test('rng.listPara', function() {
  var $cont, $b, elB, rng;

  //01. 1 depth 
  $cont = $('<div><p>para1</p><p>para2</p></div>');
  $para = $cont.find('p');
  rng = range.create($para[0].firstChild, 0, $para[1].firstChild, 1);
  equal(rng.listPara().length, 2, 'should listPara return array of paragraphs[2]');

  rng = range.create($para[0].firstChild, 0, $para[0].firstChild, 0);
  equal(rng.listPara().length, 1, 'should listPara return array of a para');

  //02. multi depth
  $cont = $('<div><p>p<b>ar</b>a1</p><p>para2</p></div>');
  $b = $cont.find('b');
  rng = range.create($b[0].firstChild, 0, $b[0].firstChild, 0);
  equal(rng.listPara().length, 1, 'should listPara return array of a para');

  //03. on list, on heading
  $cont = $('<div><ul><li>para1</li><li>para2</li></ul></div>');
  $li = $cont.find('li');
  rng = range.create($li[0].firstChild, 0, $li[1].firstChild, 1);
  equal(rng.listPara().length, 2, 'should listPara return array of list paragraphs');

  $cont = $('<div><h1>heading1</h1><h2>heading2</h2></div>');
  $h1 = $cont.find('h1'), $h2 = $cont.find('h2');
  rng = range.create($h1[0].firstChild, 0, $h2[0].firstChild, 1);
  equal(rng.listPara().length, 2, 'should listPara return array of list paragraphs');
});
