class Canvas2D
{
    constructor(size, textColor = "#FFFF00", font = "14px Arial")
    {
        this.canvas = document.getElementById("canvas2D");
        this.size = size;
        this.canvas.width = size.x;
        this.canvas.height = size.y;
        this.context = this.canvas.getContext('2d');
        this.context.fillStyle = textColor;
        this.context.font = font;
        this.context.textAlign = "start";

        document.getElementById('canvas2D').setAttribute('style', 'border: none; position: absolute; top: 0px; left: 0px; margin: 0');
    }

    clear()
    {
        this.context.clearRect(0, 0, this.size.x, this.size.y);
    }

    drawFPS(FPS)
    {
        this.context.fillText(FPS + "FPS", this.size.x - 70, 20);
    }
}