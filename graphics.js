var GFX =
{
};

function loadGraphics()
{
    var graphicsList = ["grass", "rabbit", "worm"];

    graphicsList.forEach(function (name)
    {
        var img = new Image();
        img.src = "img/" + name + ".png";
        GFX[name] = img;
    });
}
loadGraphics();

function initGraphics()
{
    //    ctx.drawImage(img, 0, 0);
    setInterval(redrawGraphics, 1000);
}

function redrawGraphics()
{
    var canvas = document.getElementById("gameCanvas");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#00FF00";
    ctx.fillRect(0, 0, 1000, 1000);
    ctx.drawImage(GFX["grass"], 0, 0);
    drawAnimal(ctx, GFX["rabbit"], 100, 150);
    drawAnimal(ctx, GFX["worm"], 250, 150);
}

function drawAnimal(ctx, image, x, y)
{
    ctx.drawImage(image, x-image.width*0.5, y-image.height);
}