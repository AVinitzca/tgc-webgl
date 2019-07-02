attribute vec4 vertexPosition;
attribute vec2 textureCoordinates;

varying vec2 propagatedTextureCoordinates;

void main()
{
    propagatedTextureCoordinates = textureCoordinates;
    gl_Position = vertexPosition;
}