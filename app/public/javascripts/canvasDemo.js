// author: David Hara
// testing the canvasUtil.js framework

$(function () {
    
    var canvasJQ = $('#demo'),
        canvas = $('#demo').get(0),
        ctx = canvas.getContext('2d'),
        offsetLeft = $('#demo').offset().left;
        offsetTop = $('#demo').offset().top;

    var startPainting = function () {
        canvasJQ.mousedown(function (event) {
            var oldX = event.offsetX,
                oldY = event.offsetY;
            canvasJQ.mousemove(function (event) {
                //canvasUtil.fillCircle(ctx, event.offsetX, event.offsetY, 5);
                ctx.beginPath();
                ctx.moveTo(oldX, oldY);
                ctx.lineTo(event.offsetX, event.offsetY);
                ctx.stroke();
                oldX = event.offsetX;
                oldY = event.offsetY;
            });
        })
        .mouseup(function (event) {
            canvasJQ.unbind('mousemove');
        });
    },
    startRectangle = function () {
        
    };
    $('#paintbrush').click(function () {
        canvasJQ.unbind();
        startPainting();
    });
    $('#rectangle').click(function () {
        canvasJQ.unbind();
        startRectangle();
    });
});