var vows = require('vows'),
    assert = require('assert'),
    cloudPalette = require('../app/public/js/cloudpalette.js');
    
var layerTest = vows.describe('layertest');

layerTest.addBatch({
  'a new Image': {
    topic: cloudPalette.newImage('test', 400, 400),
    'has one layer': function (image) {
      assert.equal(image.getLayers().length, 1);
    },
    'has a layer named "background"': function (image) {
      assert.doesNotThrow(
        function () {
          image.getLayer('background')
        }, Error);
    },
    'can access a layer by index': function (image) {
      assert.doesNotThrow(
        function () {
          image.getLayer(0)
        }, Error);
    },
    'can create a new Layer': function (image) {
      image.newLayer('layer1', {});
      assert.equal(image.getLayers().length, 2);
    }
  },
  
  'a multi layer image': {
    topic: function() {
      image2 = cloudPalette.newImage('test2', 600, 600);
      image2.newLayer('layer1', {});
      image2.newLayer('layer2', {});
      image2.newLayer('layer3', {});
      return image2;
    }(),
    'can move layers around': function (image) {
      image.moveLayer('layer3', 1);
      assert.equal(image.getLayer(1), image.getLayer('layer3'));
    }
    
  }
  
}).export(module);