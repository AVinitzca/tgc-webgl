resourceLoader.load('webgl/timer.js');
resourceLoader.load('webgl/input/input.js');
resourceLoader.load('webgl/audio/audio.js');
resourceLoader.load('webgl/asset-loader.js');
resourceLoader.load('webgl/render/renderer.js');

function Core()
{
    Renderer.initialize();
    this.prepareWebpage();
    AudioManager.initialize();
    this.input = new Input();
    this.mainLoop = function(time){core.loop(time);}
    this.currentLoop = this.mainLoop;
    this.timer = new Timer();
}

Core.prototype.defaultContentLoader = function()
{
    return Renderer.defaultShaderLoader;
}

Core.prototype.loadDefaultContent = function()
{
    Renderer.defaultShaderLoader.start();
}

Core.prototype.prepareWebpage = function()
{
    document.getElementsByTagName('body')[0].setAttribute('style', 'border: none; margin: 0');
    document.getElementById('main-canvas').setAttribute('style', 'border: none; margin: 0');
}

Core.prototype.loop = function(elapsedTime)
{
    this.currentPreUpdate(elapsedTime);
    this.app.update(this.timer.elapsedTime());
    this.postUpdate(elapsedTime);

    Renderer.preRender();
    this.app.render();
    Renderer.postRender(this.timer);

    this.timer.reset();

    this.checkAppSwitch();

    requestAnimationFrame(this.currentLoop);
}

Core.prototype.checkAppSwitch = function()
{
    if(this.nextApp != undefined)
    {
        this.stopLoop();
        this.disposeApp();
        this.initializeApp(this.nextApp);
    }
}

Core.prototype.setWithPhysics = function()
{
    this.currentPreUpdate = this.preUpdateWithPhysics;
    this.loadPhysics();
}

Core.prototype.setWithoutPhysics = function()
{
    this.currentPreUpdate = this.preUpdate;
}

Core.prototype.preUpdate = function(elapsedTime)
{
    this.timer.start(elapsedTime);
    this.app.time.start(elapsedTime);
}

Core.prototype.preUpdateWithPhysics = function(elapsedTime)
{
    this.app.physicsWorld.stepSimulation(elapsedTime, 60);
    this.preUpdate(elapsedTime);
}

Core.prototype.postUpdate = function()
{
    this.input.update();
}

Core.prototype.stopLoop = function()
{
    this.currentLoop = function(time){};
}

Core.prototype.switchToApp = function(appConfig)
{
    if(this.updating == undefined)
    {
        this.initializeApp(appConfig);
        this.updating = true;
    }
    else
        this.nextApp = appConfig;
}

Core.prototype.startProject = function()
{
    this.app = new App();
    this.app.time = new Timer();
    this.app.input = this.input;
}

Core.prototype.loadPhysics = function(Ammo)
{
    let collisionConfiguration  = new Ammo.btDefaultCollisionConfiguration(),
        dispatcher              = new Ammo.btCollisionDispatcher(collisionConfiguration),
        overlappingPairCache    = new Ammo.btDbvtBroadphase(),
        solver                  = new Ammo.btSequentialImpulseConstraintSolver();
    this.app.physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
    this.app.physicsWorld.setGravity(new Ammo.btVector3( 0, -10.0, 0 ));
}

Core.prototype.disposeApp = function()
{
    if(this.app)
    {
        if(this.app.physicsWorld)
            this.app.physicsWorld.__destroy__();
        this.app.dispose();
    }
    delete App;
    this.app = null;
}

Core.prototype.destroy = function()
{
    this.disposeApp();
    AudioManager.dispose();
}

