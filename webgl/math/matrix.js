class Matrix4
{
    constructor(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p)
    {
        return new Float32Array([a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p]);
    }

    static multiply(matOne, matTwo)
    {
        var destination = Matrix4.identity();
        mat4.multiply(matOne, matTwo, destination);
        return destination;
    }

    static copy(other)
    {
        return new Float32Array(other);
    }

    static identity()
    {
        return Matrix4.copy(Matrix4.__identityPrototype);
    }

    static translation(vector)
    {
        var identity = Matrix4.identity();
        identity[12] = vector[0];
        identity[13] = vector[1];
        identity[14] = vector[2];
        return identity;
    }

    static scaling(vector)
    {
        var identity = Matrix4.identity();
        identity[0] = vector[0];
        identity[5] = vector[1];
        identity[10] = vector[2];
        return identity;
    }

    static rotationX(angle)
    {
        var identity = Matrix4.identity();
        var sinA = Math.sin(angle);
        identity[5] = identity[10] = Math.cos(angle);
        identity[6] = sinA;
        identity[9] = -sinA;
        return identity;
    }

    static rotationY(angle)
    {
        var sinA = Math.sin(angle);
        var identity = Matrix4.identity();
        identity[0] = identity[10] = Math.cos(angle);
        identity[2] = -sinA;
        identity[8] = sinA;
        return identity;
    }

    static rotationZ(angle)
    {
        var sinA = Math.sin(angle);
        var identity = Matrix4.identity();
        identity[0] = identity[5] = Math.cos(angle);
        identity[1] = sinA;
        identity[4] = -sinA;
        return identity;
    }

    static rotation(angle, axis)
    {
        var rotation = Matrix4.identity();
        mat4.rotate(rotation, angle, axis, rotation);
        return rotation;
    }
}

Matrix4.__identityPrototype = new Matrix4
(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
);


Float32Array.prototype.copy = function()
{
    return Matrix4.copy(this);
}

Float32Array.prototype.translate = function(vector)
{
    let copied = this.copy();
    copied[12] += vector[0];
    copied[13] += vector[1];
    copied[14] += vector[2];
    return copied;
}

Float32Array.prototype.scale = function(vector)
{
    let copied = this.copy();
    copied[0] *= vector[0];
    copied[5] *= vector[1];
    copied[10] *= vector[2];
    return copied;
}

Float32Array.prototype.multiply = function(other)
{
    return Matrix4.multiply(this, other);
}

