// nativeRange, dom reference
var nativeRange = summernote.nativeRange;
var dom = summernote.dom;

test('nativeRange', function() {
  var $cont, $b, $i;
  
  $cont = $('<div><b>b</b><u>u</u><s>s</s><i>i</i></div>'); //busi
  $b = $cont.find('b'), $i = $cont.find('i');
  
  // FF, Webkit, IE9+
  var range = nativeRange($b[0], 0, $i[0], 1);
  ok('busi' === range.toString(), 'range toString');
});
