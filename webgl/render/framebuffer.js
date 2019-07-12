resourceLoader.load('webgl/render/texture.js');

class FrameBuffer
{
    constructor(size, depth = false)
    {
        this.gl = Core.renderer.gl;
        this.buffer = this.gl.createFramebuffer();
        this.bind();
        this.texture = new Texture(this.gl, size);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.getTextureId(), 0);

        if(depth)
        {
            const depthBuffer = this.gl.createRenderbuffer();
            this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, depthBuffer);

            this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, size.x, size.y);
            this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, depthBuffer);
        }

        FrameBuffer.unbind();
    }

    bind()
    {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.buffer);
    }

    static unbind()
    {
        Core.renderer.gl.bindFramebuffer(Core.renderer.gl.FRAMEBUFFER, null);
    }

    getTextureId()
    {
        return this.texture.id;
    }

    getTexture()
    {
        return this.texture;
    }
}

