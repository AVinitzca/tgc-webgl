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
        this.amountOfCubes = 50;
        this.physicsWorld.setGravity((new Vector3(0.0, -1.0, 0.0)).toAmmoVector());

        // Render objects set up
        this.box = new Cube();
        this.box.addTexture("textureOne", this.textures['lava']);

        this.plane = new Plane();
        this.plane.addTexture("textureOne", this.textures['concrete']);
        this.plane.transform = Matrix4.scaling(new Vector3(2000.0, 0.0, 2000.0));

        // Physics set up
        this.floorPlaneBody = new AmmoStaticPlane(Vector3.up, 0.0, Matrix4.identity());
        this.physicsWorld.addRigidBody(this.floorPlaneBody);
        
        this.boxBodies = [];
        for(let index = 0; index < this.amountOfCubes; index++)
        {
            let boxBody = new AmmoCube(new Vector3(10.0), 100.0, Matrix4.translation(new Vector3(Math.randomRange(0.0, 100.0), Math.randomRange(5.0, 300.0), Math.randomRange(0.0, 100.0))));
            this.physicsWorld.addRigidBody(boxBody);
            this.boxBodies.push(boxBody);
        }

        this.angle = 0.0;

        this.camera = {position: new Vector3(200.0), lookAt: Vector3.zero, up: new Vector3(0.0, 1.0, 0.0)};

        Core.renderer.setCamera(this.camera);
    }

    update(elapsedTime)
    {
        this.camera.position = new Vector3(Math.cos(this.angle) * 200.0, 200.0, Math.sin(this.angle) * 200.0);
        if(this.input.keyPressed('j'))
        {
            let boxBody = new AmmoCube(new Vector3(10.0), 100.0, Matrix4.translation(this.camera.position));
            let direction = this.camera.position.normalized();            
            this.physicsWorld.addRigidBody(boxBody);            
            boxBody.applyCentralImpulse(direction.scaled(10.0).toAmmoVector());            
            boxBody.activate(true);
            this.boxBodies.push(boxBody);
        }        
        this.angle += elapsedTime;
    }

    render()
    {
        for(let index = 0; index < this.boxBodies.length; index++)
        {
            this.box.transform = AmmoUtils.getPositionRotationMatrix(this.boxBodies[index]).scale(new Vector3(10.0));
            this.box.render();
        }
        this.plane.render();
    }

    dispose()
    {
        this.box.dispose();
        this.plane.dispose();
    }
};
