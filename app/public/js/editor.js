// author: David Hara
// front-end scripts for the CloudPalette editor;

$(function () {
  // Binding for the menu
  // hover bind to show submenu dropdowns.
  $(".horizontal-menu-item").hover(
    function () {
      $(this).children(".horizontal-submenu").css('display', 'block');
    },
    function () {
      $(this).children(".horizontal-submenu").css('display', 'none');
    }
  );
  // click binding for all the submenu items.
  $('#new-image').click(createNewImage);
  
  var createNewImage = function () {
    var canvasName = prompt('What would you like to name your Image?', 'Untitled');
    $('body').append(
    '<div id="canvas-' + canvasName + '" class="canvas-window">' +
      '<div class="window-menu">' +
        '<button name="close" class="close">Close!</button>' +
        '<p>'+canvasName+'</p>' +
      '</div>' +
      '<canvas width="400" height="400">Get a real browser!</canvas>' +
    '</div>'
    )
    makeDraggable(canvasName);
  }
  
  var makeDraggable = function (canvasName) {
    $(".canvas-window#canvas-" + canvasName).draggable({ disabled: true });
    $(".canvas-window#canvas-" + canvasName).children(".window-menu").mousedown(
      function () {
        $(".canvas-window#canvas-" + canvasName).draggable("option", "disabled", false)
        .trigger('mousedown')
        .css('cursor', 'move');
      }
    ).mouseup(
      function () {
        $(".canvas-window#canvas-" + canvasName).draggable( "option", "disabled", true )
        .css('cursor', 'auto');
      }
    );
  };
  
});