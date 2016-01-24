var expect = require('chai').expect;

module.exports = {
  beforeEach: function (client) {
    client
      /* jshint -W106 */
      .url(client.launch_url + '/options-callbacks.html')
      /* jshint +W106 */
      .waitForElementPresent('#summernote', 1000);
  },

  'Options.callbacks - onInit': function (client) {
    client
      .execute(function() {
        return $('#summernote').summernote({
          callbacks: {
            onInit: function() {
              document.getElementById('result').innerHTML = 'onInit';
            }
          }
        });
      }, function(result) {
        client.verify.equal(result.state, 'success');
        client.expect.element('#result').text.to.equal('onInit');
      })
      .end();
  },

  'Options.callbacks - onEnter': function (client) {
    client
      .execute(function() {
        return $('#summernote').summernote({
          callbacks: {
            onEnter: function() {
              document.getElementById('result').innerHTML = 'onEnter';
            }
          }
        });
      }, function(result) {
        client.verify.equal(result.state, 'success');
        client.click('.note-editable')
              .keys(client.Keys.ENTER);
        client.expect.element('#result').text.to.equal('onEnter');
      })
      .end();
  },

  'Options.callbacks - onFocus': function (client) {
    client
      .execute(function() {
        return $('#summernote').summernote({
          callbacks: {
            onFocus: function() {
              document.getElementById('result').innerHTML = 'onFocus';
            }
          }
        });
      }, function(result) {
        client.verify.equal(result.state, 'success');
        client.click('.note-editable');
        client.expect.element('#result').text.to.equal('onFocus');
      })
      .end();
  },

  'Options.callbacks - onBlur': function (client) {
    client
      .execute(function() {
        return $('#summernote').summernote({
          callbacks: {
            onBlur: function() {
              document.getElementById('result').innerHTML = 'onBlur';
            }
          }
        });
      }, function(result) {
        client.verify.equal(result.state, 'success');
        client.click('.note-editable')
              .click('#result');
        client.expect.element('#result').text.to.equal('onBlur');
      })
      .end();
  },

  'Options.callbacks - onKeyup': function (client) {
    client
      .execute(function() {
        return $('#summernote').summernote({
          callbacks: {
            onKeyup: function(e) {
              document.getElementById('result').innerHTML = 'onKeyup:'+ e.keyCode;
            }
          }
        });
      }, function(result) {
        client.verify.equal(result.state, 'success');
        client.click('.note-editable')
              .keys(client.Keys.SHIFT); // key down
        client.expect.element('#result').text.to.equal('wait callback');
        client.keys(client.Keys.SHIFT); // key up
        client.expect.element('#result').text.to.equal('onKeyup:16');
      })
      .end();
  },

  'Options.callbacks - onKeydown': function (client) {
    client
      .execute(function() {
        return $('#summernote').summernote({
          callbacks: {
            onKeydown: function(e) {
              document.getElementById('result').innerHTML = 'onKeydown:'+ e.keyCode;
            }
          }
        });
      }, function(result) {
        client.verify.equal(result.state, 'success');
        client.click('.note-editable')
              .keys(client.Keys.CONTROL);
        client.expect.element('#result').text.to.equal('onKeydown:17');
      })
      .end();
  },

  'Options.callbacks - onPaste': function (client) {
    client
      .execute(function() {
        return $('#summernote').summernote({
          callbacks: {
            onPaste: function(e) {
              document.getElementById('result').innerHTML = 'onPaste:'+ e.originalEvent.clipboardData.getData('text');
            }
          }
        });
      }, function(result) {
        client.verify.equal(result.state, 'success');
        client
          .click('.note-editable')
          .setValue('.note-editable', 'super simple WYSIWYG editor')
          .keys([client.Keys.SHIFT].concat(Array(14).fill(client.Keys.LEFT_ARROW))) // select text
          .keys(client.Keys.SHIFT) // relese shift key
          .keys([client.Keys.COMMAND, 'c']) // copy text
          .keys(client.Keys.COMMAND)
          .keys(client.Keys.RIGHT_ARROW) // release selected text
          .keys([client.Keys.COMMAND, 'v']); // paste text
        client.expect.element('#result').text.to.equal('onPaste:WYSIWYG editor');
      })
      .end();
  },

  'Options.callbacks - onImageUpload': function (client) {
    client
      .execute(function() {
        return $('#summernote').summernote({
          callbacks: {
            onImageUpload: function(files) {
              document.getElementById('result').innerHTML = 'onImageUpload:'+files[0].name;
            }
          }
        });
      }, function(result) {
        client.verify.equal(result.state, 'success');
        client
          .click('.note-btn-group.note-insert > .note-btn:nth-child(2)')
          .waitForElementVisible('.modal.in', 500)
          .setValue('.modal.in .note-image-input', __dirname +'/html/logo.png')
        client.expect.element('#result').text.to.equal('onImageUpload:logo.png');
      })
      .end();
  },

  'Options.callbacks - onChange': function (client) {
    client
      .execute(function() {
        return $('#summernote').summernote({
          callbacks: {
            onChange: function(content) {
              document.getElementById('result').innerHTML = 'onChange:'+content;
            }
          }
        });
      }, function(result) {
        client.verify.equal(result.state, 'success');
        client
          .click('.note-editable')
          .setValue('.note-editable', 'super simple WYSIWYG editor')
          .execute(function() {
            return $('#result').html();
          }, function(result) {
            client.verify.equal(result.value, 'onChange:<p>super simple WYSIWYG editor<br></p>');
          });
      })
      .end();
  }
};
