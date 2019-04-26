
var shaders =
[
    {'normal': ['normal.vert', 'normal.frag']}
];

var meshes =
[
    {'monkey': 'monkey.obj'},
    {'palm': 'file:///C:/Users/Ronan/Desktop/WebGLTGC/Palm/palm.obj'},
    {'skull': 'file:///C:/Users/Ronan/Desktop/WebGLTGC/Skull/skull.obj'},
    {'tgcito': 'file:///C:/Users/Ronan/Desktop/WebGLTGC/tgcito/tgcito.obj'}
];

var textures =
[
    'lava.jpg',
    'file:///C:/Users/Ronan/Desktop/WebGLTGC/Skull/skull.jpg',
    'file:///C:/Users/Ronan/Desktop/WebGLTGC/tgcito/uvw.jpg'
];

var resources =
[
    'something.js'
];

var transform;
var customCamera;

function initialize()
{
    meshes.monkey.setShader(shaders.normal);
    meshes.palm.setShader(shaders.normal);
    meshes.skull.setShader(shaders.normal);
    meshes.tgcito.setShader(shaders.normal);
    transform = mat4.scale(mat4.identity(), vec3.createFrom(7.0, 7.0, 7.0));
    customCamera = {position: vec3.createFrom(80.0, 0.0, 0.0), lookAt: vec3.createFrom(-1, 0, 0), up: vec3.createFrom(0, 1, 0)};
    meshes.palm.addTexture('textureOne', textures['lava']);
    meshes.monkey.addTexture('textureOne', textures['lava']);
    meshes.skull.addTexture('textureOne', textures['skull']);
    meshes.tgcito.addTexture('textureOne', textures['uvw']);

    meshes.skull.transform = mat4.rotate(mat4.identity(), -Math.PI / 2, vec3.createFrom(1.0, 0.0, 0.0));
    meshes.skull.transform = mat4.translate(meshes.skull.transform, vec3.createFrom(150.0, 0.0, 0.0));

    camera = customCamera;

}

function update(elapsedTime)
{
    camera.position[0] = 200 * Math.cos(timer.totalTime());
    camera.position[2] = 200 * Math.sin(timer.totalTime());
}

function render()
{
  //  meshes['monkey'].render();
    //meshes['palm'].render();

    meshes.skull.render();
    meshes.tgcito.render();
}

function dispose()
{
    for(var key in meshes)
        meshes[key].dispose();
    for(var key in shaders)
        shaders[key].dispose();
    for(var key in textures)
        textures[key].dispose();
}