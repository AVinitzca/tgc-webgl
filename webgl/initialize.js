let core = null, resourceLoader = null;

function ResourceLoader(resources, each)
{
    if(resources instanceof Set)
        this.resources = resources;
    else
        this.resources = new Set(resources);

    this.remaining = this.resources.size;
    this.callback = {};
    this.iterator = each;
    this.started = false;
    this.needsToStart = 0;
}

ResourceLoader.prototype.load = function(element)
{
    if(!this.resources.has(element))
    {
        this.remaining++;
        this.resources.add(element);
        if(this.started)
        {
            let loader = this;
            const promise = new Promise((resolve, reject) =>
            {
                loader.iterator(loader, element, resolve, reject);
            });
        }
    }
}

ResourceLoader.prototype.loadMany = function(element)
{
    element.forEach(e => this.load(e));
}

ResourceLoader.prototype.start = function()
{
    if(this.needsToStart > 0)
        this.needsToStart--;

    if(this.needsToStart == 0)
    {
        let loader = this;
        this.started = true;
        if (this.resources.size > 0)
            this.resources.forEach(function (resource) {
                const promise = new Promise((resolve, reject) => {
                    loader.iterator(loader, resource, resolve, reject);
                });
            });
        else
            this.end();
    }
}

ResourceLoader.prototype.advance = function()
{
    this.remaining--;
    if(this.remaining == 0)
        this.end();
}

ResourceLoader.prototype.setCallback = function(object, callback)
{
    this.callback = {object: object, method: callback};
}

ResourceLoader.prototype.end = function()
{
    this.callback.method.call(this.callback.object);
}

ResourceLoader.prototype.derivesIn = function(resourceLoader)
{
    this.setCallback(resourceLoader, resourceLoader.start);
    resourceLoader.needsToStart++;
}

function ResourceLoaderCollection(resources)
{
    ResourceLoader.call(this, resources, function(loader, resource){resource.start();});
    let loader = this;
    this.resources.forEach(resource => resource.setCallback(loader, loader.advance));
}

ResourceLoaderCollection.prototype = new ResourceLoader();

ResourceLoaderCollection.prototype.load = function(element)
{
    element.setCallback(this, this.advance);
    ResourceLoader.prototype.load.call(this, element);
}

function SourceCodeLoader(resources)
{
    var injectScript = function(loader, source, resolve, reject)
    {
        const script = document.createElement('script');
        document.body.appendChild(script);
        script.onload = function(){loader.advance();};
        script.onerror = reject;
        script.async = true;
        script.src = source;
    };
    return new ResourceLoader(resources, injectScript);
}

function sourceLoaded()
{
    core = new Core();
    Projects.initialize();

    let loadProject = new ResourceLoader([], function(loader) {loader.advance();});
    loadProject.setCallback(Projects, Projects.loadDefault);

    core.defaultContentLoader().derivesIn(loadProject);
    Projects.scanner.derivesIn(loadProject);

    Projects.find();
    core.loadDefaultContent();
}

window.onload = function()
{
    let coreResources = new Set(['webgl/core.js', 'webgl/projects/projects.js']);
    
    resourceLoader = new SourceCodeLoader(coreResources);
    resourceLoader.setCallback(this, sourceLoaded);
    resourceLoader.start();
};


window.onbeforeunload = function(e)
{
    if(core != undefined)
        core.destroy();
}
