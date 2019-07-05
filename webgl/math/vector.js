
class Vector3
{
    constructor(x = 0.0, y = null, z = null)
    {
        if(y == null)
            return new Float32Array([x, x, x]);

        if(z == null)
            return new Float32Array([x, y, 0.0]);

        return new Float32Array([x, y, z]);
    }

    static get zero() // out of ten
    {
        return new Float32Array([0.0, 0.0, 0.0]);
    }

    static get up() // if you can
    {
        return new Float32Array([0.0, 1.0, 0.0]);
    }

    static get down() // and move it all around
    {
        return new Float32Array([0.0, -1.0, 0.0]);
    }

    static fromArray(array)
    {
        return new Float32Array(array);
    }

    static fromAmmoVector(vector)
    {
        return new Float32Array([vector.x(), vector.y(), vector.z()]);
    }
}

class Vector2
{
    constructor(x = 0.0, y = null)
    {
        if(y == null)
            return new Float32Array([x, x]);

        return new Float32Array([x, y]);
    }

    static get up() // and fight
    {
        return new Float32Array([0.0, 1.0]);
    }

    static get down() // on it
    {
        return new Float32Array([0.0, -1.0]);
    }

    static fromArray(array)
    {
        return new Float32Array(array);
    }
}


Float32Array.prototype.clone = function()
{
    return new Float32Array(this);
}

Float32Array.prototype.toReadableString = function()
{
    return "{" + this.reduce((a, b) => a + ', ' + b) + "}";
}

Float32Array.prototype.add = function(vector)
{
    for(var index = 0; index < this.length; index++)
        this[index] += vector[index];
}

Float32Array.prototype.x = function()
{
    return this[0];
}

Float32Array.prototype.y = function()
{
    return this[1];
}

Float32Array.prototype.z = function()
{
    return this[2];
}

Float32Array.prototype.w = function()
{
    return this[3];
}

Float32Array.prototype.r = function()
{
    return this[0];
}

Float32Array.prototype.g = function()
{
    return this[1];
}

Float32Array.prototype.b = function()
{
    return this[2];
}

Float32Array.prototype.a = function()
{
    return this[3];
}

Float32Array.prototype.toAmmoVector = function()
{
    return new Ammo.btVector3(this[0], this[1], this[2]);
}

Float32Array.prototype.norm = function()
{
    return Math.sqrt(this.squaredNorm());
}

Float32Array.prototype.squaredNorm = function()
{
    return this.reduce((a, b) => a + b*b, 0.0);
}

Float32Array.prototype.normalize = function()
{
    let vectorLength = this.norm();
    for(var index = 0; index < this.length; index++)
        this[index] /= vectorLength;
}

Float32Array.prototype.transform = function(matrix)
{
    let output = this.clone();
    output[0] = output[0] * matrix[0]  + matrix[3];
    output[1] = output[1] * matrix[5]  + matrix[7];
    output[2] = output[2] * matrix[10] + matrix[11];
    return output;
}

Float32Array.prototype.normalized = function()
{
    var clone = this.clone();
    clone.normalize();
    return clone;
}
