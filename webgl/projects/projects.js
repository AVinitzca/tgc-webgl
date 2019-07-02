resourceLoader.load('webgl/projects/project.js');

function Projects(){}

Projects.initialize = function()
{
    Projects.elements = [];

    Projects.finder = new ResourceLoader(['./projects.json'], (loader, source, resolve, reject) =>
    {
        fetch(source).then(projects => projects.json()).then(projects =>
        {
            Projects.default = projects.default;
            Projects.projectNames = projects.projects;
            loader.advance();
        });
    });
    let pathRegExp = /^(\.\/)?([^\/]+.+)\/app.json$/gm;
    Projects.scanner = new ResourceLoader([], (loader, source, resolve, reject) =>
    {
        fetch(source).then(project => project.json()).then(project =>
        {
            project.name = source.replace(pathRegExp, "$2");
            project.path = './' + project.name;
            Projects.add(project);
            loader.advance();
        });
    });

    Projects.finder.setCallback(Projects, Projects.findProjectFolders);
}

Projects.find = function()
{
    Projects.finder.start();
}

Projects.findProjectFolders = function()
{
    Projects.scanner.loadMany(Projects.projectNames.map(projectName => './' + projectName + '/app.json'));
    Projects.scanner.start();
}







Projects.add = function(projectConfiguration)
{
    Projects.elements.push(new Project(projectConfiguration));
}

Projects.list = function()
{
    Projects.elements.forEach(element => console.log(element.name));
}

Projects.withName = function(name)
{
    return Projects.elements.filter(element => element.name == name)[0];
}

Projects.import = function(source)
{
    Projects.active.import(source);
}

Projects.load = function(projectName)
{
    Projects.active = Projects.withName(projectName);
    Projects.active.load();
}

Projects.loadDefault = function()
{
    Renderer.shaders = Object.assign(Renderer.shaders, Renderer.defaultShaderLoader.shaders);
    Renderer.defaultShader = Renderer.defaultShaderLoader.shaders['default'];
    if(Projects.default != undefined)
        Projects.load(Projects.default);
    else
        console.log("You may load your projects now");
}
