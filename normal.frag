precision highp  float;

varying vec3 normal;
varying vec2 propagatedTextureCoordinates;
varying vec4 color;

uniform sampler2D textureOne;

void main()
{
    // gl_FragColor is a special variable a fragment shader
    // is responsible for setting
    //

    if(color == vec4(0.0))
        gl_FragColor = texture2D(textureOne, propagatedTextureCoordinates);
    else
        gl_FragColor = color;


    //gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);

    //gl_FragColor = vec4(normal, 1.0);
}