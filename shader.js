
function getShader(source, type)
{
	var shader;
	if (type == "fragment")
	{
		shader = gl.createShader( (type == "fragment") ? gl.FRAGMENT_SHADER : gl.VERTEX_SHADER);
	} 
	else
	{
		shader = gl.createShader(gl.VERTEX_SHADER);
	} 

	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) 
	{
		alert(gl.getShaderInfoLog(shader));	
		return null;
	}

	return shader;
}


function createProgram(vertex, fragment)
{	
	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertex);
	gl.attachShader(shaderProgram, fragment);
	gl.linkProgram(shaderProgram);
	
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) 
	{
		alert("Could not initialise shaders");
	}
	return shaderProgram;
}

function loadShader(name, vertexPath, fragmentPath, after)
{
	readShader(name, vertexPath, 'vertex', after);
	readShader(name, fragmentPath, 'fragment', after);
}

function compileShader(name, after)
{
	if(vertexSources[name] != null && fragmentSources[name] != null)
	{
		var shader = new Shader(vertexSources[name], fragmentSources[name]);
		_shaders[name] = shader;
		delete vertexSources[name];
		delete fragmentSources[name];
		after();
	}
}

function readShader(name, path, type, after)
{
	fetch(path).then(function(element)
	{
		return element.text()
	}).then(function(element)
	{
		if(type == 'vertex')
			vertexSources[name] = element;
		else
			fragmentSources[name] = element;
		compileShader(name, after);
	});
}






var shaders = {};
var vertexSources = {};
var fragmentSources = {};

function Shader(vertexSource, fragmentSource)
{
	this.texturesAdded = 0;
	var vertexShader = getShader(vertexSource, 'vertex');
	var fragmentShader = getShader(fragmentSource, 'fragment');
	this.program = createProgram(vertexShader, fragmentShader);
	gl.useProgram(this.program);
	this.linkAttributes();
	this.linkMatrices();
}

Shader.prototype.linkAttributes = function()
{
	this.vertexPositionAttribute = gl.getAttribLocation(this.program, "vertexPosition");
	gl.enableVertexAttribArray(this.vertexPositionAttribute);

	this.vertexNormalAttribute = gl.getAttribLocation(this.program, "vertexNormal");
	gl.enableVertexAttribArray(this.vertexNormalAttribute);

	this.textureCoordAttribute = gl.getAttribLocation(this.program, "textureCoordinates");
	gl.enableVertexAttribArray(this.textureCoordAttribute);
}

Shader.prototype.linkMatrices = function()
{
	this.mvpUniform = gl.getUniformLocation(this.program, "mvp");
	this.vpUniform = gl.getUniformLocation(this.program, "vp");
	this.mUniform = gl.getUniformLocation(this.program, "m");
}

Shader.prototype.use = function()
{
	this.texturesAdded = 0;
	gl.useProgram(this.program);
}

Shader.prototype.setVPMatrix = function(vp)
{
	this.vp = vp;
}

Shader.prototype.setMeshData = function(mesh)
{
	gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
	gl.vertexAttribPointer(this.vertexPositionAttribute, mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
	gl.vertexAttribPointer(this.vertexNormalAttribute, mesh.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, mesh.textureBuffer);
	gl.vertexAttribPointer(this.textureCoordAttribute, mesh.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);

	var mvp = mat4.identity();
	mat4.multiply(this.vp, mesh.transform, mvp);

	gl.uniformMatrix4fv(this.mvpUniform, false, mvp);
	gl.uniformMatrix4fv(this.vpUniform, false, this.vp);
	gl.uniformMatrix4fv(this.mUniform, false, mesh.transform);
}


Shader.prototype.setFloat = function(name, value)
{
	var location = gl.getUniformLocation(this.program, name);
	gl.uniform1f(location, value);
}

Shader.prototype.setTexture = function(texture, textureNameInShader)
{
	var textureLocation = gl.getUniformLocation(this.program, textureNameInShader);
	gl.uniform1i(textureLocation, 0); 
	gl.activeTexture(gl.TEXTURE0 + this.texturesAdded);
	gl.bindTexture(gl.TEXTURE_2D, texture.getId());
	this.texturesAdded++;
}

Shader.prototype.dispose = function()
{
	gl.deleteShader(this.program);
}
