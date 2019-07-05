

class Texture
{
	constructor(path, after)
	{
		if(path instanceof Object)
			this.createFromSize(Core.renderer.gl, path);
		else
		{
			this.gl = Core.renderer.gl;
			this.id = this.gl.createTexture();
			this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
			this.fillWithBluePixel();
			this.after = after;

			this.loadImageAsync(path);
		}
	}

	createFromSize(gl, size)
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

	loadImageAsync(path)
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

	fillWithBluePixel()
	{
		this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
	}

	generateTexture()
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

	getId()
	{
		return this.id;
	}

	dispose()
	{
		this.gl.deleteTexture(this.id);
	}
}