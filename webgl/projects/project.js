function Project(config)
{
    this.name = config.name;
    this.path = config.path;
    this.usesPhysics = config.use_ammo;
    this.assets = config.assets;

    this.parseAssets();
}

Project.prototype.parseAssets = function()
{
    if(this.assets.meshes != undefined)
        this.assets.meshes.forEach(asset => this.parseAssetPath(asset));
    if(this.assets.shaders != undefined)
        this.assets.shaders.forEach(asset => this.parseAssetPath(asset));
    if(this.assets.textures != undefined)
        this.assets.textures.forEach(asset => this.parseAssetPath(asset));
    if(this.assets.sounds != undefined)
        this.assets.sounds.forEach(asset => this.parseAssetPath(asset));
}

Project.prototype.load = function()
{
    delete App;

    this.setSourceLoader();
    this.setAssetsLoader();
    this.setPhysicsLoader();

    let startProject = new ResourceLoader([], function(loader){loader.advance();});
    this.physicsLoader.derivesIn(startProject);
    this.assetLoader.derivesIn(startProject);
    this.sourceLoader.derivesIn(startProject);
    startProject.setCallback(this, this.startProject);

    this.assetLoader.start();
    this.sourceLoader.start();
    this.physicsLoader.start();
}

Project.prototype.startProject = function()
{
    core.startProject();

    core.app.meshes = this.meshLoader.meshes;
    core.app.shaders = this.shaderLoader.shaders;
    core.app.textures = this.textureLoader.textures;
    core.app.sounds = this.soundLoader.sounds;

    Renderer.shaders = this.shaderLoader.shaders;

    core.setWithoutPhysics();

    core.app.initialize();
    core.currentLoop = core.mainLoop;
    core.loop(0.0);
}

Project.prototype.setPhysicsLoader = function()
{
    if(!core.alreadyLoadedPhysics)
    {
        this.physicsPreLoader = new SourceCodeLoader(new Set(['webgl/ammo/ammo.js']));
        this.physicsLoader = new SourceCodeLoader(new Set(
        [
            'webgl/ammo/ammostaticplane.js',
            'webgl/ammo/ammoutils.js',
            'webgl/ammo/ammosphere.js',
            'webgl/ammo/ammobox.js'
        ]));
        this.physicsPreLoader.derivesIn(this.physicsLoader);
    }
    else
    {
        this.physicsPreLoader = new ResourceLoader([]);
        this.physicsLoader = new ResourceLoader([]);
    }
}

Project.prototype.setAssetsLoader = function()
{
    this.meshLoader = new MeshLoader(this.assets.meshes);
    this.shaderLoader = new ShaderLoader(this.assets.shaders);
    this.textureLoader = new TextureLoader(this.assets.textures);
    this.soundLoader = new SoundLoader(this.assets.sounds);

    this.assetLoader = new ResourceLoaderCollection([this.meshLoader, this.shaderLoader, this.textureLoader, this.soundLoader]);


    /*this.assetLoader = new AssetLoader(this.assets);
    this.assetLoader.set

    Projects.assetLoader = new AssetLoader(function()
    {
        core.startProject();
        let assets = Projects.assetLoader.getAssets();
        core.app.meshes = assets.meshes;
        core.app.shaders = assets.shaders;
        core.app.textures = assets.textures;
        core.app.sounds = assets.sounds;
        Renderer.shaders = assets.shaders;
        core.app.initialize();
        core.currentLoop = core.mainLoop;
        core.loop(0.0);
    }, Projects.sourceLoader);*/
}


Project.prototype.setSourceLoader = function()
{
    let imports = new Set([this.path + "/app.js"]);
    this.sourceLoader = new SourceCodeLoader(imports);
}

Project.prototype.import = function(source)
{
    this.sourceLoader.load(this.path + "/" + source);
}

Project.prototype.parseAssetPath = function(asset)
{
    if (asset.path != undefined)
        asset.path = this.path + "/" + asset.path;
    else
    {
        if (asset.vertex)
            asset.vertex = this.path + "/" + asset.vertex;
        if (asset.fragment)
            asset.fragment = this.path + "/" + asset.fragment;
    }
}