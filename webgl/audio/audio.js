resourceLoader.load('webgl/audio/sound.js');

function AudioManager(){}

AudioManager.initialize = function()
{
    AudioManager.context = new window.AudioContext();
    if (!AudioManager.context)
    {
        console.log("ERROR");
        throw new Error("AudioContext not supported!");
    }
    //AudioManager.context.suspend();
}

AudioManager.decodeSound = function(buffer, after)
{
    AudioManager.context.decodeAudioData(buffer, function(buffer)
    {
        after(buffer);
    }, function(error)
    {
        after();
        console.error('Decode Audio Data Error', error);
    })
}

AudioManager.createSound = function()
{
    return AudioManager.context.createBufferSource();
}

AudioManager.createGainNode = function()
{
    return AudioManager.context.createGain();
}

AudioManager.connectToOutput = function(node)
{
    node.connect(AudioManager.context.destination);
}

AudioManager.dispose = function()
{
    if(AudioManager.context)
        AudioManager.context.close();
}