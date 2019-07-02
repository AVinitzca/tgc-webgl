precision lowp float;

varying vec3 normal;
varying vec2 propagatedTextureCoordinates;
varying vec4 color;

uniform sampler2D textureOne;

void main()
{
    gl_FragColor = color == vec4(0.0) ? vec4(texture2D(textureOne, propagatedTextureCoordinates).rgb, 1.0) : color;
}