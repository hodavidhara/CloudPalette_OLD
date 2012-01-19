/**
 * cloudpalette.js
 * 
 * The file where the magic happens.
 */

var CloudPalette = {
  images: {},
};

include.includeInit([
  
  /****** Utils ******/
  '/js/util/canvasUtil.js',
  
  /****** Prototypes ******/
  '/js/prototype/layer.js',
  '/js/prototype/image.js'
  
]);

$(function () {
  var canvasJQ = $('#demo'),
      canvas = $('#demo').get(0),
      ctx = canvas.getContext('2d'),
      offsetLeft = $('#demo').offset().left;
      offsetTop = $('#demo').offset().top;
  
  CloudPalette.images.push(new CloudPalette.Image(ctx, canvas.width, canvas.height));
});
