// author: David Hara
// front-end scripts for the CloudPalette editor;

$(function () {
  // simple event binding
  $(".horizontal-menu-item").hover(
    function () {
      $(this).children(".horizontal-submenu").css('display', 'block');
    },
    function () {
      $(this).children(".horizontal-submenu").css('display', 'none');
    }
  )
});