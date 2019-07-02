function App(){}

App.prototype.initialize = function()
{
    this.cubeColor = new Box();
    this.cubeColor.addTexture("textureOne", this.textures['lava']);

    this.camera = {position: new Vector3(500.0), lookAt: Vector3.Zero(), up: new Vector3(0.0, 1.0, 0.0)};
    Renderer.setCamera(this.camera);
}

App.prototype.update = function(elapsedTime)
{

}

App.prototype.render = function()
{
    //this.cubeColor.render();
}

App.prototype.dispose = function()
{
    this.cubeColor.dispose();
}


