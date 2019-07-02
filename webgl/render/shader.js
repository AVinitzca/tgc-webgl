function Shader(vertexSource, fragmentSource)
{
	this.texturesAdded = 0;
	this.gl = Renderer.gl;

	var vertexShader = this.compile(vertexSource, 'vertex');
	var fragmentShader = this.compile(fragmentSource, 'fragment');
	this.program = this.createProgram(vertexShader, fragmentShader);
	this.gl.useProgram(this.program);
	this.linkAttributes();
	this.linkMatrices();
}

Shader.prototype.compile = function(source, type)
{
	var shader = this.gl.createShader( (type == "fragment") ? this.gl.FRAGMENT_SHADER : this.gl.VERTEX_SHADER);

	this.gl.shaderSource(shader, source);
	this.gl.compileShader(shader);

	if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS))
	{
		alert(this.gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}


Shader.prototype.createProgram = function(vertexShader, fragmentShader)
{
	var shaderProgram = this.gl.createProgram();
	this.gl.attachShader(shaderProgram, vertexShader);
	this.gl.attachShader(shaderProgram, fragmentShader);
	this.gl.linkProgram(shaderProgram);

	if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS))
	{
		alert("Could not initialise shaders");
	}
	return shaderProgram;
}

Shader.prototype.linkAttributes = function()
{
	this.vertexPositionAttribute = this.gl.getAttribLocation(this.program, "vertexPosition");
	if(this.vertexPositionAttribute != -1)
		this.gl.enableVertexAttribArray(this.vertexPositionAttribute);

	this.vertexNormalAttribute = this.gl.getAttribLocation(this.program, "vertexNormal");
	if(this.vertexNormalAttribute != -1)
		this.gl.enableVertexAttribArray(this.vertexNormalAttribute);

	this.textureCoordAttribute = this.gl.getAttribLocation(this.program, "textureCoordinates");
	if(this.textureCoordAttribute != -1)
		this.gl.enableVertexAttribArray(this.textureCoordAttribute);
}

Shader.prototype.linkMatrices = function()
{
	this.mvpUniform = this.gl.getUniformLocation(this.program, "mvp");
	this.vpUniform = this.gl.getUniformLocation(this.program, "vp");
	this.mUniform = this.gl.getUniformLocation(this.program, "m");
}

Shader.prototype.use = function()
{
	this.texturesAdded = 0;
	this.gl.useProgram(this.program);
}

Shader.prototype.setVPMatrix = function(vp)
{
	this.vp = vp;
}

Shader.prototype.setMeshData = function(mesh)
{
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.vertexBuffer);
	this.gl.vertexAttribPointer(this.vertexPositionAttribute, mesh.vertexBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

	if(mesh.normalBuffer)
	{
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.normalBuffer);
		this.gl.vertexAttribPointer(this.vertexNormalAttribute, mesh.normalBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
	}
	else
		this.gl.disableVertexAttribArray(this.vertexNormalAttribute);

	if(mesh.textureBuffer)
	{
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.textureBuffer);
		this.gl.vertexAttribPointer(this.textureCoordAttribute, mesh.textureBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
	}

	this.setMatrices(this.vp, mesh.transform);
}

Shader.prototype.setMatrices = function(vp, transform)
{
	if(this.mvpUniform != -1)
	{
		var mvp = mat4.identity();
		mat4.multiply(vp, transform, mvp);
		this.gl.uniformMatrix4fv(this.mvpUniform, false, mvp);
	}

	if(this.vpUniform != -1)
		this.gl.uniformMatrix4fv(this.vpUniform, false, vp);
	if(this.mUniform != -1)
		this.gl.uniformMatrix4fv(this.mUniform, false, transform);
}

Shader.prototype.setFloat = function(name, value)
{
	this.gl.useProgram(this.program);
	var location = this.gl.getUniformLocation(this.program, name);
	this.gl.uniform1f(location, value);
}

Shader.prototype.setVector2 = function(name, vector)
{
	this.gl.useProgram(this.program);
	var location = this.gl.getUniformLocation(this.program, name);
	this.gl.uniform2fv(location, vector);
}

Shader.prototype.setTexture = function(texture, textureNameInShader)
{
	var textureLocation = this.gl.getUniformLocation(this.program, textureNameInShader);
	this.gl.uniform1i(textureLocation, 0);
	this.gl.activeTexture(this.gl.TEXTURE0 + this.texturesAdded);
	this.gl.bindTexture(this.gl.TEXTURE_2D, texture.getId());
	this.texturesAdded++;
}

Shader.prototype.dispose = function()
{
	this.gl.deleteShader(this.program);
}
