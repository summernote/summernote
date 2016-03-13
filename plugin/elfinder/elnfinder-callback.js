function elfinderDialog() {
  var fm = $('<div/>').dialogelfinder({
    url : 'http://yoursite.com/js/elfinder/php/connector.php', // change with the url of your connector
    lang : 'en',
    width : 840,
    height: 450,
    destroyOnClose : true,
    getFileCallback : function(files, fm) {
      console.log(files);
      $('.editor').summernote('editor.insertImage', files.url);
    },
    commandsOptions : {
      getfile : {
        oncomplete : 'close',
        folders : false
      }
    }

  }).dialogelfinder('instance');
}
