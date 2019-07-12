precision lowp float;

varying vec2 propagatedTextureCoordinates;

uniform sampler2D textureOne;
uniform vec2 pixelSize;

uniform float kernel[13];

void main(void)
{
    vec3 sum = vec3(0.0);

    float x = -6.0;
    for(int index = 0; index < 13; index++)
    {
        sum += (texture2D(textureOne, propagatedTextureCoordinates + vec2(pixelSize.x * x, 0.0)).rgb * kernel[index]);
        x += 10.0;
    }

    gl_FragColor = vec4(sum, 1.0);

}