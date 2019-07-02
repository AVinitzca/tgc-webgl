function Input()
{
    this.newPressed = new Set();
    this.currentPressed = new Set();
    this.pastPressed = new Set();
    //this.toRemove = new Set();

    var input = this;
    document.addEventListener("keydown", function(event){input.keyDownCallback(event);}, false);
    document.addEventListener("keyup", function(event){input.keyUpCallback(event);}, false);
    document.addEventListener('mousemove', (event, target) =>
    {
        target = target || event.target;
        var rectangle = target.getBoundingClientRect();
        input.mousePosition = new Vector2(event.clientX - rectangle.left, event.clientY - rectangle.top);
    });
}

Input.prototype.update = function()
{
    this.pastPressed.clear();
    this.newPressed.clear();
}

Input.prototype.getMousePosition = function()
{
    return this.mousePosition;
}

Input.prototype.getMouseX = function()
{
    return this.mousePosition.x();
}

Input.prototype.getMouseY = function()
{
    return this.mousePosition.y();
}

Input.prototype.keyDownCallback = function(event)
{
    if(!this.currentPressed.has(event.key))
        this.newPressed.add(event.key);
    this.currentPressed.add(event.key);
}

Input.prototype.keyUpCallback = function(event)
{
    this.currentPressed.delete(event.key);
    this.pastPressed.add(event.key);
}

Input.prototype.keyPressed = function(key)
{
    return this.newPressed.has(key);
}

Input.prototype.keyDown = function(key)
{
    return this.currentPressed.has(key);
}

Input.prototype.keyUp = function(key)
{
    return this.pastPressed.has(key);
}


