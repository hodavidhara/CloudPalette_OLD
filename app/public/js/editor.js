// author: David Hara
// front-end scripts for the CloudPalette editor;

$(function () {
  var currentTool = null,
      activeImage = null;
  // Function that adds in the new window that contains the canvas, and creates the image object
  // Also calls all of the functions that does most a lot of the bindings.
  var createImage = function () {
    var canvasName = prompt('What would you like to name your Image?', 'Untitled-' + (CloudPalette.getImageCount()+1));
    $('body').append(
      '<div id="window-' + canvasName + '" class="canvas-window">' +
        '<div class="window-menu">' +
          '<button name="close" class="close">Close!</button>' +
          '<p>'+canvasName+'</p>' +
        '</div>' +
        '<canvas id="layer-0" class="layer canvas-' + canvasName + '" width="400" height="400">Get a real browser!</canvas>' +
      '</div>'
    );
    var top = 150 + (40 * (CloudPalette.getImageCount() % 10)),
        left = 400 + (40 * (CloudPalette.getImageCount() % 10));
    $('.canvas-window#window-' + canvasName).css({top: (top.toString() + 'px'), left: (left.toString() + 'px')});
    CloudPalette.newImage(canvasName, getContext(canvasName, 'layer-0'), 400, 400);
    makeDraggable(canvasName);
    makeRemovable(canvasName);
    makeActivatable(canvasName);
    activeImage = CloudPalette.getImage(canvasName);
    loadLayerMenu();
  };
  
  var newLayer = function () {
    var activeImage = CloudPalette.getActiveImage(), 
        imageName = activeImage.getName(),
        layerName = prompt('What would you like to name your new layer?', 'layer-' + (activeImage.getLayers().length));
    $('#window-' + imageName).append(
      '<canvas id="layer-' + (activeImage.getLayers().length) +'" class="layer canvas-' + imageName + 
        '" width="400" height="400">Get a real browser!</canvas>'
    );
    activeImage.newLayer(layerName, getContext(imageName, layerName));
    activeImage.setActiveLayer(activeImage.getLayers().length - 1);
    loadLayerMenu();
  }
  
  // function to make a new window "activatable." Basically makes it pop to the front when clicked on
  var makeActivatable = function (canvasName) {
    CloudPalette.setActiveImage(canvasName);
    $('.active-window').removeClass('active-window').addClass('inactive-window');
    $('.canvas-window#window-' + canvasName).addClass('active-window')
    $('.canvas-window#window-' + canvasName).find('*').mousedown(function () {
      $('.active-window').removeClass('active-window').addClass('inactive-window');
      $('.canvas-window#window-' + canvasName).removeClass('inactive-window').addClass('active-window');
      CloudPalette.setActiveImage(canvasName);
      unbindCanvas($('canvas'));
      bindTool($('.active-window').find('canvas'), currentTool);
      activeImage = CloudPalette.getImage(canvasName);
      loadLayerMenu();
    });
  };
  
  // function to make a new window's close remove the window from the editor
  var makeRemovable = function (canvasName) {
    $('.canvas-window#window-' + canvasName).find('.close').click(
      function () {
        var close = confirm('are you sure you would like to close (Warning: Your image won\'t be saved!)');
        if (close) {
          $('.canvas-window#window-' + canvasName).remove();
        }
      }
    );
  }
  
  // function to make each window draggable.
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
  
  // function to make ui windows draggable
  var makeToolsDraggable = function (dragWindow, clickzone) {
    $(dragWindow).draggable({ disabled: true });
    $(dragWindow).children(clickzone).mousedown(
        function () {
          $(dragWindow).draggable('option', 'disabled', false)
          .trigger('mousedown')
          .css('cursor', 'move');
        }
      ).mouseup(
        function () {
          $(dragWindow).draggable( 'option', 'disabled', true )
          .css('cursor', 'auto');
        }
      );
  };
  
  var loadLayerMenu = function () {
    $('.layer-box').remove();
    var layers = CloudPalette.getActiveImage().getLayers();
    for (var i = layers.length - 1; i >= 0; i--) {
      $('#layer-container').append(
        '<div class="layer-box" id="layer' + i + '\">' +
          '<div class="layer-picture"></div>' +
          '<div class="layer-name">' +
            '<p>' + layers[i].getName() + '</p>' +
          '</div>' +
        '<div class="clear"></div>'
      )
      $('#layer' + activeImage.getActiveLayer()).addClass('active-layer');
      makeLayerActivatable(i);
    }
  };
  
  
  // TODO: See if this works, and if it is even necessary
  var arrangeLayers = function () {
    var activeImage = CloudPalette.getActiveImage();
        imageName = activeImage.getName();
    $('#window-' + imageName).find('.layer').each(function(i) {
      this.css('z-index', 4 + i);
    });
  };
  
  var makeLayerActivatable = function (layerNo) {
    $('#layer' + layerNo).bind('click.activateLayer', function () {
      activeImage.setActiveLayer(layerNo);
      $('.active-layer').removeClass('active-layer');
      $('#layer' + layerNo).addClass('active-layer');
    });
  }
  
  // gets the context from the canvas element, given the name of the image.
  // This should only be used once to get the context from the canvas, then stored in the
  // Image object. From then on we should be using the Images getContext function.
  var getContext = function (canvasName, layerName) {
    return $('.canvas-window#window-' + canvasName).find('#' + layerName).get(0).getContext('2d');
  }
  
  /*********** Tool related functions *************/
  
  
  var bindTool = function (canvas, toolFunction) {
    if(toolFunction){
     toolFunction(canvas);
     saveLayer(canvas); 
    } else {
      throw new Error("That tool is not yet implemented!");
    }
    
  };
  
  var saveLayer = function (canvas) {
    canvas.bind('mouseup.saveLayer', function () {
      var activeImage =  CloudPalette.getActiveImage(),
      ctx = activeImage.getContext();
      activeImage.getLayer(activeImage.getActiveLayer()).setData(ctx.getImageData(0,0, activeImage.getWidth(), activeImage.getHeight()));
    });
  };
  
  var unbindCanvas = function (canvas) {
    canvas.unbind('.tool');
  };
  
  // This is the pencil tool
  var pencilTool = function (canvas) {
    var ctx = CloudPalette.getActiveImage().getContext();
    canvas.bind('mousedown.tool', function (event) {
      var oldX = event.offsetX,
          oldY = event.offsetY;
      canvas.mousemove(function (event) {
          //canvasUtil.fillCircle(ctx, event.offsetX, event.offsetY, 5);
        if(oldX !== null && oldY !== null) {
          ctx.beginPath();
          ctx.moveTo(oldX, oldY);
          ctx.lineTo(event.offsetX, event.offsetY);
          ctx.stroke();
        }
        oldX = event.offsetX;
        oldY = event.offsetY;
      })
      .mouseleave(function (event) {
        oldX = oldY = null;
      });
    });
    $(window).mouseup(function (event) {
      canvas.unbind('mousemove');
    });
      
  };
  
  /***************** Simple Bindings **********/
  
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
  
  $('#paintbrush').click(function () {
    bindTool($('.active-window').find('canvas'), pencilTool)
    currentTool = pencilTool;
  });
  
  // click binding for all the submenu items.
  $('#new-image').click(createImage);
  
  $('#new-layer').click(newLayer);
  
  makeToolsDraggable('#layer-container', '#layer-header');
  makeToolsDraggable('#toolbar-container', '#toolbar-header');
  
});