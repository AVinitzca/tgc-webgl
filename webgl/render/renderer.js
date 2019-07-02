resourceLoader.load('webgl/math/vector.js');
resourceLoader.load('webgl/math/matrix.js');
resourceLoader.load('webgl/math/math.js');
resourceLoader.load('webgl/render/canvas2D.js');
resourceLoader.load('webgl/render/framebuffer.js');

function Renderer(){}


Renderer.initialize = function()
{
    Renderer.findCanvas();
    Renderer.canvas2D = new Canvas2D(Renderer.width, Renderer.height);
    Renderer.initializeGL();

    Renderer.setProjection(mat4.perspective(90.0, Renderer.width / Renderer.height, .1, 1000.0));
    Renderer.setClearColor(vec4.createFrom(0.39215686274, 0.58431372549, 0.9294117647, 1.0));

    Renderer.defaultShaderLoader = new ShaderLoader([{name: 'default', vertex: 'webgl/render/default/default.vert', fragment: 'webgl/render/default/default.frag'}]);

    Renderer.createFullscreenQuad();
}


Renderer.findCanvas = function()
{
    Renderer.canvas = document.getElementById("main-canvas");
    Renderer.width = document.body.clientWidth;
    Renderer.height = document.body.clientHeight;
    Renderer.canvas.width = Renderer.width;
    Renderer.canvas.height = Renderer.height;
}

Renderer.initializeGL = function()
{
    try
    {
        Renderer.gl = Renderer.canvas.getContext("experimental-webgl");
        Renderer.gl.viewportWidth = Renderer.width;
        Renderer.gl.viewportHeight = Renderer.height;
        Renderer.gl.enable(Renderer.gl.DEPTH_TEST);
        Renderer.gl.enable(Renderer.gl.CULL_FACE);
        Renderer.gl.disable(Renderer.gl.BLEND);
    }
    catch(e)
    {
        console.log(e);
    }
    if (!Renderer.gl)
    {
        alert("Could not initialize WebGL. See the console for more info.");
    }
}

Renderer.setProjection = function(projectionMatrix)
{
    Renderer.projection = projectionMatrix;
}

Renderer.setCamera = function(camera)
{
    Renderer.camera = camera;
}

Renderer.setClearColor = function(color)
{
    Renderer.clearColor = color;
}

Renderer.createFullscreenQuad = function()
{
    var vertices = {data: [-1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0], size: 2};
    var textureCoordinates = [0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0];
    Renderer.fullscreenQuad = new Mesh(vertices, [0, 1, 2, 0, 2, 3], null, textureCoordinates);
}

Renderer.clear = function()
{
    Renderer.gl.clearColor(Renderer.clearColor[0], Renderer.clearColor[1], Renderer.clearColor[2], Renderer.clearColor[3]);
    Renderer.gl.clear(Renderer.gl.COLOR_BUFFER_BIT | Renderer.gl.DEPTH_BUFFER_BIT | Renderer.gl.STENCIL_BUFFER_BIT);
}

Renderer.preRender = function()
{
    var view = mat4.lookAt(Renderer.camera.position, Renderer.camera.lookAt, Renderer.camera.up);
    var viewProjection = mat4.identity();
    mat4.multiply(Renderer.projection, view, viewProjection);

    for(var key in Renderer.shaders)
        Renderer.shaders[key].setVPMatrix(viewProjection);

    Renderer.clear();
}

Renderer.postRender = function(timer)
{
    Renderer.canvas2D.clear();
    Renderer.canvas2D.drawFPS(timer.FPS());
}

Renderer.renderToFrameBuffer = function(app, renderMethod, frameBuffer)
{
    frameBuffer.bind();
    Renderer.clear();
    renderMethod.call(app);
}

Renderer.renderFullscreenQuad = function(texture, shader)
{
    Renderer.fullscreenQuad.clearTextures();
    if (texture instanceof FrameBuffer)
    {
        Renderer.fullscreenQuad.addTexture("textureOne", texture.getTexture());
    }
    else if(texture instanceof Texture)
        Renderer.fullscreenQuad.addTexture("textureOne", texture);
    else
    {
        var quad = Renderer.fullscreenQuad;
        Object.keys(texture).forEach(function (key)
        {
            if (texture[key] instanceof FrameBuffer)
                quad.addTexture(key, texture[key].getTexture());
            else
                quad.addTexture(key, texture[key]);
        });
    }

    Renderer.fullscreenQuad.setShader(shader);
    Renderer.fullscreenQuad.render();
}

Renderer.getSize = function()
{
    return {x: Renderer.width, y: Renderer.height};
}
