// author: David Hara
// front-end scripts for the CloudPalette editor;

$(function () {
  
  var createImage = function () {
    var canvasName = prompt('What would you like to name your Image?', 'Untitled-' + (CloudPalette.getImageCount()+1));
    $('body').append(
      '<div id="window-' + canvasName + '" class="canvas-window">' +
        '<div class="window-menu">' +
          '<button name="close" class="close">Close!</button>' +
          '<p>'+canvasName+'</p>' +
        '</div>' +
        '<canvas id="canvas-' + canvasName + '" width="400" height="400">Get a real browser!</canvas>' +
      '</div>'
    );
    makeDraggable(canvasName);
    makeRemovable(canvasName);
    makeActivatable(canvasName);
    CloudPalette.newImage(canvasName, getContext(canvasName), 400, 400);
  };
  
  var makeActivatable = function (canvasName) {
    CloudPalette.setActiveImage(canvasName);
    $('.active-window').removeClass('active-window').addClass('inactive-window');
    $('.canvas-window#window-' + canvasName).addClass('active-window').find('*').mousedown(function () {
      $('.active-window').removeClass('active-window').addClass('inactive-window');
      $('.canvas-window#window-' + canvasName).removeClass('inactive-window').addClass('active-window');
      CloudPalette.setActiveImage(canvasName);
    });
  }
  
  var makeRemovable = function (canvasName) {
    $('.canvas-window#window-' + canvasName).find('.close').click(
    function () {
      $('.canvas-window#window-' + canvasName).remove();
    }
  );
  }
  
  var makeDraggable = function (canvasName) {
    $('.canvas-window#window-' + canvasName).draggable({ disabled: true });
    $('.canvas-window#window-' + canvasName).children('.window-menu').mousedown(
      function () {
        $('.canvas-window#window-' + canvasName).draggable('option', 'disabled', false)
        .trigger('mousedown')
        .css('cursor', 'move');
      }
    ).mouseup(
      function () {
        $('.canvas-window#window-' + canvasName).draggable( 'option', 'disabled', true )
        .css('cursor', 'auto');
      }
    );
  };
  
  var getContext = function (canvasName) {
    return $('.canvas-window#window-' + canvasName).find('#canvas-' + canvasName).get(0).getContext('2d');
  }
  
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