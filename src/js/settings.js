define('settings', function () {
  var settings = {
    // version
    version: '@VERSION',

    /**
     * options for init
     */
    options: {
      width: null,                  // set editor width
      height: null,                 // set editable height, ex) 300

      focus: false,                 // set focus after initilize summernote

      tabsize: null,                // size of tab ex) 2 or 4
      styleWithSpan: true,          // style with span (Chrome and FF)

      disableLinkTarget: false,     // hide link Target Checkbox
      disableDragAndDrop: false,    // disable drag and drop event

      codemirror: null,             // codemirror options

      // language
      lang: 'en-US',                // language 'en-US', 'ko-KR', ...
      direction: null,              // text direction, ex) 'rtl'

      // default toolbar
      toolbar: [
        ['style', ['style']],
        ['font', ['bold', 'italic', 'underline', 'clear']],
        ['fontname', ['fontname']],
        // ['fontsize', ['fontsize']], Still buggy
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['height', ['height']],
        ['table', ['table']],
        ['insert', ['link', 'picture', 'video']],
        ['view', ['fullscreen', 'codeview']],
        ['help', ['help']]
      ],

      // callbacks
      oninit: null,             // initialize
      onfocus: null,            // editable has focus
      onblur: null,             // editable out of focus
      onenter: null,            // enter key pressed
      onkeyup: null,            // keyup
      onkeydown: null,          // keydown
      onImageUpload: null,      // imageUploadHandler
      onImageUploadError: null, // imageUploadErrorHandler
      onToolbarClick: null
    },

    // default language: en-US
    lang: {
      'en-US': {
        font: {
          bold: 'Bold',
          italic: 'Italic',
          underline: 'Underline',
          strike: 'Strike',
          clear: 'Remove Font Style',
          height: 'Line Height',
          name: 'Font Family',
          size: 'Font Size'
        },
        image: {
          image: 'Picture',
          insert: 'Insert Image',
          resizeFull: 'Resize Full',
          resizeHalf: 'Resize Half',
          resizeQuarter: 'Resize Quarter',
          floatLeft: 'Float Left',
          floatRight: 'Float Right',
          floatNone: 'Float None',
          dragImageHere: 'Drag an image here',
          selectFromFiles: 'Select from files',
          url: 'Image URL',
          remove: 'Remove Image'
        },
        link: {
          link: 'Link',
          insert: 'Insert Link',
          unlink: 'Unlink',
          edit: 'Edit',
          textToDisplay: 'Text to display',
          url: 'To what URL should this link go?',
          openInNewWindow: 'Open in new window'
        },
        video: {
          video: 'Video',
          videoLink: 'Video Link',
          insert: 'Insert Video',
          url: 'Video URL?',
          providers: '(YouTube, Vimeo, Vine, Instagram, or DailyMotion)'
        },
        table: {
          table: 'Table'
        },
        hr: {
          insert: 'Insert Horizontal Rule'
        },
        style: {
          style: 'Style',
          normal: 'Normal',
          blockquote: 'Quote',
          pre: 'Code',
          h1: 'Header 1',
          h2: 'Header 2',
          h3: 'Header 3',
          h4: 'Header 4',
          h5: 'Header 5',
          h6: 'Header 6'
        },
        lists: {
          unordered: 'Unordered list',
          ordered: 'Ordered list'
        },
        options: {
          help: 'Help',
          fullscreen: 'Full Screen',
          codeview: 'Code View'
        },
        paragraph: {
          paragraph: 'Paragraph',
          outdent: 'Outdent',
          indent: 'Indent',
          left: 'Align left',
          center: 'Align center',
          right: 'Align right',
          justify: 'Justify full'
        },
        color: {
          recent: 'Recent Color',
          more: 'More Color',
          background: 'BackColor',
          foreground: 'FontColor',
          transparent: 'Transparent',
          setTransparent: 'Set transparent',
          reset: 'Reset',
          resetToDefault: 'Reset to default'
        },
        shortcut: {
          shortcuts: 'Keyboard shortcuts',
          close: 'Close',
          textFormatting: 'Text formatting',
          action: 'Action',
          paragraphFormatting: 'Paragraph formatting',
          documentStyle: 'Document Style'
        },
        history: {
          undo: 'Undo',
          redo: 'Redo'
        }
      }
    }
  };

  return settings;
});

