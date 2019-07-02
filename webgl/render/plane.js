resourceLoader.load('webgl/render/mesh.js');

function Plane()
{
    var vertices = {data: [-1.0, 0.0, 1.0, -1.0, 0.0, -1.0, 1.0, 0.0, -1.0, 1.0, 0.0, 1.0], size: 3};
    var textureCoordinates = [0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0];
    var normals = [0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0];
    var indices = [0, 1, 2, 0, 2, 3];

    Mesh.call(this, vertices, indices, normals, textureCoordinates);
}

Plane.prototype = Object.create(Mesh.prototype);
Plane.prototype.constructor = Plane;