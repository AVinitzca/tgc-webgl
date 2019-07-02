precision lowp float;

varying vec2 propagatedTextureCoordinates;

uniform sampler2D textureOne;
uniform vec2 screenSize;

void main(void)
{
    vec2 delta = vec2(1.0, 1.0) / screenSize;

    vec3 sum = vec3(0.0);
    for(float x = -3.0; x <= 3.0; x++)
        sum += texture2D(textureOne, propagatedTextureCoordinates + vec2(delta.x * x, 0.0)).rgb;


    gl_FragColor = vec4(sum.rgb / 7.0, 1.0);
}