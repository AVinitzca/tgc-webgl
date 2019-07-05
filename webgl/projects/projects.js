resourceLoader.load('webgl/projects/project.js');

class Projects
{
    static initialize()
    {
        Projects.elements = [];

        Projects.finder = new ResourceLoader(['./projects.json'], (loader, source) =>
        {
            fetch(source).then(projects => projects.json()).then(projects =>
            {
                Projects.default = projects.default;
                Projects.projectNames = projects.projects;
                loader.advance();
            });
        });
        let pathRegExp = /^(\.\/)?([^\/]+.+)\/app.json$/gm;
        Projects.scanner = new ResourceLoader([], (loader, source) =>
        {
            fetch(source).then(project => project.json()).then(project =>
            {
                project.name = source.replace(pathRegExp, "$2");
                project.path = './' + project.name;
                Projects.add(project);
                loader.advance();
            });
        });

        Projects.alreadyLoadedPhysics = false;
        Projects.finder.setCallback(Projects, Projects.findProjectFolders);
    }

    static find()
    {
        Projects.finder.start();
    }

    static findProjectFolders()
    {
        Projects.scanner.loadMany(Projects.projectNames.map(projectName => './' + projectName + '/app.json'));
        Projects.scanner.start();
    }







    static add(projectConfiguration)
    {
        Projects.elements.push(new Project(projectConfiguration));
    }

    static list()
    {
        Projects.elements.forEach(element => console.log(element.name));
    }

    static withName(name)
    {
        return Projects.elements.filter(element => element.name == name)[0];
    }

    static import(source)
    {
        Projects.active.import(source);
    }

    static load(projectName)
    {
        let found = Projects.withName(projectName);
        if(found != undefined)
        {
            Projects.active = found;
            Projects.active.load();
        }
        else
            console.error("TGC Error: Project not found");
    }

    static loadDefault()
    {
        // Should not be here :/
        Core.renderer.shaders = Object.assign(Core.renderer.shaders, Core.renderer.defaultShaderLoader.shaders);
        Core.renderer.defaultShader = Core.renderer.defaultShaderLoader.shaders['default'];
        if(Projects.default != undefined)
            Projects.load(Projects.default);
        else
            console.log("You may load your projects now");
    }
}