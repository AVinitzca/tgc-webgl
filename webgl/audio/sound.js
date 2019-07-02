function Sound(decodedBuffer)
{
    var sound = AudioManager.createSound();
    sound.buffer = decodedBuffer;
    return sound;
}

AudioBufferSourceNode.prototype.moult = function()
{
    return new Sound(this.buffer);
}

