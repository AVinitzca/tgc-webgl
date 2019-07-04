function ShadedCube()
{
    var vertices = {
        data:
            [
                -1.000000, -1.000000, 1.000000,
                1.000000, -1.000000, 1.000000,
                -1.000000, 1.000000, 1.000000,
                1.000000, 1.000000, 1.000000,
                -1.000000, 1.000000, -1.000000,
                1.000000, 1.000000, -1.000000,
                -1.000000, -1.000000, -1.000000,
                1.000000, -1.000000, -1.000000
            ], size: 3};


    var textureCoordinates =
        [
            0.000000, 0.000000,
            1.000000, 0.000000,
            0.000000, 1.000000,
            1.000000, 1.000000,
            1.000000, 1.000000,
            0.000000, 1.000000,
            1.000000, 0.000000,
            0.000000, 0.000000,
        ];
    var normals =
        [
            (new Vector3(-1.000000, -1.000000, 1.000000)).normalized(),
            (new Vector3(1.000000, -1.000000, 1.000000)).normalized(),
            (new Vector3(-1.000000, 1.000000, 1.000000)).normalized(),
            (new Vector3(1.000000, 1.000000, 1.000000)).normalized(),
            (new Vector3(-1.000000, 1.000000, -1.000000)).normalized(),
            (new Vector3(1.000000, 1.000000, -1.000000)).normalized(),
            (new Vector3(-1.000000, -1.000000, -1.000000)).normalized(),
            (new Vector3(1.000000, -1.000000, -1.00000)).normalized()
        ];

    normals = Array.flatten(normals);

    var indices =
        [
            7, 1, 0,
            0, 6, 7,

            6, 0, 2,
            2, 4, 6,

            4, 2, 3,
            3, 5, 4,

            5, 3, 1,
            1, 7, 5,

            3, 2, 0,
            0, 1, 3,

            7, 6, 4,
            4, 5, 7
        ];
    Mesh.call(this, vertices, indices, normals, textureCoordinates);
}

ShadedCube.prototype = Object.create(Mesh.prototype);
ShadedCube.prototype.constructor = ShadedCube;
