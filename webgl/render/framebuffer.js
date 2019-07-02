resourceLoader.load('webgl/render/texture.js');


function FrameBuffer(size, depth = false)
{
    this.gl = Renderer.gl;
    this.buffer = this.gl.createFramebuffer();
    this.bind();
    this.texture = new Texture(this.gl, size);
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.getTextureId(), 0);

    if(depth)
    {
        const depthBuffer = this.gl.createRenderbuffer();
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, depthBuffer);

        this.gl.renderbufferStorage(this.gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, size.x, size.y);
        this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, depthBuffer);
    }

    FrameBuffer.unbind(this.gl);
}


FrameBuffer.prototype.bind = function()
{
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.buffer);
}

FrameBuffer.unbind = function()
{
    Renderer.gl.bindFramebuffer(Renderer.gl.FRAMEBUFFER, null);
}

FrameBuffer.prototype.getTexture = function()
{
    return this.texture;
}

FrameBuffer.prototype.getTextureId = function()
{
    return this.texture.id;
}