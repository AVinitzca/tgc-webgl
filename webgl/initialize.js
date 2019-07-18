let resourceLoader = null;

class ResourceLoader
{
    constructor(resources, iterator)
    {
        if(resources instanceof Set)
            this.resources = resources;
        else
            this.resources = new Set(resources);

        this.remaining = this.resources.size;
        this.callback = {};
        this.iterator = iterator;
        this.started = false;
        this.needsToStart = 0;
    }

    load(element)
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

    loadMany(element)
    {
        element.forEach(e => this.load(e));
    }

    start()
    {
        if(this.needsToStart > 0)
            this.needsToStart--;

        if(this.needsToStart === 0)
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

    advance()
    {
        this.remaining--;
        if(this.remaining === 0)
            this.end();
    }

    setCallback(object, callback)
    {
        this.callback = {object: object, method: callback};
    }

    end()
    {
        this.callback.method.call(this.callback.object);
    }

    derivesIn(resourceLoader)
    {
        this.setCallback(resourceLoader, resourceLoader.start);
        resourceLoader.needsToStart++;
    }
}

class ResourceLoaderCollection extends ResourceLoader
{
    constructor(resources)
    {
        super(resources, function(loader, resource){resource.start();});
        let loader = this;
        this.resources.forEach(resource => resource.setCallback(loader, loader.advance));
    }

    load(element)
    {
        element.setCallback(this, this.advance);
        super.load(element);
    }
}

class SourceCodeLoader extends ResourceLoader
{
    constructor(resources)
    {
        super(resources, function(loader, source, resolve, reject)
        {
            const script = document.createElement('script');
            document.body.appendChild(script);
            script.onload = function(){loader.advance();};
            script.onerror = reject;
            script.async = true;
            script.src = source;
        });
    }
}

class AmmoSourceCodeLoader extends ResourceLoader
{
    constructor(resources)
    {
        super(resources, function(loader, source, resolve, reject)
        {
            const script = document.createElement('script');
            document.body.appendChild(script);
            script.onload = function(){Ammo().then(function()
                {
                    loader.advance();
                });};
            script.onerror = reject;
            script.async = true;
            script.src = source;
        });
    }
}

window.sourceLoaded = function()
{
    Core.initialize();
    Projects.initialize();

    let loadProject = new ResourceLoader([], function(loader) {loader.advance();});
    loadProject.setCallback(Projects, Projects.loadDefault);

    Core.defaultContentLoader.derivesIn(loadProject);
    Projects.scanner.derivesIn(loadProject);

    Projects.find();
    Core.loadDefaultContent();
}

window.onload = function()
{
    let coreResources = new Set(['webgl/core.js', 'webgl/projects/projects.js']);
    
    resourceLoader = new SourceCodeLoader(coreResources);
    resourceLoader.setCallback(window, window.sourceLoaded);
    resourceLoader.start();
};


window.onbeforeunload = function()
{
    if(Core !== undefined)
        Core.dispose();
};
