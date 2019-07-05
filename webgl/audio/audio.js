resourceLoader.load('webgl/audio/sound.js');

class AudioManager
{
    constructor()
    {
        this.context = new window.AudioContext();
        if (!this.context)
        {
            console.log("ERROR");
            throw new Error("AudioContext not supported!");
        }    
    }

    decodeSound(buffer, after)
    {
        this.context.decodeAudioData(buffer, function(buffer)
        {
            after(buffer);
        }, function(error)
        {
            after();
            console.error('Decode Audio Data Error', error);
        })
    }

    createGainNode()
    {
        return this.context.createGain();
    }

    connectToOutput(node)
    {
        node.connect(this.context.destination);
    }

    dispose()
    {
        if(this.context)
            this.context.close();
    }
}
