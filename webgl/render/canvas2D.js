function Canvas2D(width, height, textColor = "#FFFF00", font = "14px Arial")
{
    this.canvas = document.getElementById("canvas2D");
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.context = this.canvas.getContext('2d');
    this.context.fillStyle = textColor;
    this.context.font = font;
    this.context.textAlign = "start";

    document.getElementById('canvas2D').setAttribute('style', 'border: none; position: absolute; top: 0px; left: 0px; margin: 0');
}


Canvas2D.prototype.clear = function()
{
    this.context.clearRect(0, 0, this.width, this.height);

}

Canvas2D.prototype.drawFPS = function(FPS)
{
    this.context.fillText(FPS + "FPS", this.width - 70, 20);
}