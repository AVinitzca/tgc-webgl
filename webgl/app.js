function App(){}

var planeBody;
var planeMesh;
var sphereBody;
var cubeBody;
var cube, cubeScale;
var sceneBuffer, horizontalBlurBuffer, verticalBlurBuffer;

App.prototype.initialize = function()
{
    this.meshes['tgcito'].addTexture("textureOne", this.textures['tgcito']);
    this.meshes['tgcito'].setShader(this.shaders['normal']);
    this.meshes['tgcito'].transform = Matrix4.scaling(new Vector3(3.0));

    this.meshes['ball'].addTexture("textureOne", this.textures['lava']);
    this.meshes['ball'].setShader(this.shaders['normal']);

    this.meshes['cylinder'] = new Cylinder(5, 1, 2, 30);

    this.meshes['cylinder'].addTexture("textureOne", this.textures['lava']);
    this.meshes['cylinder'].setShader(this.shaders['normal']);

    this.camera = {position: new Vector3(500.0), lookAt: Vector3.Zero(), up: new Vector3(0.0, 1.0, 0.0)};

    Renderer.setCamera(this.camera);

    var radius = this.meshes['ball'].getRadius();

    planeBody = new AmmoStaticPlane(new Vector3(0.0, 1.0, 0.0), 0.0, 0.0, Matrix4.identity());
    planeBody.setFriction(0.52);
    this.physicsWorld.addRigidBody(planeBody);

    planeMesh = new Plane();
    planeMesh.setShader(this.shaders['normal']);
    planeMesh.addTexture('textureOne', this.textures['lava']);

    sphereBody = new AmmoSphere(radius, 20.0, Matrix4.translation(new Vector3(1.0, 600.0, 0.0)));
    sphereBody.setDamping(0.1, 0.9);
    sphereBody.setRestitution(0.3);
    sphereBody.setFriction(0.2);
    sphereBody.setLinearFactor(new Ammo.btVector3(1.0, 1.0, 1.0));
    this.physicsWorld.addRigidBody(sphereBody);

    cube = new Box();
    cubeScale = new Vector3(100.0);
    cube.addTexture("textureOne", this.textures['lava']);
    cube.setShader(this.shaders['normal']);

    cubeBody = new AmmoBox(cubeScale, 20.0, Matrix4.translation(new Vector3(1.0, 100.0, 0.0)));
    this.physicsWorld.addRigidBody(cubeBody);

}

var t = 0.0;

App.prototype.update = function(elapsedTime)
{
    if(this.input.keyDown('b'))
    {
        sphereBody.setActivationState(1);
        sphereBody.applyTorqueImpulse(new Ammo.btVector3(0.0, 0.0, 100.0));
    }
    if(this.input.keyDown('c'))
    {
        sphereBody.setActivationState(1);
        sphereBody.applyCentralImpulse(new Ammo.btVector3(0.0, 0.0, -100.0));
    }
    if(this.input.keyDown('d'))
    {
        sphereBody.setActivationState(1);
        sphereBody.applyImpulse(new Ammo.btVector3(0.0, 0.0, 500.0), new Ammo.btVector3(5.0, 0.0, 0.0));
    }

    this.meshes['ball'].transform = AmmoUtils.getPositionRotationMatrix(sphereBody);

    planeMesh.transform = Matrix4.scaling(new Vector3(500.0, 1.0, 500.0)).multiply(AmmoUtils.getPositionRotationMatrix(planeBody));

    this.meshes['cylinder'].transform = Matrix4.multiply(Matrix4.rotationX(t), Matrix4.scaling(new Vector3(100.0, 100.0, 100.0)));

    cube.transform = AmmoUtils.getPositionRotationMatrix(cubeBody).multiply(Matrix4.scaling(cubeScale));

    t+= 1.5 * elapsedTime;

    //var size = Renderer.getSize();
    //this.shaders['blur'].setVector2('screenSize', [size.x, size.y]);
}

App.prototype.render = function()
{
    /*this.renderer.renderToFrameBuffer(this, this.renderScene, sceneBuffer);
    this.renderer.renderToFrameBuffer(this, this.renderSceneQuadHorizontal, horizontalBlurBuffer);
    this.renderer.renderToFrameBuffer(this, this.renderSceneQuadVertical, verticalBlurBuffer);

    FrameBuffer.unbind(this.renderer.gl);
    this.renderer.renderFullscreenQuad({textureOne: horizontalBlurBuffer, textureTwo: verticalBlurBuffer}, this.shaders['blend']);*/
    this.renderScene();
}

App.prototype.renderScene = function()
{
    //this.meshes['cylinder'].render();
    //planeMesh.render();
    cube.render();
    this.meshes['ball'].render();
    //boxMesh.render();
    //this.meshes['tgcito'].render();
}
/*
App.prototype.renderSceneQuadHorizontal = function()
{
    this.shaders['blur'].setFloat('horizontal', 1.0);
    this.renderer.renderFullscreenQuad(sceneBuffer, this.shaders['blur']);
}

App.prototype.renderSceneQuadVertical = function()
{
    this.shaders['blur'].setFloat('horizontal', 0.0);
    this.renderer.renderFullscreenQuad(sceneBuffer, this.shaders['blur']);
}

*/
App.prototype.dispose = function()
{

}


