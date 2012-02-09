/**
 * cloudpalette.js
 * 
 * The file where the magic happens.
 */

var CloudPalette = (function () {
  var CP = {},
  
      // Image prototype.
      Image = function (c, w, h) {
        var layers = [],
            history = [],
            placeInHistory = 0,
            ctx = c,
            width = w,
            height = h,
            activeLayer = 0;

        // Create the initial layer
        // TODO: will eventually have to change this to pass in actually data for the second argument.
        layers.push(new Layer("background", {}));
            
        // Image public functions
        // TODO: Should these be added on to the prototype property after?
        
        this.getLayers = function () {
          return layers;
        };
        
        // TODO: rewrite so that users can lookup by layer name OR index.
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
        
        this.newLayer = function (name, data) {
          layers.push(new Layer(name, data));
        };
        
        
        //TODO: Might need to do object/array cloning in the following three functions
        // because the history array is an array of layer objects. Look up the best way
        // to clone arrays of objects.
        this.recordHistory = function () {
          placeInHistory++;
          history[placeInHistory] = layers;          
        }
        
        this.undo = function () {
          placeInHistory--;
          layers = history[placeInHistory];
        }
        
        this.redo = function () {
          placeInHistory++;
          layers = history[placeInHistory];
        }
        
      },
  
      // Layer prototype.
      Layer = function (n, d) {
        var name = n,
            data = d;

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
      };
  var images = {},
      activeImage = undefined;
      
  CP.newImage = function (name, ctx, width, height) {
    images[name] = new Image(ctx, width, height);
    return images[name];
  };
      
  CP.getImages = function () {
    return images;
  };
  
  CP.getImage = function (name) {
    if (images[name]) {
      return images[name];
    } else {
      console.error("No image with the name " + name + " exists.");
    }
  };
  
  CP.getImageCount = function () {
    return Object.keys(images).length
  };
  
  CP.getActiveImage = function () {
    return active;
  };
  
  CP.setActiveImage = function (newActive) {
    active = newActive;
  };
  
  // return as a normal JS module for front-end use.
  return CP
  
}());

  // export as a node-module for unit testing.
  module.exports = CloudPalette;