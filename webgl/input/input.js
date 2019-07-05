class Input
{
    constructor()
    {
        this.newPressed = new Set();
        this.currentPressed = new Set();
        this.pastPressed = new Set();

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

    update()
    {
        this.pastPressed.clear();
        this.newPressed.clear();
    }

    getMousePosition()
    {
        return this.mousePosition;
    }

    get mouseX()
    {
        return this.mousePosition.x();
    }

    get mouseY()
    {
        return this.mousePosition.y();
    }

    keyDownCallback(event)
    {
        if(!this.currentPressed.has(event.key))
            this.newPressed.add(event.key);
        this.currentPressed.add(event.key);
    }

    keyUpCallback(event)
    {
        this.currentPressed.delete(event.key);
        this.pastPressed.add(event.key);
    }

    keyPressed(key)
    {
        return this.newPressed.has(key);
    }

    keyDown(key)
    {
        return this.currentPressed.has(key);
    }

    keyUp(key)
    {
        return this.pastPressed.has(key);
    }

}