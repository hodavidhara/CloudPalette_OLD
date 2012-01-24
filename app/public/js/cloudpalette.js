/**
 * cloudpalette.js
 * 
 * The file where the magic happens.
 */

var CloudPalette = (function () {
  var CP = {},
      // Image prototype.
      Image = function (w, h) {
        var layers = [],
            history = [],
            placeInHistory = 0,
            width = w,
            height = h;

        // Create the initial layer
        // TODO: will eventually have to change this to pass in actually data for the second argument.
        layers.push(new Layer("background", {}));
            
        // Image public functions
        // TODO: Should these be added on to the prototype property after?
        
        this.getLayers = function () {
          return layers;
        };
        
        this.getLayer = function (i) {
          if (layers[i]) {
            return layers[i];
          } else {
            console.error ("No layer with index " + index + " exists.");
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
      },
      images = {};
      
  CP.newImage = function (name, width, height) {
    images[name] = new Image(width, height);
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
  
  
  return CP
  
}());