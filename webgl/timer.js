
class Timer
{
    constructor()
    {
        this.currentTime = 1.0;
        this.lastTime = 0.0;
        this.lastFrames = (new Array(50)).fill(-100.0);
    }

    start(elapsed)
    {
        this.currentTime = elapsed * 0.001;
    }

    elapsedTime()
    {
        return (this.currentTime - this.lastTime);
    }

    totalTime()
    {
        return this.currentTime;
    }

    FPS()
    {
        return this.lastFrames.reduce((a, b) => a + b, 0.0) / this.lastFrames.length;
    }

    reset()
    {
        this.lastFrames.pop();
        this.lastFrames.unshift(1.0 / this.elapsedTime());
        this.lastTime = this.currentTime;
    }
}