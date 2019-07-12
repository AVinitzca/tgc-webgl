resourceLoader.load('webgl/render/mesh.js');

class Plane extends Mesh
{
    constructor()
    {
        let vertices = {data: [-1.0, 0.0, 1.0, -1.0, 0.0, -1.0, 1.0, 0.0, -1.0, 1.0, 0.0, 1.0], size: 3};
        let textureCoordinates = [0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0];
        let normals = [0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0];
        let indices = [0, 2, 1, 0, 3, 2];

        super(vertices, indices, normals, textureCoordinates);
    }
}
