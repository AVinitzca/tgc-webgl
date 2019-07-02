function App(){}

App.prototype.initialize = function()
{
    this.box = new Box();
    this.box.addTexture("textureOne", this.textures['lava']);
    this.box.setShader(this.shaders['brolge']);

    this.boxScaling = Matrix4.scaling(new Vector3(100.0, 100.0, 100.0));
    this.angle = 0.0;

    this.camera = {position: new Vector3(300.0), lookAt: Vector3.Zero(), up: new Vector3(0.0, 1.0, 0.0)};
    Renderer.setCamera(this.camera);
}

App.prototype.update = function(elapsedTime)
{
    this.box.transform = Matrix4.multiply(Matrix4.rotationY(this.angle), this.boxScaling);
    this.angle += 2.0 * elapsedTime;
}

App.prototype.render = function()
{
    this.box.render();
}

App.prototype.dispose = function()
{
    this.box.dispose();
}


