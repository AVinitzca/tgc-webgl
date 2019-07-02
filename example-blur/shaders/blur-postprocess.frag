precision lowp float;

varying vec2 propagatedTextureCoordinates;

uniform sampler2D textureOne;
uniform sampler2D textureTwo;
uniform vec2 screenSize;

void main(void)
{
    vec2 delta = vec2(1.0, 1.0) / screenSize;

    vec3 sum = vec3(0.0);
    for(float y = -3.0; y <= 3.0; y++)
        sum += texture2D(textureOne, propagatedTextureCoordinates + vec2(0.0, delta.y * y)).rgb;

    gl_FragColor = vec4(sum.rgb / 7.0, 1.0) * 0.5 + texture2D(textureTwo, propagatedTextureCoordinates) * 0.5;
}