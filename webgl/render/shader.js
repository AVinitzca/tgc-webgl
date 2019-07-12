
class Shader
{
	constructor(vertexSource, fragmentSource)
	{
		this.texturesAdded = 0;
		this.gl = Core.renderer.gl;

		var vertexShader = this.compile(vertexSource, 'vertex');
		var fragmentShader = this.compile(fragmentSource, 'fragment');
		this.program = this.createProgram(vertexShader, fragmentShader);
		this.gl.useProgram(this.program);
		this.linkAttributes();
		this.linkMatrices();
	}

	compile(source, type)
	{
		var shader = this.gl.createShader( (type === "fragment") ? this.gl.FRAGMENT_SHADER : this.gl.VERTEX_SHADER);

		this.gl.shaderSource(shader, source);
		this.gl.compileShader(shader);

		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS))
		{
			alert(this.gl.getShaderInfoLog(shader));
			return null;
		}

		return shader;
	}


	createProgram(vertexShader, fragmentShader)
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

	linkAttributes()
	{
		this.vertexPositionAttribute = this.gl.getAttribLocation(this.program, "vertexPosition");
		if(this.vertexPositionAttribute !== -1)
			this.gl.enableVertexAttribArray(this.vertexPositionAttribute);

		this.vertexNormalAttribute = this.gl.getAttribLocation(this.program, "vertexNormal");
		if(this.vertexNormalAttribute !== -1)
			this.gl.enableVertexAttribArray(this.vertexNormalAttribute);

		this.textureCoordAttribute = this.gl.getAttribLocation(this.program, "textureCoordinates");
		if(this.textureCoordAttribute !== -1)
			this.gl.enableVertexAttribArray(this.textureCoordAttribute);
	}

	linkMatrices()
	{
		this.mvpUniform = this.gl.getUniformLocation(this.program, "mvp");
		this.vpUniform = this.gl.getUniformLocation(this.program, "vp");
		this.mUniform = this.gl.getUniformLocation(this.program, "m");
	}

	use()
	{
		this.texturesAdded = 0;
		this.gl.useProgram(this.program);
	}

	setVPMatrix(vp)
	{
		this.vp = vp;
	}

	setMeshData(mesh)
	{
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.vertexBuffer);
		this.gl.vertexAttribPointer(this.vertexPositionAttribute, mesh.vertexBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

		if(this.vertexNormalAttribute !== -1)
			if(mesh.normalBuffer !== undefined)
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

	setMatrices(vp, transform)
	{
		if(this.mvpUniform !== -1)
		{
			var mvp = mat4.identity();
			mat4.multiply(vp, transform, mvp);
			this.gl.uniformMatrix4fv(this.mvpUniform, false, mvp);
		}

		if(this.vpUniform !== -1)
			this.gl.uniformMatrix4fv(this.vpUniform, false, vp);
		if(this.mUniform !== -1)
			this.gl.uniformMatrix4fv(this.mUniform, false, transform);
	}

	setFloat(name, value)
	{
		this.gl.useProgram(this.program);
		var location = this.gl.getUniformLocation(this.program, name);
		this.gl.uniform1f(location, value);
	}

	setVector2(name, vector)
	{
		this.gl.useProgram(this.program);
		var location = this.gl.getUniformLocation(this.program, name);
		this.gl.uniform2fv(location, vector);
	}

	setTexture(texture, textureNameInShader)
	{
		var textureLocation = this.gl.getUniformLocation(this.program, textureNameInShader);
		this.gl.uniform1i(textureLocation, 0);
		this.gl.activeTexture(this.gl.TEXTURE0 + this.texturesAdded);
		this.gl.bindTexture(this.gl.TEXTURE_2D, texture.getId());
		this.texturesAdded++;
	}

	dispose()
	{
		this.gl.deleteShader(this.program);
	}
}