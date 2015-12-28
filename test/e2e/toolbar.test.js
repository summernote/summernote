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
