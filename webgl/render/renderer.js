resourceLoader.load('webgl/math/vector.js');
resourceLoader.load('webgl/math/matrix.js');
resourceLoader.load('webgl/math/math.js');
resourceLoader.load('webgl/render/canvas2D.js');
resourceLoader.load('webgl/render/framebuffer.js');

class Renderer
{
    constructor()
    {
        this.shaders = {};
        this.findCanvas();
        this.canvas2D = new Canvas2D(this.width, this.height);
        this.initializeGL();

        this.setProjection(mat4.perspective(90.0, this.width / this.height, .1, 1000.0));
        this.setClearColor(vec4.createFrom(0.39215686274, 0.58431372549, 0.9294117647, 1.0));

        this.defaultShaderLoader = new ShaderLoader([{name: 'default', vertex: 'webgl/render/default/default.vert', fragment: 'webgl/render/default/default.frag'}]);
        this.contentLoader = new ResourceLoader([], function(loader)
        {
            Core.renderer.createFullscreenQuad();
            loader.advance();
        });

        this.contentLoader.derivesIn(this.defaultShaderLoader);
    }

    findCanvas()
    {
        this.canvas = document.getElementById("main-canvas");
        this.width = document.body.clientWidth;
        this.height = document.body.clientHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    initializeGL()
    {
        try
        {
            this.gl = this.canvas.getContext("experimental-webgl");
            this.gl.viewportWidth = this.width;
            this.gl.viewportHeight = this.height;
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.enable(this.gl.CULL_FACE);
            this.gl.disable(this.gl.BLEND);
        }
        catch(e)
        {
            console.log(e);
        }
        if (!this.gl)
        {
            alert("Could not initialize WebGL. See the console for more info.");
        }
    }

    setProjection(projectionMatrix)
    {
        this.projection = projectionMatrix;
    }

    setCamera(camera)
    {
        this.camera = camera;
    }

    setClearColor(color)
    {
        this.clearColor = color;
    }

    createFullscreenQuad()
    {
        var vertices = {data: [-1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0], size: 2};
        var textureCoordinates = [0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0];
        this.fullscreenQuad = new Mesh(vertices, [0, 1, 2, 0, 2, 3], null, textureCoordinates);
    }

    clear()
    {
        this.gl.clearColor(this.clearColor[0], this.clearColor[1], this.clearColor[2], this.clearColor[3]);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);
    }

    preRender()
    {
        var view = mat4.lookAt(this.camera.position, this.camera.lookAt, this.camera.up);
        var viewProjection = mat4.identity();
        mat4.multiply(this.projection, view, viewProjection);

        for(var key in this.shaders)
            this.shaders[key].setVPMatrix(viewProjection);

        this.clear();
    }

    postRender(timer)
    {
        this.canvas2D.clear();
        this.canvas2D.drawFPS(timer.FPS());
    }

    renderToFrameBuffer(app, renderMethod, frameBuffer)
    {
        frameBuffer.bind();
        this.clear();
        renderMethod.call(app);
    }

    renderFullscreenQuad(texture, shader)
    {
        this.fullscreenQuad.clearTextures();
        if (texture instanceof FrameBuffer)
        {
            this.fullscreenQuad.addTexture("textureOne", texture.getTexture());
        }
        else if(texture instanceof Texture)
            this.fullscreenQuad.addTexture("textureOne", texture);
        else
        {
            var quad = this.fullscreenQuad;
            Object.keys(texture).forEach(function (key)
            {
                if (texture[key] instanceof FrameBuffer)
                    quad.addTexture(key, texture[key].getTexture());
                else
                    quad.addTexture(key, texture[key]);
            });
        }

        this.fullscreenQuad.shader = shader;
        this.fullscreenQuad.render();
    }

    get size()
    {
        return {x: this.width, y: this.height};
    }
    
    dispose()
    {
        
    }
}