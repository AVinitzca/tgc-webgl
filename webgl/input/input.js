class Input
{
    constructor()
    {
        this.newPressed = new Set();
        this.currentPressed = new Set();
        this.pastPressed = new Set();

        this.mousePosition = Vector2.zero;
        this.deltaMousePosition = new Vector2(0.1);

        this.updatedMouseDelta = false;

        let input = this;
        document.addEventListener("keydown", function(event){input.keyDownCallback(event);}, false);
        document.addEventListener("keyup", function(event){input.keyUpCallback(event);}, false);
        document.addEventListener('mousemove', (event, target) =>
        {
            target = target || event.target;
            let rectangle = target.getBoundingClientRect();

            let newPosition = new Vector2(event.clientX - rectangle.left, event.clientY - rectangle.top);
            input.deltaMousePosition = newPosition.subtracted(input.mousePosition);
            input.mousePosition = newPosition;
            input.updatedMouseDelta = true;
        });
    }

    update()
    {
        this.pastPressed.clear();
        this.newPressed.clear();
        if(!this.updatedMouseDelta && !this.mouseMoved())
        {
            this.deltaMousePosition = Vector2.zero;
        }
        else
            this.updatedMouseDelta = false;
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

    mouseDelta()
    {
        return this.deltaMousePosition;
    }

    mouseDeltaX()
    {
        return this.deltaMousePosition.x;
    }

    mouseDeltaY()
    {
        return this.deltaMousePosition.y;
    }

    mouseMoved()
    {
        return this.updatedMouseDelta;
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