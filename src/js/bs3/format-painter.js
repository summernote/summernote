(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('jquery'));
  } else {
    factory(window.jQuery);
  }
}(function($) {
  $.extend($.summernote.plugins, {
    'formatpainter': function(context) {
      var self = this;
      var ui = $.summernote.ui;

      var addListener = function() {
        document.addEventListener('mouseup', function() {
          if (self.formatPainterFlag && document.getSelection().toString() != "") {
            document.execCommand("RemoveFormat", false, null);
            var formatHtml = document.getSelection().toString();
            formatHtml = `<font style="color: ${self.fColor};">${formatHtml}</font>`;
            formatHtml = `<span style="font-size: ${self.fSize}; background-color: ${self.fBgColor}; font-family: ${self.fFamily.replace("\"","").replace("\"","")};">${formatHtml}</span>`;
            if (self.parentTagList.indexOf('B') > -1 || self.fWeight >= 550 || self.fWeight == "bold" || self.fWeight == "bolder") {
              formatHtml = '<b>' + formatHtml + '</b>';
            }
            if (self.parentTagList.indexOf('I') > -1 || self.fItalic == "italic") {
              formatHtml = '<i>' + formatHtml + '</i>';
            }
            if (self.parentTagList.indexOf('U') > -1 || self.fTxtDecorationLine.indexOf('underline') > -1) {
              formatHtml = '<u>' + formatHtml + '</u>';
            }
            if (self.parentTagList.indexOf('STRIKE') > -1 || self.fTxtDecorationLine.indexOf('line-through') > -1) {
              formatHtml = '<strike>' + formatHtml + '</strike>';
            }
            document.execCommand('insertHTML', false, formatHtml);
            self.formatPainterFlag = false;
            self.fFamily = "";
            self.fSize = "";
            self.fColor = "";
            self.fBgColor = "";
            self.parentTagList = [];
          }
        }, true);

        document.onclick = function(e) {
          //若点击元素为目标元素则返回
          if (e.target.className === "format-painter") return;
          if (e.target.childElementCount > 0) {
            if(e.target.childNodes[0].className==="format-painter") return;
          }
          //否则执行回调函数
          self.formatPainterFlag = false;
        };
      };

      var clearSlct = "getSelection" in window ? function(){
        window.getSelection().removeAllRanges();
      } : function(){
        document.selection.empty();
      };

      function getParentTag(startTag, parentTagList = []) {
        // 父级标签是否是body,是着停止返回集合,反之继续
        if ('BODY' !== startTag.parentElement.nodeName) {
          // 放入集合
          parentTagList.push(startTag.parentElement.tagName);
          // 再上一层寻找
          return getParentTag(startTag.parentElement, parentTagList);
        }
        // 返回集合,结束
        else return parentTagList;
      }

      context.memo('button.formatpainter', function() {
        if(document.formatpainterButton === undefined)
          document.formatpainterButton = 'format-painter';
        var button = ui.button({
          contents: '<i class="' + document.formatpainterButton + '"></i>',
          click: function() {
            if (window.getSelection().toString() != "") {
              self.formatPainterFlag = true;
              self.fFamily = getComputedStyle(window.getSelection().focusNode.parentElement).fontFamily;
              self.fSize = getComputedStyle(window.getSelection().focusNode.parentElement).fontSize;
              self.fColor = getComputedStyle(window.getSelection().focusNode.parentElement).color;
              self.fBgColor = getComputedStyle(window.getSelection().focusNode.parentElement).backgroundColor;
              self.fWeight = getComputedStyle(window.getSelection().focusNode.parentElement).fontWeight;
              self.fItalic = getComputedStyle(window.getSelection().focusNode.parentElement).fontStyle;
              self.fTxtDecorationLine = getComputedStyle(window.getSelection().focusNode.parentElement).textDecorationLine;
              self.fTxtDecorationColor = getComputedStyle(window.getSelection().focusNode.parentElement).textDecorationColor;
              let startTag = window.getSelection().focusNode;
              self.parentTagList = getParentTag(startTag);
              var ele = window.getSelection().focusNode.parentElement;
              for (let index = 0; index < self.parentTagList.length; index++) {
                if (ele.style.backgroundColor != "") {
                  self.fBgColor = ele.style.backgroundColor;
                  return;
                } else {
                  ele = ele.parentElement;
                }
              }
              var ele1 = window.getSelection().focusNode.parentElement;
              for (let index = 0; index < self.parentTagList.length; index++) {
                if (ele1.color != "") {
                  self.fColor = ele1.color;
                  return;
                } else {
                  ele1 = ele1.parentElement;
                }
              }
              clearSlct();
            }
          },
        });
        self.formatpainter = button.render();
        return self.formatpainter;
      });

      // This events will be attached when editor is initialized.
      this.events = {
        'summernote.init': function() {
          addListener();
        },
      };
    },
  });
}));
