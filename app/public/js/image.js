/**
 * image.js
 * 
 * The image class representing the data for each image
 */

var Image = function (ctx, width, height) {
  var layers = [],
      history = [];
      
  var layerData = ctx.createImageData(width, height),
      initialLayer = new Layer(layerData.data, layerData.width, layerData.height);
  layers.push(initialLayer);
  
};
