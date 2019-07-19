resourceLoader.load('webgl/timer.js');
resourceLoader.load('webgl/input/input.js');
resourceLoader.load('webgl/audio/audio.js');
resourceLoader.load('webgl/asset-loader.js');
resourceLoader.load('webgl/render/renderer.js');

class Core
{
    static initialize()
    {
        Core.prepareWebPage();
        Core.renderer = new Renderer();
        Core.audioManager = new AudioManager();
        Core.input = new Input();
        Core.loopMethod = Core.loop;
        Core.timer = new Timer();
        Core.looping = false;
    }

    static get defaultContentLoader()
    {
        return Core.renderer.defaultShaderLoader;
    }

    static loadDefaultContent()
    {
        Core.renderer.contentLoader.start();
    }

    static prepareWebPage()
    {
        document.getElementsByTagName('body')[0].setAttribute('style', 'border: none; margin: 0');
        document.getElementById('main-canvas').setAttribute('style', 'border: none; margin: 0');
    }

    static loop(elapsedTime)
    {
        Core.currentPreUpdate(elapsedTime);
        Core.app.update(Core.timer.elapsedTime());
        Core.postUpdate(elapsedTime);

        Core.renderer.preRender();
        Core.app.render();
        Core.renderer.postRender(Core.timer);

        Core.timer.reset();

        requestAnimationFrame(Core.loopMethod);
    }

    static setWithPhysics()
    {
        Core.currentPreUpdate = Core.preUpdateWithPhysics;
        Core.loadPhysics();
    }

    static setWithoutPhysics()
    {
        Core.currentPreUpdate = Core.preUpdate;
    }

    static terminatePhysics()
    {
        if(Core.physicsWorker !== undefined)
            Core.physicsWorker.terminate();
    }

    static preUpdate(elapsedTime)
    {
        Core.timer.start(elapsedTime);
        Core.app.time.start(elapsedTime);
    }

    static preUpdateWithPhysics(elapsedTime)
    {
        Core.app.physicsWorld.stepSimulation(elapsedTime, 60);
        Core.preUpdate(elapsedTime);
    }

    static postUpdate()
    {
        Core.input.update();
    }

    static queueAppSwitch(newApp)
    {
        Core.nextApp = newApp;
        if(Core.looping)
            Core.loopMethod = Core.appSwitch;
        else
        {
            Core.looping = true;
            Core.appSwitch();
        }
    }

    static appSwitch()
    {
        Core.disposeApp();

        Core.app = Core.nextApp;
        if(Core.app.usesPhysics)
            Core.setWithPhysics();
        else
            Core.setWithoutPhysics();
        Core.app.time = new Timer();
        Core.app.input = Core.input;
        Core.app.initialize();
        Core.loopMethod = Core.loop;
        Core.nextApp = null;

        Core.loop(0.0);
    }

    static loadPhysics()
    {
        let collisionConfiguration  = new Ammo.btDefaultCollisionConfiguration(),
            dispatcher              = new Ammo.btCollisionDispatcher(collisionConfiguration),
            overlappingPairCache    = new Ammo.btDbvtBroadphase(),
            solver                  = new Ammo.btSequentialImpulseConstraintSolver();
        Core.app.physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
        Core.app.physicsWorld.setGravity((new Vector3(0.0, -10.0, 0.0)).toAmmoVector());
    }

    static disposeApp()
    {
        if(Core.app)
        {
            if(Core.app.physicsWorld)
                Core.app.physicsWorld.__destroy__();
            Core.app.dispose();
        }
        Core.app = null;
    }

    static dispose()
    {
        Core.disposeApp();
        Core.audioManager.dispose();
        Core.renderer.dispose();
    }



}
