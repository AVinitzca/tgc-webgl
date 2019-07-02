function loadTexture(name, path, after)
{
	_textures[name] = new Texture(path, after);
}

function Texture(path, after)
{
	if(path instanceof Object)
		this.createFromSize(Renderer.gl, path);
	else
	{
		this.gl = Renderer.gl;
		this.id = this.gl.createTexture();
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
		this.fillWithBluePixel();
		this.after = after;

		this.loadImageAsync(path);
	}
}

Texture.prototype.createFromSize = function(gl, size)
{
	this.gl = gl;
	this.width = size.x;
	this.height = size.y;
	this.id = this.gl.createTexture();

	this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT );
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT );
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

	this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, size.x, size.y, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
}

Texture.prototype.loadImageAsync = function(path)
{
	this.image = new Image();
	this.image.src = path;
	var texture = this;

	this.image.addEventListener('load', function()
	{
		texture.generateTexture();
		texture.after();
	});
}

Texture.prototype.getWidth = function()
{
	return this.width;
}

Texture.prototype.getHeight = function()
{
	return this.height;
}

Texture.prototype.fillWithBluePixel = function()
{
	this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
}

Texture.prototype.generateTexture = function()
{
	this.width = this.image.width;
	this.height = this.image.height;
	this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
	this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
	this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.image);
	//gl.generateMipmap(gl.TEXTURE_2D);
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.MIRRORED_REPEAT);
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
}

Texture.prototype.getId = function()
{
	return this.id;
}

Texture.prototype.dispose = function()
{
	this.gl.deleteTexture(this.id);
}