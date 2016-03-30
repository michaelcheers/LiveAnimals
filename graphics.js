function initGraphics()
{
    var canvas = document.getElementById("gameCanvas");
    var ctx = canvas.getContext("2d");

    var img1 = new Image();

    img1.onload = function ()
    {
        ctx.drawImage(img1, 0, 0);
    };

    img1.src = 'img/grass.png';
}

setTimeout(function () { initGraphics(); }, 1000);