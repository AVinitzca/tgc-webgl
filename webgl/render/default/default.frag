precision lowp float;

varying vec3 normal;
varying vec2 propagatedTextureCoordinates;
varying vec4 color;

uniform sampler2D textureOne;

void main()
{
    gl_FragColor = texture2D(textureOne, propagatedTextureCoordinates);
}