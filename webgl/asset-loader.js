resourceLoader.load('webgl/render/mesh.js');
resourceLoader.load('webgl/render/shader.js');
resourceLoader.load('webgl/render/texture.js');


class MeshLoader extends ResourceLoader
{
    constructor(paths)
    {
        super(paths, function(loader, element)
        {
            var name = element.name;
            readFile(element.path, function(fileContent)
            {
                loader.meshes[name] = createMeshFromOBJ(fileContent);
                loader.advance();
            });
        });
        this.meshes = [];
    }
}

class TextureLoader extends ResourceLoader
{
    constructor(paths)
    {
        super(paths, function(loader, element)
        {
            var name = element.name;
            if(name == undefined)
                name = fileNameWithoutExtension(element.path);
            loader.textures[name] = new Texture(element.path, function(){loader.advance();});
        });
        this.textures = [];
    }
}

class ShaderLoader extends ResourceLoader
{
    constructor(paths)
    {
        super(paths, function(loader, element)
        {
            var name = element.name;
            if(name == undefined)
                name = fileNameWithoutExtension(element.vertex);
            var vertex = undefined;
            var fragment = undefined;

            readFile(element.vertex, function(fileContent)
            {
                vertex = fileContent;
                if(fragment)
                {
                    loader.shaders[name] = new Shader(vertex, fragment);
                    loader.advance();
                }
            });
            readFile(element.fragment, function(fileContent)
            {
                fragment = fileContent;
                if(vertex)
                {
                    loader.shaders[name] = new Shader(vertex, fragment);
                    loader.advance();
                }
            });
        });
        this.shaders = [];
    }
}

class SoundLoader extends ResourceLoader
{
    constructor(paths)
    {
        super(paths, function(loader, element)
        {
            var name = element.name;
            if(name == undefined)
                name = fileNameWithoutExtension(element.path);

            readStream(element.path, function(fileContent)
            {
                AudioManager.decodeSound(fileContent, function(buffer)
                {
                    loader.sounds[name] = new Sound(buffer);
                    loader.advance();
                }, function()
                {
                    loader.advance();
                });
            });
        });
        this.sounds = [];
    }
}

function readFile(path, after)
{
    fetch(path).then(function(element)
    {
        return element.text();
    }).then(function(element)
    {
        after(element);
    });
}

function readStream(path, after)
{
    fetch(path).then(function(response)
    {
        return response.arrayBuffer();
    }).then(function(buffer)
    {
        after(buffer);
    });
}

function fileNameWithoutExtension(fileName)
{
    return fileName.split(/(\\|\/)/g).pop().split('.').slice(0, -1).join('.');
}