/**
 * cloudpalette.js
 * 
 * The file where the magic happens.
 */

var CloudPalette = (function () {
  var CP = {},
  
      // Image prototype.
      Image = function (n, c, w, h) {
        var layers = [],
            history = [],
            placeInHistory = 0,
            name = n,
            width = w,
            height = h,
            activeLayer = null,
            recentlyEdited = false;

        // Create the initial layer
        
        layers.push(new Layer("background", c.createImageData(width, height), c));
        history[0] = [layers[0].clone()]; 
        activeLayer = layers[0];
            
        // Image public functions
        // TODO: Should these be added on to the prototype property after the creation??
        
        this.getWidth = function () {
          return width;
        }
        
        this.getHeight = function () {
          return height;
        }
        
        this.getLayers = function () {
          return layers;
        };
        
        this.getHistory = function () {
          return history;
        }
        
        this.getLayer = function (lookup) {
          if (typeof lookup === 'string') {
            for (var i = 0; i < layers.length; i ++) {
              if (layers[i].getName() === lookup) {
                return layers[i];
              }
            }
            throw new Error('No layer named "' + lookup + '" exists.')
          } else if (typeof lookup === 'number') {
            if (layers[lookup]) {
              return layers[lookup];
            } else {
              throw new Error('No layer with index ' + lookup + ' exists.')
            }
          } else {
            throw new Error('Invalid argument: Should use the index of a layer (number) or name of the layer (string)');
          }
        };
        
        this.newLayer = function (name, ctx) {
          data = ctx.createImageData(width, height)
          layers.push(new Layer(name, data, ctx));
        };
        
        this.getName = function () {
          return name;
        }
        
        this.getActiveLayer = function () {
          return activeLayer;
        };
        
        this.getActiveLayerIndex = function () {
          for (var i = 0; i < layers.length; i++) {
            if (activeLayer === layers[i]) {
              return i;
            }
          }
          
          throw new Error('We should never get this error, something is seriously wrong!');
        };
        
        this.setActiveLayer = function (a) {
          activeLayer = this.getLayer(a);
        };
        
        this.getEdited = function () {
          return recentlyEdited;
        };
        
        this.setEdited = function (r) {
          recentlyEdited = r;
        };
        
        this.cloneLayers = function () {
          var clonedLayers = [];
          for (var i = 0; i < layers.length; i++) {
            clonedLayers[i] = layers[i].clone();
          }
          return clonedLayers;
        };
        
        this.cloneHistory = function (time) {
          var clonedHistory = [];
          
          for (var i = 0; i < history[time].length; i++) {
            clonedHistory[i] = history[time][i].clone();
          }
          return clonedHistory;
        };
        
        this.updateHistoryCtxForLayer = function (layerNumber) {
          var ctx = layers[layerNumber].getContext();
          for (var i = 0; i < history.length; i++) {
            if (history[i][layerNumber]) {
              history[i][layerNumber].setContext(ctx);
            }
          }
        };
        
        this.recordHistory = function () {
          placeInHistory++;
          history[placeInHistory] = this.cloneLayers();
          //remove unnecessary history
          history.splice(placeInHistory+1);
        };
        
        this.undo = function () {
          placeInHistory--;
          if(history[placeInHistory]){
            layers = this.cloneHistory(placeInHistory);
            activeLayer = this.getLayer(layers.length - 1);
          } else {
            placeInHistory++;
            throw new Error('there is no history to undo');
          }
        };
        
        this.redo = function () {
          placeInHistory++;
          if(history[placeInHistory]){
            layers = this.cloneHistory(placeInHistory);
            // because we've been cloning layers, there may be a new object for the new active layer
            // and we need to replace it.
            activeLayer = this.getLayer(layers.length - 1);
          } else {
            placeInHistory--;
            throw new Error('there is no history to redo');
          }
        };
        
        this.mergeLayers = function (bottomLayerIndex, topLayerIndex) {
          var topLayerData = layers[topLayerIndex].getData(),
              bottomLayerData = layers[bottomLayerIndex].getData(),
              newData = layers[bottomLayerIndex].getContext().createImageData(width, height),
              outR, outB, outG, outA, srcA, destA;
              
          for (var i = 0; i * 4 < newData.data.length; i++) {
            
            // alpha values in image data are stored on a scale between 0 - 255, so we want to change them
            // to a scale between 0 and 1;
            srcA = topLayerData.data[(i*4) + 3] / 255;
            destA = bottomLayerData.data[(i*4) + 3] / 255;
            
            //computes the final alpha value of the blended pixels.
            outA = srcA + (destA*(1 - srcA));
            
            // to avoid dividing by 0, check to see if the final alpha is 0. If it is just set the RGB to 0.
            if (outA === 0) {
              outR = outG = outB = 0;
            } else {
              // computes the final rbg values of the blended pixels
              outR = ((topLayerData.data[i*4]*srcA) + (bottomLayerData.data[i*4]*destA*(1 - srcA))) / outA;
              outB = ((topLayerData.data[(i*4) + 1]*srcA) + (bottomLayerData.data[(i*4) + 1]*destA*(1 - srcA))) / outA;
              outG = ((topLayerData.data[(i*4) + 2]*srcA) + (bottomLayerData.data[(i*4) + 2]*destA*(1 - srcA))) / outA;
            }
            // console.log('R: ' + outR + ', G: ' + outG + ', B: ' + outB + ', A: ' + outA)
            newData.data[i*4] = outR;
            newData.data[(i*4) + 1] = outB;
            newData.data[(i*4) + 2] = outG;
            // adjusting back to the 0 - 255 scale
            newData.data[(i*4) + 3] = outA * 255;
            
          }
          
          layers[bottomLayerIndex].setData(newData);
          if (this.getActiveLayerIndex() === topLayerIndex) {
            activeLayer = this.getLayer(bottomLayerIndex);
          }
          layers.splice(topLayerIndex, 1);
        };
        
        this.flattenImage = function () {
          for (var i = layers.length - 1; i > 0 ; i--) {
            this.mergeLayers(i - 1, i);
          }
          activeLayer = this.getLayer(0);          
        };
        
        this.moveLayer = function (layerIndex, newLocation) {
          var layerToMove = layers.splice(layerIndex, 1)[0];
          layers.splice(newLocation, 0, layerToMove);
        };
        
        this.moveActiveLayerUp = function () {
          this.moveLayer(this.getActiveLayerIndex(), this.getActiveLayerIndex() + 1);
        };
        
        this.moveActiveLayerDown = function () {
          this.moveLayer(this.getActiveLayerIndex(), this.getActiveLayerIndex() - 1);
        };
        
      },
  
      // Layer prototype.
      Layer = function (n, d, c) {
        var name = n,
            data = d,
            ctx = c;

        this.getData = function () {
          return data;
        };
        
        this.setData = function (d) {
          data = d;
        };
        
        this.getName = function () {
          return name;
        };
        
        this.setName = function (n) {
          name = n;
        };
        
        this.getContext = function () {
          return ctx;
        };
        
        this.setContext = function (c) {
          ctx = c;
        };
        
        this.clone = function () {
          var newData = ctx.createImageData(data.width, data.height);
          
          for (var i = 0; i < data.data.length; i++) {
            newData.data[i] = data.data[i];
          }          
          return new Layer(name, newData, ctx);
        };
      };
  var images = {},
      activeImage = undefined;
      
  CP.newImage = function (name, ctx, width, height) {
    images[name] = new Image(name, ctx, width, height);
    return images[name];
  };
      
  CP.getImages = function () {
    return images;
  };
  
  CP.getImage = function (name) {
    if (images[name]) {
      return images[name];
    } else {
      throw new Error("No image with the name " + name + " exists.");
    }
  };
  
  CP.getImageCount = function () {
    return Object.keys(images).length
  };
  
  CP.getActiveImage = function () {
    return activeImage;
  };
  
  CP.setActiveImage = function (newActive) {
    if (images[newActive]) {
      activeImage = images[newActive];
    } else {
      throw new Error("No image with the name " + newActive + " exists.");
    }
  };
  
  // return as a normal JS module for front-end use.
  return CP
  
}());

  // export as a node-module for unit testing.
  // WARNING: this will cause an error in the browser, but should be ignorable
  module.exports = CloudPalette;