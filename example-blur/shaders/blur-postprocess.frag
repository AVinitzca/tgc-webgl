precision lowp float;

varying vec2 propagatedTextureCoordinates;

uniform sampler2D textureOne;
uniform vec2 pixelSize;

uniform float kernel[13];

void main(void)
{
    vec3 sum = vec3(0.0);
    float y = -6.0;
    // Vertical convolution
    for(int index = 0; index < 13; index++)
    {
        sum += texture2D(textureOne, propagatedTextureCoordinates + vec2(0.0, pixelSize.y * y)).rgb * kernel[index];
        y += 1.0;
    }

    gl_FragColor = vec4(sum, 1.0);
}