class Project
{
    constructor(config)
    {
        this.name = config.name;
        this.path = config.path;
        this.usesPhysics = config.use_ammo;
        this.assets = config.assets;

        this.parseAssets();
    }

    parseAssets()
    {
        if(this.assets.meshes !== undefined)
            this.assets.meshes.forEach(asset => this.parseAssetPath(asset));
        if(this.assets.shaders !== undefined)
            this.assets.shaders.forEach(asset => this.parseAssetPath(asset));
        if(this.assets.textures !== undefined)
            this.assets.textures.forEach(asset => this.parseAssetPath(asset));
        if(this.assets.sounds !== undefined)
            this.assets.sounds.forEach(asset => this.parseAssetPath(asset));
    }

    load()
    {
        this.setSourceLoader();
        this.setAssetsLoader();
        this.setPhysicsLoader();

        let startProject = new ResourceLoader([1], function(loader){loader.advance();});
        this.physicsHandlersLoader.derivesIn(startProject);
        this.assetLoader.derivesIn(startProject);
        this.sourceLoader.derivesIn(startProject);
        startProject.setCallback(this, this.startProject);

        this.assetLoader.start();
        this.sourceLoader.start();
        this.physicsLoader.start();
    }

    startProject()
    {
        let newApp = new App();
        newApp.usesPhysics = this.usesPhysics;
        this.setAppAssets(newApp);

        Core.queueAppSwitch(newApp);
    }

    setAppAssets(app)
    {
        app.meshes = this.meshLoader.meshes;
        app.shaders = this.shaderLoader.shaders;
        app.textures = this.textureLoader.textures;
        app.sounds = this.soundLoader.sounds;

        Core.renderer.shaders = Object.assign(Core.renderer.shaders, this.shaderLoader.shaders);
    }

    setPhysicsLoader()
    {
        if(this.usesPhysics && !Projects.alreadyLoadedPhysics)
        {
            this.physicsLoader = new AmmoSourceCodeLoader(new Set(['webgl/ammo/ammo.js']));
            this.physicsHandlersLoader = new SourceCodeLoader(new Set(
                [
                    'webgl/ammo/ammostaticplane.js',
                    'webgl/ammo/ammoutils.js',
                    'webgl/ammo/ammosphere.js',
                    'webgl/ammo/ammobox.js'
                ]));
            this.physicsLoader.derivesIn(this.physicsHandlersLoader);
            Projects.alreadyLoadedPhysics = true;
        }
        else
        {
            this.physicsPreLoader = new ResourceLoader([]);
            this.physicsLoader = new ResourceLoader([]);
        }
    }

    setAssetsLoader()
    {
        this.meshLoader = new MeshLoader(this.assets.meshes);
        this.shaderLoader = new ShaderLoader(this.assets.shaders);
        this.textureLoader = new TextureLoader(this.assets.textures);
        this.soundLoader = new SoundLoader(this.assets.sounds);

        this.assetLoader = new ResourceLoaderCollection([this.meshLoader, this.shaderLoader, this.textureLoader, this.soundLoader]);
    }


    setSourceLoader()
    {
        let imports = new Set([this.path + "/app.js"]);
        this.sourceLoader = new SourceCodeLoader(imports);
    }

    import(source)
    {
        this.sourceLoader.load(this.path + "/" + source);
    }

    parseAssetPath(asset)
    {
        if (asset.path !== undefined)
            asset.path = this.path + "/" + asset.path;
        else
        {
            if (asset.vertex)
                asset.vertex = this.path + "/" + asset.vertex;
            if (asset.fragment)
                asset.fragment = this.path + "/" + asset.fragment;
        }
    }
}