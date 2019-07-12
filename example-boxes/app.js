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
        this.box = new Cube();
        this.box.addTexture("textureOne", this.textures['lava']);

        this.boxScaling = Matrix4.scaling(new Vector3(100.0));
        this.angle = 0.0;
        this.box.transform = this.boxScaling;
        this.camera = {position: new Vector3(400.0), lookAt: Vector3.zero, up: new Vector3(0.0, 1.0, 0.0)};

        Core.renderer.setCamera(this.camera);
    }

    update(elapsedTime)
    {
        this.box.transform = Matrix4.translation(new Vector3(30.0)).rotateY(this.angle).scale(new Vector3(100.0));
        this.angle += 2.0 * elapsedTime;
    }

    render()
    {
        this.box.render();
    }

    dispose()
    {
        this.box.dispose();
    }
};
