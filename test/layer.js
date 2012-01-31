var vows = require('vows'),
    assert = require('assert'),
    cloudPalette = require('../app/public/js/cloudpalette.js');
    
var layerTest = vows.describe('layer');

layerTest.addBatch({
  'a new Image': {
    topic: cloudPalette.newImage('test', 400, 400),
    'has one layer': function (image) {
      assert.equal(image.getLayers().length, 1);
    },
    'has a layer named "background"': function (image) {
      assert.doesNotThrow(image.getLayer('background'), Error);
    },
    'can create a new Layer': function (image) {
      image.newLayer('layer1', {});
      assert.equal(image.getLayers().length, 2);
    },
  }
  
  
}).export(module);