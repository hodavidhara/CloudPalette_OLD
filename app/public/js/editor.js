// author: David Hara
// front-end scripts for the CloudPalette editor;

$(function () {
  
  var createImage = function () {
    var canvasName = prompt('What would you like to name your Image?', 'Untitled');
    $('body').append(
      '<div id="canvas-' + canvasName + '" class="canvas-window">' +
        '<div class="window-menu">' +
          '<button name="close" class="close">Close!</button>' +
          '<p>'+canvasName+'</p>' +
        '</div>' +
        '<canvas width="400" height="400">Get a real browser!</canvas>' +
      '</div>'
    );
    makeDraggable(canvasName);
    makeRemovable(canvasName);
    makeActivatable(canvasName);
  };
  
  var makeActivatable = function (canvasName) {
    $('.active-canvas').removeClass('active-canvas').addClass('inactive-canvas');
    $('.canvas-window#canvas-' + canvasName).addClass('active-canvas').find('*').mousedown(function () {
      $('.active-canvas').removeClass('active-canvas').addClass('inactive-canvas');
      $('.canvas-window#canvas-' + canvasName).removeClass('active-canvas').addClass('active-canvas');
    });
  }
  
  var makeRemovable = function (canvasName) {
    $('.canvas-window#canvas-' + canvasName).find('.close').click(
    function () {
      $('.canvas-window#canvas-' + canvasName).remove();
    }
  );
  }
  
  var makeDraggable = function (canvasName) {
    $('.canvas-window#canvas-' + canvasName).draggable({ disabled: true });
    $('.canvas-window#canvas-' + canvasName).children('.window-menu').mousedown(
      function () {
        $('.canvas-window#canvas-' + canvasName).draggable('option', 'disabled', false)
        .trigger('mousedown')
        .css('cursor', 'move');
      }
    ).mouseup(
      function () {
        $('.canvas-window#canvas-' + canvasName).draggable( 'option', 'disabled', true )
        .css('cursor', 'auto');
      }
    );
  };
  
  // Binding for the menu
  // hover bind to show submenu dropdowns.
  $('.horizontal-menu-item').hover(
    function () {
      $(this).children('.horizontal-submenu').css('display', 'block');
    },
    function () {
      $(this).children('.horizontal-submenu').css('display', 'none');
    }
  );
  
  // click binding for all the submenu items.
  $('#new-image').click(createImage);
  
});