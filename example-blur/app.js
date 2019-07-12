Projects.import('/free-camera.js');

App = class
{
    constructor()
    {
        this.meshes = {};
        this.textures = {};
        this.shaders = {};
        this.sounds = {};
    }

    initialize()
    {
        this.meshes['tgcito'].addTexture("textureOne", this.textures['tgcito']);
        this.meshes['tgcito'].transform = Matrix4.translation(new Vector3(100.0, 0.0, 0.0));

        this.setUpPlanes();
        this.setShaderUniforms();

        this.horizontalBlurBuffer = new FrameBuffer(Core.renderer.size, true);
        this.blurBuffer = new FrameBuffer(Core.renderer.size);

        this.camera = new BlurFreeCamera(new Vector3(1.0), new Vector3(1.0, 0.0, 0.0));
        Core.renderer.setCamera(this.camera);
    }

    update(elapsedTime)
    {
        this.camera.update(this.input, elapsedTime);
    }

    render()
    {
        Core.renderer.renderToFrameBuffer(this, this.renderScene, this.horizontalBlurBuffer);
        Core.renderer.renderToFrameBuffer(this, this.renderHorizontal, this.blurBuffer);
        FrameBuffer.unbind();
        Core.renderer.renderFullscreenQuad(this.blurBuffer, this.shaders['blur-postprocess']);
    }


    dispose()
    {
        this.meshes['tgcito'].dispose();
        this.floor.dispose();
    }

    renderScene()
    {
        this.meshes['tgcito'].render();
        this.floor.render();
        this.leftWall.render();
        this.rightWall.render();
        this.frontWall.render();
        this.backWall.render();
    }

    renderHorizontal()
    {
        Core.renderer.renderFullscreenQuad(this.horizontalBlurBuffer, this.shaders['blur-postprocess-horizontal']);
    }

    setUpPlanes()
    {
        this.floor = new Plane();
        this.floor.addTexture("textureOne", this.textures['concrete']);
        this.floor.transform = Matrix4.translation(new Vector3(0.0, -250.0, 0.0)).scale(new Vector3(250.0, 0.0, 250.0));

        this.leftWall = new Plane();
        this.leftWall.addTexture("textureOne", this.textures['bricks']);
        this.leftWall.transform = Matrix4.translation(new Vector3(0.0, 0.0, -250.0)).rotateX(Math.halfPI).scale(new Vector3(250.0, 0.0, 250.0));

        this.rightWall = new Plane();
        this.rightWall.addTexture("textureOne", this.textures['bricks']);
        this.rightWall.transform = Matrix4.translation(new Vector3(0.0, 0.0, 250.0)).rotateX(-Math.halfPI).scale(new Vector3(250.0, 0.0, 250.0));

        this.frontWall = new Plane();
        this.frontWall.addTexture("textureOne", this.textures['bricks']);
        this.frontWall.transform = Matrix4.translation(new Vector3(250.0, 0.0, 0.0))
            .rotateX(-Math.halfPI)
            .rotateZ(Math.halfPI)
            .scale(new Vector3(250.0, 0.0, 250.0));

        this.backWall = new Plane();
        this.backWall.addTexture("textureOne", this.textures['bricks']);
        this.backWall.transform = Matrix4.translation(new Vector3(-250.0, 0.0, 0.0))
            .rotateX(Math.halfPI)
            .rotateZ(-Math.halfPI)
            .scale(new Vector3(250.0, 0.0, 250.0));
    }

    setShaderUniforms()
    {
        this.shaders['blur-postprocess-horizontal'].setVector2('pixelSize', Core.renderer.size.inverted());
        this.shaders['blur-postprocess-horizontal'].setFloat("kernel[0]", 0.002216);
        this.shaders['blur-postprocess-horizontal'].setFloat("kernel[1]", 0.008764);
        this.shaders['blur-postprocess-horizontal'].setFloat("kernel[2]", 0.026995);
        this.shaders['blur-postprocess-horizontal'].setFloat("kernel[3]", 0.064759);
        this.shaders['blur-postprocess-horizontal'].setFloat("kernel[4]", 0.120985);
        this.shaders['blur-postprocess-horizontal'].setFloat("kernel[5]", 0.176033);
        this.shaders['blur-postprocess-horizontal'].setFloat("kernel[6]", 0.199471);
        this.shaders['blur-postprocess-horizontal'].setFloat("kernel[7]", 0.176033);
        this.shaders['blur-postprocess-horizontal'].setFloat("kernel[8]", 0.120985);
        this.shaders['blur-postprocess-horizontal'].setFloat("kernel[9]", 0.064759);
        this.shaders['blur-postprocess-horizontal'].setFloat("kernel[10]", 0.026995);
        this.shaders['blur-postprocess-horizontal'].setFloat("kernel[11]", 0.008764);
        this.shaders['blur-postprocess-horizontal'].setFloat("kernel[12]", 0.002216);

        this.shaders['blur-postprocess'].setVector2('pixelSize', Core.renderer.size.inverted());
        this.shaders['blur-postprocess'].setFloat("kernel[0]", 0.002216);
        this.shaders['blur-postprocess'].setFloat("kernel[1]", 0.008764);
        this.shaders['blur-postprocess'].setFloat("kernel[2]", 0.026995);
        this.shaders['blur-postprocess'].setFloat("kernel[3]", 0.064759);
        this.shaders['blur-postprocess'].setFloat("kernel[4]", 0.120985);
        this.shaders['blur-postprocess'].setFloat("kernel[5]", 0.176033);
        this.shaders['blur-postprocess'].setFloat("kernel[6]", 0.199471);
        this.shaders['blur-postprocess'].setFloat("kernel[7]", 0.176033);
        this.shaders['blur-postprocess'].setFloat("kernel[8]", 0.120985);
        this.shaders['blur-postprocess'].setFloat("kernel[9]", 0.064759);
        this.shaders['blur-postprocess'].setFloat("kernel[10]", 0.026995);
        this.shaders['blur-postprocess'].setFloat("kernel[11]", 0.008764);
        this.shaders['blur-postprocess'].setFloat("kernel[12]", 0.002216);
    }

};
