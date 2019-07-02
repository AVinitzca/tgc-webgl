function Matrix4(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p)
{
    return new Float32Array([a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p]);
}

Matrix4.__identityPrototype = new Matrix4
(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
);

Matrix4.copy = function(other)
{
    return new Float32Array(other);
}

Matrix4.identity = function()
{
    return Matrix4.copy(Matrix4.__identityPrototype);
}

Matrix4.translation = function(vector)
{
    var identity = Matrix4.identity();
    identity[12] = vector[0];
    identity[13] = vector[1];
    identity[14] = vector[2];
    return identity;
}

Matrix4.scaling = function(vector)
{
    var identity = Matrix4.identity();
    identity[0] = vector[0];
    identity[5] = vector[1];
    identity[10] = vector[2];
    return identity;
}

Matrix4.rotationX = function(angle)
{
    var identity = Matrix4.identity();
    var sinA = Math.sin(angle);
    identity[5] = identity[10] = Math.cos(angle);
    identity[6] = sinA;
    identity[9] = -sinA;
    return identity;
}

Matrix4.rotationY = function(angle)
{
    var sinA = Math.sin(angle);
    var identity = Matrix4.identity();
    identity[0] = identity[10] = Math.cos(angle);
    identity[2] = -sinA;
    identity[8] = sinA;
    return identity;
}

Matrix4.rotationZ = function(angle)
{
    var sinA = Math.sin(angle);
    var identity = Matrix4.identity();
    identity[0] = identity[5] = Math.cos(angle);
    identity[1] = sinA;
    identity[4] = -sinA;
    return identity;
}

Matrix4.rotation = function(angle, axis)
{
    var rotation = Matrix4.identity();
    mat4.rotate(rotation, angle, axis, rotation);
    return rotation;
}

Matrix4.multiply = function(matOne, matTwo)
{
    var destination = Matrix4.identity();
    mat4.multiply(matOne, matTwo, destination);
    return destination;
}

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

