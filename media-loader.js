var _shaders = {}, _textures = {}, _meshes = {}, amountOfMediaToWait = 0, afterLoad = null;

function loadMedia(doAfter)
{
    afterLoad = doAfter;
    amountOfMediaToWait = shaders.length + meshes.length + textures.length;
    var post = postLoadMedia;
    loadShaders(post);
    loadMeshes(post);
    loadTextures(post);
}

function loadShaders(after)
{
    shaders.forEach(shaderDefinition =>
    {
        for(var key in shaderDefinition)
            loadShader(key, shaderDefinition[key][0], shaderDefinition[key][1], after);
    });
}

function loadMeshes(after)
{
    meshes.forEach(meshDefinition =>
    {
        for(var name in meshDefinition)
        {
            loadMesh(name, meshDefinition[name], after);
        }
    });
}

function loadTextures(after)
{
    textures.forEach(texture =>
    {
        loadTexture(fileNameWithoutExtension(texture), texture, after);
    });
}

function fileNameWithoutExtension(fileName)
{
    return fileName.split(/(\\|\/)/g).pop().split('.').slice(0, -1).join('.');
}

function postLoadMedia()
{
    amountOfMediaToWait--;
    if(amountOfMediaToWait == 0)
    {
        prepareMediaVariables();
        afterLoad();
        delete afterLoad;
    }
}
function prepareMediaVariables()
{
    textures = _textures;
    meshes   = _meshes;
    shaders  = _shaders;

    delete _textures;
    delete _meshes;
    delete _shaders;
}