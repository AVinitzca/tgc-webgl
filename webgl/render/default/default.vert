attribute vec4 vertexPosition;
attribute vec3 vertexNormal;
attribute vec2 textureCoordinates;

uniform mat4 mvp;
uniform mat4 vp;
uniform mat4 m;
uniform float time;

varying vec2 propagatedTextureCoordinates;
varying vec3 normal;
varying vec4 color;

void main()
{
    normal = vertexNormal.xyz;
    propagatedTextureCoordinates = textureCoordinates;
    gl_Position = mvp * vertexPosition;
}