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
            activeLayer = 0,
            recentlyEdited = false;

        // Create the initial layer
        
        layers.push(new Layer("background", c.createImageData(width, height), c));
        history[0] = [layers[0].clone()]; 
            
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
            throw new Error('Invalid argument')
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
        
        this.setActiveLayer = function (a) {
          activeLayer = a;
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
        }
        
        this.cloneHistory = function (time) {
          var clonedHistory = [];
          
          for (var i = 0; i < history[time].length; i++) {
            clonedHistory[i] = history[time][i].clone();
          }
          return clonedHistory;
        }
        
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
            activeLayer = layers.length - 1;
          } else {
            placeInHistory++;
            throw new Error('there is no history to undo');
          }
        };
        
        this.redo = function () {
          placeInHistory++;
          if(history[placeInHistory]){
            layers = this.cloneHistory(placeInHistory);
          } else {
            placeInHistory--;
            throw new Error('there is no history to redo');
          }
        };
        
        this.mergeLayers = function (bottomLayerIndex, topLayerIndex) {
          var topLayerData = layers[topLayerIndex].getData(),
              bottomLayerData = layers[bottomLayerIndex].getData(),
              newData = layers[bottomLayerIndex].getContext().createImageData(width, height);
              
          for (var i = 0; i * 4 < newData.data.length; i++) {
            
              newData.data[i*4] = bottomLayerData.data[i*4];
              newData.data[(i*4) + 1] = bottomLayerData.data[(i*4) + 1];
              newData.data[(i*4) + 2] = bottomLayerData.data[(i*4) + 2];
              newData.data[(i*4) + 3] = bottomLayerData.data[(i*4) + 3];
            // If the top layer has any 'empty' pixels, place the bottom layer pixels into the new image data. Else just use the top layers pixels.
            if (topLayerData.data[i*4] !== 0 || topLayerData.data[(i*4) + 1] !== 0 || topLayerData.data[(i*4) + 2] !== 0 || topLayerData.data[(i*4) + 3] !== 0) {              
              newData.data[i*4] = topLayerData.data[i*4];
              newData.data[(i*4) + 1] = topLayerData.data[(i*4) + 1];
              newData.data[(i*4) + 2] = topLayerData.data[(i*4) + 2];
              newData.data[(i*4) + 3] = topLayerData.data[(i*4) + 3];
            }
          }
          
          layers[bottomLayerIndex].setData(newData);
          layers.splice(topLayerIndex, 1);
          if (activeLayer === topLayerIndex) {
            activeLayer = bottomLayerIndex;
          }
        };
        
        this.flattenImage = function () {
          for (var i = layers.length - 1; i > 0 ; i--) {
            this.mergeLayers(i - 1, i);
          }
          activeLayer = 0;          
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
        }
        
        this.getName = function () {
          return name;
        };
        
        this.setName = function (n) {
          name = n;
        }
        
        this.getContext = function () {
          return ctx;
        };
        
        this.clone = function () {
          var newData = ctx.createImageData(data.width, data.height);
          
          for (var i = 0; i < data.data.length; i++) {
            newData.data[i] = data.data[i];
          }          
          return new Layer(name, newData, ctx);
        }
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
  module.exports = CloudPalette;