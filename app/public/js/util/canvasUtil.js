// author: David Hara
// utility class for the canvas element

var canvasUtil = function () {
    return {
        
        // Generic circle drawing tools
        drawCircle: function (ctx, x, y, r) {
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2 * Math.PI);
            ctx.closePath();
        },
        fillCircle: function (ctx, x, y, r) {
            canvasUtil.drawCircle(ctx, x, y, r);            
            ctx.fill();
        },
        strokeCircle: function (ctx, x, y, r) {
            canvasUtil.drawCircle(ctx, x, y, r);
            ctx.stroke();
        },
        
        // Generic ellipse drawing tools
        drawEllipse: function (ctx, x, y, h, w) {
            var scale;
            ctx.save();
            
            // Did this for the best possible resolution.
            // if we just made a circle of radius one and scaled it up
            // it would be pixelated (maybe?).
            if (h > w) {
                scale = w / h;
                ctx.scale(1, scale);
                ctx.beginPath();
                ctx.arc(x, y, h, 0, 2 * Math.PI);
                ctx.closePath();
            } else {
                scale = h / w;
                ctx.scale(scale, 1);
                ctx.beginPath();
                ctx.arc(x, y, w, 0, 2 * Math.PI);
                ctx.closePath();
            }
            ctx.restore();
        },
        fillEllipse: function (ctx, x, y, r) {
            canvasUtil.drawCircle(ctx, x, y, r);
            ctx.fill();
        },
        strokeEllipse: function (ctx, x, y, r) {
            canvasUtil.drawCircle(ctx, x, y, r);
            ctx.stroke();
        },
        
        hexToRGBString: function (hex) {
          var rgbString = 'rgb(';
          
          hex = (hex.charAt(0)=="#") ? hex.substring(1,7) : hex;
          rgbString = rgbString + parseInt((hex).substring(0,2),16) + ',';
          rgbString = rgbString + parseInt((hex).substring(2,4),16) + ',';
          rgbString = rgbString + parseInt((hex).substring(4,6),16);
          
          return rgbString + ')';
        }
    };
}();