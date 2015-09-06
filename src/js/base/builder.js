define(function () {
  var Builder = function (markup, children, options, callback) {
    this.build = function ($parent) {
      var $node = $(markup);
      if (options && options.contents) {
        $node.html(options.contents);
      }

      if (options && options.className) {
        $node.addClass(options.className);
      }

      if (options && options.data) {
        $.each(options.data, function (k, v) {
          $node.attr('data-' + k, v);
        });
      }

      if (options && options.click) {
        $node.on('mousedown', options.click);
      }

      if (callback) {
        callback($node, options);
      }

      if (children) {
        children.forEach(function (child) {
          child.build($node);
        });
      }

      if ($parent) {
        $parent.append($node);
      }

      return $node;
    };
  };

  var builder = {
    create: function (markup, callback) {
      return function () {
        var children = $.isArray(arguments[0]) ? arguments[0] : [];
        var options = typeof arguments[1] === 'object' ? arguments[1] : arguments[0];
        return new Builder(markup, children, options, callback);
      };
    }
  };

  return builder;
});
