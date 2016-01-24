module.exports = {
  beforeEach: function (client) {
    client
      /* jshint -W106 */
      .url(client.launch_url + '/toolbar.html')
      /* jshint +W106 */
      .waitForElementPresent('#summernote', 1000);
  },

  'initial text area' : function (client) {
    client
      .execute(function() {
        return $('.note-editable').html();
      }, function(result) {
        client.verify.equal(result.value, '<p><br></p>');
      })
      .click('.note-editable')
      .setValue('.note-editable', 'super simple WYSIWYG editor')
      .execute(function() {
        return $('.note-editable').html();
      }, function(result) {
        client.verify.equal(result.value, '<p>super simple WYSIWYG editor<br></p>');
      })
      .end();
  },

  'Toolbar[Style] - style button' : function (client) {
    client
      .click('.note-editable')
      .setValue('.note-editable', 'super simple WYSIWYG editor')
      .keys([client.Keys.SHIFT].concat(Array(14).fill(client.Keys.LEFT_ARROW))) // select text
      .click('.note-btn-group.note-style .dropdown-toggle')
      .waitForElementVisible('.dropdown-style', 500)
      .click('.dropdown-style a[data-value=h1]')
      .execute(function() {
        return $('.note-editable').html();
      }, function(result) {
        client.verify.equal(result.value, '<h1>super simple WYSIWYG editor<br></h1>');
      })
      .end();
  },

  'Toolbar[Font] - bold button' : function (client) {
    client
      .click('.note-editable')
      .setValue('.note-editable', 'super simple WYSIWYG editor')
      .keys([client.Keys.SHIFT].concat(Array(14).fill(client.Keys.LEFT_ARROW))) // select text
      .click('.note-btn-bold')
      .execute(function() {
        return $('.note-editable').html();
      }, function(result) {
        client.verify.equal(result.value, '<p>super simple <b>WYSIWYG editor</b><br></p>');
      })
      .end();
  },

  'Toolbar[Font] - underline button' : function (client) {
    client
      .click('.note-editable')
      .setValue('.note-editable', 'super simple WYSIWYG editor')
      .keys([client.Keys.SHIFT].concat(Array(14).fill(client.Keys.LEFT_ARROW))) // select text
      .click('.note-btn-underline')
      .execute(function() {
        return $('.note-editable').html();
      }, function(result) {
        client.verify.equal(result.value, '<p>super simple <u>WYSIWYG editor</u><br></p>');
      })
      .end();
  },

  'Toolbar[Font] - remove font style button' : function (client) {
    client
      .click('.note-editable')
      .setValue('.note-editable', 'super simple WYSIWYG editor')
      .keys([client.Keys.SHIFT].concat(Array(14).fill(client.Keys.LEFT_ARROW))) // select text
      .click('.note-btn-bold')
      .execute(function() {
        return $('.note-editable').html();
      }, function(result) {
        client.verify.equal(result.value, '<p>super simple <b>WYSIWYG editor</b><br></p>');
      })
      .click('.note-btn-group.note-font > .note-btn:nth-child(3)')
      .execute(function() {
        return $('.note-editable').html();
      }, function(result) {
        client.verify.equal(result.value, '<p>super simple WYSIWYG editor<br></p>');
      })
      .end();
  },

  'Toolbar[Fontname] - font family button' : function (client) {
    client
      .verify.containsText('.note-current-fontname', 'Helvetica Neue')
      .click('.note-editable')
      .setValue('.note-editable', 'super simple WYSIWYG editor')
      .keys([client.Keys.SHIFT].concat(Array(14).fill(client.Keys.LEFT_ARROW))) // select text
      .click('.note-btn-group.note-fontname .dropdown-toggle')
      .waitForElementVisible('.dropdown-fontname', 500)
      .click('.dropdown-fontname a[data-value=Verdana]')
      .execute(function() {
        return $('.note-editable').html();
      }, function(result) {
        client.verify.equal(result.value, '<p>super simple <font face="Verdana">WYSIWYG editor</font><br></p>');
      })
      .verify.containsText('.note-current-fontname', 'Verdana')
      .keys(client.Keys.SHIFT) // release shift key
      .keys(Array(2).fill(client.Keys.LEFT_ARROW))
      .verify.containsText('.note-current-fontname', 'Helvetica Neue')
      .end();
  },

  'Toolbar[Color] - color button' : function (client) {
    client.expect.element('.note-recent-color').to.have.css('background-color').which.equals('rgba(255, 255, 0, 1)'); // yellow
    client
      .click('.note-editable')
      .setValue('.note-editable', 'super simple WYSIWYG editor')
      .keys([client.Keys.SHIFT].concat(Array(14).fill(client.Keys.LEFT_ARROW))) // select text
      .click('.note-current-color-button')
      .keys(client.Keys.SHIFT) // release shift key
      .keys(Array(2).fill(client.Keys.LEFT_ARROW))
      .keys([client.Keys.SHIFT].concat(Array(6).fill(client.Keys.LEFT_ARROW))) // select text
      .click('.note-btn-group.note-color .dropdown-toggle')
      .waitForElementVisible('.note-color-palette', 500)
      .click('.note-color-btn[data-event=foreColor][data-value="#FF00FF"]')
      .execute(function() {
        return $('.note-editable').html();
      }, function(result) {
        client.verify.equal(result.value, '<p>super <font color="#FF00FF">simple</font> <span style="background-color: yellow;">WYSIWYG editor</span><br></p>');
      });
    client.expect.element('.note-recent-color').to.have.css('background-color').which.equals('rgba(255, 255, 0, 1)');
    client.expect.element('.note-recent-color').to.have.css('color').which.equals('rgba(255, 0, 255, 1)');
    client.end();
  },

  'Toolbar[Paragraph] - ordered list button' : function (client) {
    client
      .click('.note-editable')
      .setValue('.note-editable', ['super simple WYSIWYG editor', client.Keys.ENTER])
      .setValue('.note-editable', 'super simple WYSIWYG editor')
      .click('.note-btn-group.note-para > .note-btn:nth-child(1)')
      .execute(function() {
        return $('.note-editable').html();
      }, function(result) {
        client.verify.equal(result.value, '<p>super simple WYSIWYG editor</p><ol><li>super simple WYSIWYG editor<br></li></ol>');
      })
      .end();
  },

  'Toolbar[Paragraph] - unordered list button' : function (client) {
    client
      .click('.note-editable')
      .setValue('.note-editable', ['super simple WYSIWYG editor', client.Keys.ENTER])
      .setValue('.note-editable', 'super simple WYSIWYG editor')
      .click('.note-btn-group.note-para > .note-btn:nth-child(2)')
      .execute(function() {
        return $('.note-editable').html();
      }, function(result) {
        client.verify.equal(result.value, '<p>super simple WYSIWYG editor</p><ul><li>super simple WYSIWYG editor<br></li></ul>');
      })
      .end();
  },

  'Toolbar[Paragraph] - align left button' : function (client) {
    client
      .click('.note-editable')
      .setValue('.note-editable', 'super simple WYSIWYG editor')
      .click('.note-btn-group.note-para .dropdown-toggle')
      .waitForElementVisible('.note-para .dropdown-menu', 500)
      .click('.note-align > .note-btn:nth-child(1)')
      .execute(function() {
        return $('.note-editable').html();
      }, function(result) {
        client.verify.equal(result.value, '<p>super simple WYSIWYG editor<br></p>');
      })
      .end();
  },

  'Toolbar[Paragraph] - align center button' : function (client) {
    client
      .click('.note-editable')
      .setValue('.note-editable', 'super simple WYSIWYG editor')
      .click('.note-btn-group.note-para .dropdown-toggle')
      .waitForElementVisible('.note-para .dropdown-menu', 500)
      .moveToElement('.note-align > .note-btn:nth-child(2)', 0, 0) // to close tooltip of paragraph
      .pause(100)
      .click('.note-align > .note-btn:nth-child(2)')
      .execute(function() {
        return $('.note-editable').html();
      }, function(result) {
        client.verify.equal(result.value, '<p align="center">super simple WYSIWYG editor<br></p>');
      })
      .end();
  },

  'Toolbar[Paragraph] - align right button' : function (client) {
    client
      .click('.note-editable')
      .setValue('.note-editable', 'super simple WYSIWYG editor')
      .click('.note-btn-group.note-para .dropdown-toggle')
      .waitForElementVisible('.note-para .dropdown-menu', 500)
      .click('.note-align > .note-btn:nth-child(3)')
      .execute(function() {
        return $('.note-editable').html();
      }, function(result) {
        client.verify.equal(result.value, '<p align="right">super simple WYSIWYG editor<br></p>');
      })
      .end();
  },

  'Toolbar[Paragraph] - justify full button' : function (client) {
    client
      .click('.note-editable')
      .setValue('.note-editable', 'super simple WYSIWYG editor')
      .click('.note-btn-group.note-para .dropdown-toggle')
      .waitForElementVisible('.note-para .dropdown-menu', 500)
      .click('.note-align > .note-btn:nth-child(4)')
      .execute(function() {
        return $('.note-editable').html();
      }, function(result) {
        client.verify.equal(result.value, '<p align="justify">super simple WYSIWYG editor<br></p>');
      })
      .end();
  },

  'Toolbar[Paragraph] - outdent button' : function (client) {
    client
      .click('.note-editable')
      .setValue('.note-editable', 'super simple WYSIWYG editor')
      .click('.note-btn-group.note-para .dropdown-toggle')
      .waitForElementVisible('.note-para .dropdown-menu', 500)
      .click('.note-list > .note-btn:nth-child(2)')
      .click('.note-btn-group.note-para .dropdown-toggle')
      .waitForElementVisible('.note-para .dropdown-menu', 500)
      .click('.note-list > .note-btn:nth-child(2)')
      .click('.note-btn-group.note-para .dropdown-toggle')
      .waitForElementVisible('.note-para .dropdown-menu', 500)
      .click('.note-list > .note-btn:nth-child(1)')
      .execute(function() {
        return $('.note-editable').html();
      }, function(result) {
        client.verify.equal(result.value, '<p style="margin-left: 25px;">super simple WYSIWYG editor<br></p>');
      })
      .end();
  },

  'Toolbar[Paragraph] - indent button' : function (client) {
    client
      .click('.note-editable')
      .setValue('.note-editable', 'super simple WYSIWYG editor')
      .click('.note-btn-group.note-para .dropdown-toggle')
      .waitForElementVisible('.note-para .dropdown-menu', 500)
      .click('.note-list > .note-btn:nth-child(2)')
      .click('.note-btn-group.note-para .dropdown-toggle')
      .waitForElementVisible('.note-para .dropdown-menu', 500)
      .click('.note-list > .note-btn:nth-child(2)')
      .execute(function() {
        return $('.note-editable').html();
      }, function(result) {
        client.verify.equal(result.value, '<p style="margin-left: 50px;">super simple WYSIWYG editor<br></p>');
      })
      .end();
  },

  'Toolbar[Table] - table button' : function (client) {
    client
      .click('.note-btn-group.note-table .dropdown-toggle')
      .waitForElementVisible('.dropdown-menu.note-table', 500)
      .moveToElement('.note-dimension-picker-mousecatcher', 30, 30)
      .verify.containsText('.note-dimension-display', '2 x 2')
      .mouseButtonClick('left')
      .execute(function() {
        return $('.note-editable').html();
      }, function(result) {
        client.verify.equal(result.value, '<p><br></p><table class="table table-bordered"><tbody><tr><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td></tr></tbody></table><p><br></p>');
      })
      .end();
  },

  'Toolbar[Insert] - link button': function (client) {
    client
      .click('.note-btn-group.note-insert > .note-btn:nth-child(1)')
      .waitForElementVisible('.link-dialog', 500);
    client.expect.element('.link-dialog .modal-title').text.to.equal('Insert Link');
    client
      .verify.attributeEquals('.link-dialog .note-link-btn', 'disabled', 'true')
      .click('.link-dialog .note-link-url')
      .setValue('.link-dialog .note-link-url', 'summernote.org')
      .click('.link-dialog .note-link-btn')
      .verify.hidden('.link-dialog')
      .execute(function() {
        return $('.note-editable').html();
      }, function(result) {
        client.verify.equal(result.value, '<p><a href="http://summernote.org">http://summernote.org</a><br></p>');
      })
      .end();
  },

  'Toolbar[Insert] - link button with new window option': function (client) {
    client
      .click('.note-btn-group.note-insert > .note-btn:nth-child(1)')
      .waitForElementVisible('.link-dialog', 500);
    client.expect.element('.link-dialog .modal-title').text.to.equal('Insert Link');
    client
      .verify.attributeEquals('.link-dialog .note-link-btn', 'disabled', 'true')
      .click('.link-dialog .note-link-url')
      .setValue('.link-dialog .note-link-url', 'summernote.org')
      .click('.link-dialog input[type=checkbox]')
      .click('.link-dialog .note-link-btn')
      .verify.hidden('.link-dialog')
      .execute(function() {
        return $('.note-editable').html();
      }, function(result) {
        client.verify.equal(result.value, '<p><a target="_blank" href="http://summernote.org">http://summernote.org</a><br></p>');
      })
      .end();
  },

  'Toolbar[Insert] - image button for image url': function (client) {
    client
      .click('.note-btn-group.note-insert > .note-btn:nth-child(2)')
      .waitForElementVisible('.modal.in', 500);
    client.expect.element('.modal.in .modal-title').text.to.equal('Insert Image');
    client
      .verify.attributeEquals('.modal.in .note-image-btn', 'disabled', 'true')
      .setValue('.modal.in .note-image-url', 'https://avatars0.githubusercontent.com/u/7778517?v=3&s=200')
      .click('.modal.in .note-image-btn')
      .verify.elementNotPresent('.modal.in')
      .execute(function() {
        return $('.note-editable').html();
      }, function(result) {
        client.verify.equal(result.value, '<p><img src="https://avatars0.githubusercontent.com/u/7778517?v=3&amp;s=200" style="width: 200px;"><br></p>');
      })
      .end();
  },

  'Toolbar[Insert] - image button for upload file': function (client) {
    client
      .click('.note-btn-group.note-insert > .note-btn:nth-child(2)')
      .waitForElementVisible('.modal.in', 500);
    client.expect.element('.modal.in .modal-title').text.to.equal('Insert Image');
    client
      .verify.attributeEquals('.modal.in .note-image-btn', 'disabled', 'true')
      .setValue('.modal.in .note-image-input', __dirname +'/html/logo.png')
      .verify.elementNotPresent('.modal.in')
      .execute(function() {
        return $('.note-editable').html();
      }, function(result) {
        client.verify.equal(result.value, '<p><img data-filename="logo.png" src="data:image/png;base64,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" style="width: 399px;"><br></p>');
      })
      .end();
  },

  'Toolbar[Insert] - video button': function (client) {
    client
      .click('.note-btn-group.note-insert > .note-btn:nth-child(3)')
      .waitForElementVisible('.modal.in', 500);
    client.expect.element('.modal.in .modal-title').text.to.equal('Insert Video');
    client
      .verify.attributeEquals('.modal.in .note-video-btn', 'disabled', 'true')
      .setValue('.modal.in .note-video-url', 'https://www.youtube.com/watch?v=16oLi1kvLHs')
      .click('.modal.in .note-video-btn')
      .verify.elementNotPresent('.modal.in')
      .execute(function() {
        return $('.note-editable').html();
      }, function(result) {
        client.verify.ok(/^<p><iframe.*><\/iframe><br><\/p>/.test(result.value), '<iframe> should be exist');
        client.verify.ok(/<iframe.*(class="note-video-clip").*><\/iframe>/.test(result.value), '<iframe> should have note-cideo-clip class');
        client.verify.ok(/<iframe\s(\s?[\w-]+=\"[\w-]*")+\s?(src="\/\/www.youtube.com\/embed\/16oLi1kvLHs")(\s?[\w-]+=\"[\w-]*")+><\/iframe>/.test(result.value), '<iframe> should have the youtube link as src');
      })
      .end();
  },

  'Toolbar[View] - fullscreen button' : function (client) {
    client
      .click('.note-btn-group.note-view > .btn-fullscreen')
      .verify.cssClassPresent('.note-editor', 'fullscreen')
      .click('.note-btn-group.note-view > .btn-fullscreen')
      .verify.cssClassNotPresent('.note-editor', 'fullscreen')
      .end();
  },

  'Toolbar[View] -  button' : function (client) {
    client.expect.element('.note-codable').to.be.not.visible;
    client
      .click('.note-editable')
      .setValue('.note-editable', 'super simple WYSIWYG editor')
      .click('.note-btn-group.note-view > .btn-codeview')
      .verify.visible('.note-codable')
      .verify.value('.note-codable', '<p>super simple WYSIWYG editor<br></p>');

    client.expect.element('.note-editable').to.be.not.visible;

    client.elements('css selector','.note-toolbar .note-btn:not(.btn-codeview)', function (result) {
      result.value.map(function (v, k) {
        client.elementIdAttribute(v.ELEMENT, 'disabled', function (res) {
          client.verify.ok(res.value, 'toolbar button is disabled');
        });
      });
    }).end();
  },

  'Toolbar[View] - help button' : function (client) {
    client
      .click('.note-btn-group.note-view > .note-btn:nth-child(3)')
      .waitForElementVisible('.modal.in .modal-dialog', 500);
    client.expect.element('.modal.in .modal-header h4').text.to.equal('Help');
    client.end();
  }
};
