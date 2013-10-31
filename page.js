$(document).ready(function() {
  // scrollspy  
  var $body = $(document.body), $navbar = $('.bs-page-navbar');
  $(window).load(function() {
    $body.scrollspy({
      target: '.bs-page-sidebar',
      offset: $navbar.height()
    });
  });

  // sidebar affix
  var $sidebar = $('.bs-page-sidebar');
  $sidebar.affix({
    offset: {
      top: function() {
        var offsetTop = $sidebar.offset().top;
        var nPadding = 20;
        return (this.top = offsetTop - nPadding - $navbar.height());
      }, bottom: function() {
        return (this.bottom = $('.bs-page-footer').outerHeight(true));
      }
    } 
  });
});
