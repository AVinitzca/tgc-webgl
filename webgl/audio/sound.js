class Sound extends AudioBufferSourceNode
{
    constructor(decodedBuffer)
    {
        super(Core.audioManager, decodedBuffer);
        this.buffer = decodedBuffer;
    }

    moult()
    {
        return new Sound(this.buffer);
    }

}

