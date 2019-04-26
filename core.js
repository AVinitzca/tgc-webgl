var gl = null, context2D = null, timer, camera;

var _resources = [];

window.onload = function()
{
    _resources.push("app.js");
    prepareWebpage();
    intializeBidimensionalCanvas();
    initializeGL();
    new ResourceLoader(_resources, function(){loadMedia(initializeApplication);});
    windowCloseEvent();
};

function prepareWebpage()
{
    document.getElementsByTagName('body')[0].setAttribute('style', 'border: none; margin: 0');
    document.getElementById('main-canvas').setAttribute('style', 'border: none; margin: 0');
    document.getElementById('text').setAttribute('style', 'border: none; position: absolute; top: 0px; left: 0px; margin: 0');
    document.getElementById('text').setAttribute('width', 1000);
    document.getElementById('text').setAttribute('height', 1000);
}



function loadResources(after)
{
    _resources.forEach(function(resource)
    {

    });
}



function initializeGL()
{
    canvas = document.getElementById("main-canvas");

    canvas.width = document.body.clientWidth; //document.width is obsolete
    canvas.height = document.body.clientHeight;
    try
    {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
        gl.enable(gl.DEPTH_TEST);
    }
    catch (e)
    {
        console.log(e);
    }
    if (!gl)
    {
        alert("Could not initialize WebGL. See the console for more info.");
    }
}

function intializeBidimensionalCanvas()
{
    canvas2D = document.getElementById("text");
    canvas2D.width = document.body.clientWidth;
    canvas2D.height = document.body.clientHeight;
    context2D = canvas2D.getContext('2d');
    context2D.fillStyle = "#FFFF00";
    context2D.font = "14px Arial";
}


function initializeApplication()
{
    initialize();
    timer = new Timer();
    fullTimer = new Timer();

    loop(0.0);
}


function loop(elapsed)
{
    timer.start(elapsed);

    update(timer.elapsedTime());
    postUpdate();

    preRender();
    render();
    postRender(timer.FPS());

    timer.reset();
    requestAnimationFrame(loop);
}

function postUpdate()
{
    var p = mat4.perspective(90.0, gl.viewportWidth / gl.viewportHeight, .1, 1000.0);
    var v = mat4.lookAt(camera.position, camera.lookAt, camera.up);
    var vp = mat4.multiply(p, v);

    for(var key in shaders)
        shaders[key].setVPMatrix(vp);
}

function preRender()
{
    gl.clearColor(0.39215686274, 0.58431372549, 0.9294117647, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function postRender(fps)
{
    context2D.clearRect(0, 0, canvas2D.width, canvas2D.height);
    context2D.textAlign = "start";
    context2D.fillText( fps + "FPS", canvas2D.width - 70, 20);

    // Draw lines on 2D??

}

function windowCloseEvent()
{
    window.onbeforeunload = function(e)
    {
       // dispose();
    }
}


ResourceLoader.prototype.decrease = function()
{
    this.remaining--;
    if(this.remaining == 0)
        this.after();
}

function ResourceLoader(resources, after)
{
    this.remaining = resources.length;
    this.after = after;

    for (var index = 0; index < resources.length; index++)
    {
        const scriptPromise = new Promise((resolve, reject) =>
        {
            const script = document.createElement('script');
            document.body.appendChild(script);
            script.onload = resolve;
            script.onerror = reject;
            script.async = true;
            script.src = resources[index];
        });
        scriptPromise.then(() => {this.decrease()});
    }
}
