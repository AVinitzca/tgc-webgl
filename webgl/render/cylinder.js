class Cylinder extends Mesh
{
    constructor(heightInVertices, topRadius, bottomRadius, partitions)
    {
        var vertices = [];
        var indices = [];
        var normals = [];
        var uvs = [];

        var twoPI = Math.PI * 2.0;

        var angleStep = twoPI / partitions;

        var halfHeight = heightInVertices / 2.0;

        var normalHeight = Math.cos(Math.PI / 4.0);

        // Body vertices
        for(var height = halfHeight; height >= -halfHeight; height--)
        {
            var scaleY = (height + halfHeight) / heightInVertices;
            var radius = Math.lerp(topRadius, bottomRadius, scaleY);
            var currentHeight = (height == halfHeight) ? normalHeight : ((height == -halfHeight) ? -normalHeight : 0.0);
            for(var index = 0.0; index < twoPI; index += angleStep)
            {
                var cosi = Math.cos(index) * radius;
                var sini = Math.sin(index) * radius;
                vertices.push(new Vector3(cosi, height, sini));
                var normal = new Vector3(cosi, currentHeight, sini);
                normal.normalize();
                normals.push(normal);
                uvs.push([index / twoPI, scaleY]);
            }
        }

        // Body triangles
        var currentLoop = 0, lastLoop = 0, partitionsMinusOne = partitions - 1;
        for(var index = 1; index <= heightInVertices; index++)
        {
            currentLoop = index * partitions;
            lastLoop = (index - 1) * partitions;
            for(var angle = 1; angle < partitions; angle++)
            {
                // Not the last one
                indices.push([currentLoop + angle, currentLoop + angle - 1, lastLoop + angle]);
                indices.push([lastLoop + angle - 1, lastLoop + angle,  currentLoop + angle - 1]);
            }
            indices.push([currentLoop + partitionsMinusOne, currentLoop, lastLoop + partitionsMinusOne]);
            indices.push([lastLoop + partitionsMinusOne, lastLoop, currentLoop]);
        }

        // Top axis vertex
        vertices.push(new Vector3(0.0, halfHeight, 0.0));
        normals.push(Vector3.Up());
        uvs.push([0.5, 0.5]);

        // Bottom axis vertex
        vertices.push(new Vector3(0.0, -halfHeight, 0.0));
        normals.push(Vector3.Down());
        uvs.push([0.5, 0.5]);

        // Top triangles
        var topVertex = vertices.length - 2;
        for(var angle = 0; angle < (partitions - 1); angle++)
        {
            indices.push([angle, angle + 1, topVertex]);
        }
        indices.push([0, partitions - 1, topVertex]);

        // Bottom triangles
        var bottomVertex = vertices.length - 1;
        for(var angle = vertices.length - 2 - partitions; angle < (vertices.length - 3); angle++)
        {
            indices.push([angle, angle + 1, bottomVertex]);
        }
        indices.push([vertices.length - 2 - partitions, vertices.length - 3, bottomVertex]);

        super(Array.flatten(vertices), Array.flatten(indices), Array.flatten(normals), Array.flatten(uvs));
    }
}
