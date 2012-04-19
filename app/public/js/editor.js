// author: David Hara
// front-end scripts for the CloudPalette editor;

$(function () {
  var currentTool = null,
      activeColor = 'rgb(0, 0, 0)',
      activeBrushSize = '1',
      activeImage = null;
      keypressStates = {ctrl: false, alt: false, shift: false};
  // Function that adds in the new window that contains the canvas, and creates the image object
  // Also calls all of the functions that does most a lot of the bindings.
  var createImage = function (canvasName, width, height) {
    if (canvasName !== null) {
      $('body').append(
        '<div id="window-' + canvasName + '" class="canvas-window">' +
          '<div class="window-menu">' +
            '<button canvasName="close" class="close">Close!</button>' +
            '<p>'+canvasName+'</p>' +
          '</div>' +
          '<div class="canvas-holder">' +
            '<canvas id="layer-0" class="layer canvas-' + canvasName + '" width="' + width + 'px" height="' + height + 'px">Get a real browser!</canvas>' +
          '</div>' +
        '</div>'
      );
      var top = 150 + (40 * (CloudPalette.getImageCount() % 10)),
          left = 400 + (40 * (CloudPalette.getImageCount() % 10));
      $('.canvas-window#window-' + canvasName).css({top: (top.toString() + 'px'), left: (left.toString() + 'px')});
      $('.canvas-window#window-' + canvasName).find('.canvas-holder').css({width: width+'px', height: height+'px'});
      CloudPalette.newImage(canvasName, getContext(canvasName, 0), width, height);
      makeDraggable(canvasName);
      makeRemovable(canvasName);
      currentTool = (currentTool === null) ? pencilTool : currentTool;
      makeActivatable(canvasName);
      activeImage = CloudPalette.getImage(canvasName);
      loadLayerMenu();
      arrangeLayers();
    }
  };
  
  var newLayer = function () {
    var activeImage = CloudPalette.getActiveImage(), 
        imageName = activeImage.getName(),
        layerName = prompt('What would you like to name your new layer?', 'layer-' + (activeImage.getLayers().length));
    $('#window-' + imageName).find('.canvas-holder').append(
      '<canvas id="layer-' + (activeImage.getLayers().length) +'" class="layer canvas-' + imageName + 
        '" width="400px" height="400px">Get a real browser!</canvas>'
    );
    activeImage.newLayer(layerName, getContext(imageName, activeImage.getLayers().length));
    activeImage.setActiveLayer(activeImage.getLayers().length - 1);
    activeImage.recordHistory();
    loadLayerMenu();
    arrangeLayers();
    bindTool($('#window-' + imageName).find('.canvas-holder'), currentTool);
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
      bindTool($('.active-window').find('.canvas-holder'), currentTool);
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
  
  var arrangeLayers = function () {
    var activeImage = CloudPalette.getActiveImage(),
        imageName = activeImage.getName();
    $('#window-' + imageName).find('.layer').each(function(i) {
      $(this).css('z-index', i.toString())
    });
  };
  
  var makeLayerActivatable = function (layerNo) {
    $('#layer' + layerNo).bind('click.activateLayer', function () {
      activeImage.setActiveLayer(layerNo);
      $('.active-layer').removeClass('active-layer');
      $('#layer' + layerNo).addClass('active-layer');
      bindTool($('.active-window').find('.canvas-holder'), currentTool);
    });
  };
  
  var flattenActiveImage = function () {
    var activeImage = CloudPalette.getActiveImage(),
        imageName = activeImage.getName(),
        activeLayer, ctx;
    
    activeImage.flattenImage();
    $('#window-' + imageName).find('.layer').each(function(i) {
      if (i !== 0) {
        $('#window-' + imageName).find('#layer-' + i).remove();
      }      
    });
    updateCanvasFromLayerData();
    loadLayerMenu();
  };
  
  var updateCanvasFromLayerData = function () {
    var activeImage = CloudPalette.getActiveImage(),
    imageName = activeImage.getName(),
    layers = activeImage.getLayers(),
    ctx;
    
    for (var i = 0; i < layers.length; i++) {
      if($('#window-' + imageName).find('#layer-'+i).size() === 0) {
        $('#window-' + imageName).find('.canvas-holder').append(
          '<canvas id="layer-' + i +'" class="layer canvas-' + imageName + 
            '" width="400px" height="400px">Get a real browser!</canvas>'
        );
        var newctx = getContext(imageName, i)
        layers[i].setContext(newctx);
        activeImage.updateHistoryCtxForLayer(i);
        activeImage.setActiveLayer(i);
        arrangeLayers();
        bindTool($('#window-' + imageName).find('.canvas-holder'), currentTool);
      }
      ctx = layers[i].getContext();
      ctx.putImageData(layers[i].getData(), 0, 0);
    }
    
    $('#window-' + imageName).find('.layer').each(function(i) {
      if (i >= layers.length) {
        $('#window-' + imageName).find('#layer-' + i).remove();
      }      
    });
    
    loadLayerMenu();
  }
  
  // gets the context from the canvas element, given the name of the image.
  // This should only be used once to get the context from the canvas, then stored in the
  // Image object. From then on we should be using the Images getContext function.
  var getContext = function (canvasName, layerNumber) {
    return $('.canvas-window#window-' + canvasName).find('#layer-' + layerNumber).get(0).getContext('2d');
  };
  
  var saveImage = function () {
    var activeImage = CloudPalette.getActiveImage(),
        imageName = activeImage.getName();
    
    flattenActiveImage();
    var canvas = $('#window-' + imageName).find('#layer-0').get(0),
        canvasData = canvas.toDataURL("image/png");
    
    window.open(canvasData);
  };
  
  var undoImage = function () {
    var activeImage = CloudPalette.getActiveImage();
    activeImage.undo();
    
    updateCanvasFromLayerData();
  }
  
  var redoImage = function () {
    var activeImage = CloudPalette.getActiveImage();
    activeImage.redo();
    
    updateCanvasFromLayerData();
  }
  
  /*********** Tool related functions *************/
  
  
  var bindTool = function (canvasHolder, toolFunction) {
    if(toolFunction){
      unbindCanvas(canvasHolder);
      bindSaveLayer(); 
      toolFunction(canvasHolder);
    } else {
      throw new Error("That tool is not yet implemented!");
    }
    
  };
  
  var bindSaveLayer = function () {
    $(window).bind('mouseup.saveLayer', function () {
      var activeImage = CloudPalette.getActiveImage(),
          activeLayer = activeImage.getLayer(activeImage.getActiveLayer()),
          ctx = activeLayer.getContext();
      if(activeImage.getEdited()){
        activeLayer.setData(ctx.getImageData(0,0, activeImage.getWidth(), activeImage.getHeight()));
        activeImage.recordHistory();
      }
      activeImage.setEdited(false);
    });
  };
  
  var unbindCanvas = function (canvasHolder) {
    canvasHolder.unbind('.tool');
    $(window).unbind('mouseup.saveLayer');
  };
  
  var bindColorPickers = function () {
    activeColor = $(this).css('background-color');
    
    $('#current-color').css('background-color', activeColor);
  }
  
  var bindBrushSizePickers = function () {
    activeBrushSize = $(this).text();
  }
  
  // This is the pencil tool
  var pencilTool = function (canvasHolder) {
    var activeImage = CloudPalette.getActiveImage(),
    activeLayer = activeImage.getLayer(activeImage.getActiveLayer()),
    ctx = activeLayer.getContext();
    ctx.strokeStyle = activeColor;
    ctx.fillStyle = activeColor;
    canvasHolder.bind('mousedown.tool', function (event) {
      var oldX = event.offsetX,
          oldY = event.offsetY;
      activeImage.setEdited(true);
      canvasUtil.fillCircle(ctx, event.offsetX, event.offsetY, activeBrushSize/2);
      canvasHolder.bind('mousemove.toolActive', function (event) {
        if (oldX && oldY) {
          fillpoints(ctx, activeBrushSize, oldX, oldY, event.offsetX, event.offsetY, 8);
        }
        oldX = event.offsetX;
        oldY = event.offsetY;
      })
      .bind('mouseleave.toolActive', function (event) {
        fillpoints(ctx, activeBrushSize, oldX, oldY, event.offsetX, event.offsetY, 8);
        oldX = oldY = null;
      })
      .bind('mouseenter.toolActive', function (event) {
        oldX = event.offsetX;
        oldY = event.offsetY;
      });
    });
    $(window).bind('mouseup.tool', function (event) {
      canvasHolder.unbind('.toolActive');
      $(window).unbind('.tool');
    });
  };
  
  // Helper function for the pencil tool;
  var fillpoints = function (ctx, brushSize, x1, y1, x2, y2, i) {
    if (i > 0) {
      midPointX = (x1 + x2)/2;
      midPointY = (y1 + y2)/2;
      canvasUtil.fillCircle(ctx, x2, y2, activeBrushSize/2);
      canvasUtil.fillCircle(ctx, midPointX, midPointY, activeBrushSize/2);
      fillpoints(ctx, brushSize, x1, y1, midPointX, midPointY, (i -1));
      fillpoints(ctx, brushSize, midPointX, midPointY, x2, y2, (i-1));
    }
  };
  
    // ********************** Popups Setup ******************** \\
  
  var openNewImageForm = function () {
    $('#new-image-form').dialog('open');
    $('#new-image-form-name').val('Untitled-' + (CloudPalette.getImageCount()+1));
    $('.ui-dialog-buttonset > button:last').focus();
  };
  
  $('#new-image-form').dialog({
      autoOpen: false,
      height: 300,
      width: 350,
      modal: true,
      resizable: false,
      draggable: false,
      buttons: {
        Cancel: function() {
          $( this ).dialog('close');
        },
        'Ok': function () {
          var name = $('#new-image-form-name').val(),
              width = $('#new-image-form-width').val(),
              height = $('#new-image-form-height').val();
          createImage(name, width, height);
          $(this).dialog('close');
        }
      }
    });
  
  //***************** Simple Bindings ********** \\
  
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
  
  $('#pencil').click(function () {
    bindTool($('.active-window').find('.canvas-holder'), pencilTool);
    currentTool = pencilTool;
  });
  
  // click binding for all the submenu items.
  $('#new-image').click(openNewImageForm);
  $('#save-image').click(saveImage);
  
  $('#undo').click(undoImage);
  $('#redo').click(redoImage);
  
  $('#new-layer').click(newLayer);
  $('#flatten-image').click(flattenActiveImage);
  
  $('#color-toolbar').click(function () {
    $('#color-container').toggle();
  })
  
  $('#size-toolbar').click(function () {
    $('#brush-size-container').toggle();
  })
  
  
  //Color selection handling
  $('.color-swab').bind('click.colorSelect', bindColorPickers);
  $('input.color').miniColors({
    change: function(hex, rgb) {
      activeColor = canvasUtil.hexToRGBString(hex);    
      $('#current-color').css('background-color', activeColor);
    }
  });
  $('.miniColors-trigger').bind('click.colorSelect', bindColorPickers);
  
  //Brush size selection handlign
  $('.brush-size').bind('click.brushSizeSelect', bindBrushSizePickers);
  
  makeToolsDraggable('#layer-container', '#layer-header');
  makeToolsDraggable('#toolbar-container', '#toolbar-header');
  makeToolsDraggable('#color-container', '#color-header');
  makeToolsDraggable('#brush-size-container', '#brush-size-header');
  
  // **************************** KEYPRESS BINDINGS ************************** \\
  
  $(window).bind('keydown', function (event) {
    switch (event.which) {
      // shift
      case 16:
        keypressStates.shift = true;
        break;
      // ctrl
      case 17:
        keypressStates.ctrl = true;
        break;
      // alt
      case 18:
        keypressStates.alt = true;
        break;
      // Z
      case 90:
        if (keypressStates.shift && keypressStates.ctrl) {
          redoImage();
        } else if (keypressStates.ctrl) {
          undoImage();
        }
        break;
      default:
    }
  })
  .bind('keyup', function (event) {
    switch (event.which) {
      // shift
      case 16:
        keypressStates.shift = false;
        break;
      // ctrl
      case 17:
        keypressStates.ctrl = false;
        break;
      // alt
      case 18:
        keypressStates.alt = false;
        break;
      default:
    }
  });
});