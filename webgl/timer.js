
function Timer()
{
    this.currentTime = 1.0;
    this.lastTime = 0.0;
    this.lastFrames = Array(50).fill(-100.0);
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
    return this.lastFrames.reduce((a, b) => a + b, 0.0) / this.lastFrames.length;
}

Timer.prototype.reset = function()
{
    this.lastFrames.pop();
    this.lastFrames.unshift(1.0 / this.elapsedTime());
    this.lastTime = this.currentTime;
}