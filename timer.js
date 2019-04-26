
function Timer()
{
    this.currentTime = 0.0;
    this.lastTime = 0.0;
}

Timer.prototype.start = function(elapsed)
{
    this.currentTime = elapsed * 0.001;
}

Timer.prototype.elapsedTime = function()
{
    return (this.currentTime - this.lastTime);
}

Timer.prototype.totalTime = function()
{
    return this.currentTime;
}

Timer.prototype.FPS = function()
{
    return (1.0 / this.elapsedTime()).toFixed(1);
}

Timer.prototype.reset = function()
{
    this.lastTime = this.currentTime;
}



