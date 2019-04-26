function loadTexture(name, path, after)
{
	_textures[name] = new Texture(path, after);
}


function Texture(path, after)
{
	this.id = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, this.id);
	 
	var image = new Image();
	image.src = path;
	var externalID = this.id;
	fillWithBluePixel();

	image.addEventListener('load', function() 
	{
		generateTexture(externalID, image);
		after();
	});
}


function fillWithBluePixel()
{
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));	
}

function generateTexture(id, image)
{
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.bindTexture(gl.TEXTURE_2D, id);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	//gl.generateMipmap(gl.TEXTURE_2D);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
}

Texture.prototype.getId = function()
{
	return this.id;
}

Texture.prototype.dispose = function()
{
	gl.deleteTexture(this.id);
}