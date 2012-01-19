/**
 * cloudpalette.js
 * 
 * The file where the magic happens.
 */

var CloudPalette = {
  image: {}
};

include.includeInit([
  
  /****** Utils ******/
  '/js/util/canvasUtil.js',
  
  /****** Prototypes ******/
  '/js/prototype/layer.js',
  '/js/prototype/image.js'
  
]);