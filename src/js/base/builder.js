define(function () {
  var Builder = function (markup, children, options) {
    this.build = function ($parent) {
      var $node = $(markup);
      if (options && options.contents) {
        $node.html(options.contents);
      }

      if (options && options.click) {
        $node.click(options.click);
      }

      if (options && options.tooltip) {
        $node.attr({
          title: options.tooltip
        }).tooltip({
          container: 'body',
          trigger: 'hover',
          placement: 'bottom'
        });
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
    create: function (markup) {
      return function () {
        var children = $.isArray(arguments[0]) ? arguments[0] : [];
        var options = typeof arguments[1] === 'object' ? arguments[1] : arguments[0];
        return new Builder(markup, children, options);
      };
    }
  };

  return builder;
});
