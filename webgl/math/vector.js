class Vector extends Float32Array
{
    // For highlight purposes only
    clone() { }

    static fromAmmoVector(vector) { }

    static get zero() { }

    static get up() { }

    static get down() { }

    dot(vector)
    {
        return this.map((element, key) => element * vector[key]).reduce((a, b) => a + b, 0.0);
    }

    isZero()
    {
        return this.every(element => element === 0.0);
    }

    squaredNorm()
    {
        return this.reduce((a, b) => a + b * b, 0.0);
    }

    norm()
    {
        return Math.sqrt(this.squaredNorm());
    }

    add(vector)
    {
        let shortest = vector.length > this.length ? this.length : vector.length;
        for(var index = 0; index < shortest; index++)
            this[index] += vector[index];
    }

    subtract(vector)
    {
        let shortest = vector.length > this.length ? this.length : vector.length;
        for(var index = 0; index < shortest; index++)
            this[index] -= vector[index];
    }

    scale(scalar)
    {
        for(var index = 0; index < this.length; index++)
            this[index] *= scalar;
    }

    negate()
    {
        this.scale(-1.0);
    }

    normalize()
    {
        let vectorLength = this.norm();
        this.scale(1.0 / vectorLength);
    }

    invert()
    {
        for(var index = 0; index < this.length; index++)
            this[index] = 1.0 / this[index];
    }

    // Immutable

    added(vector)
    {
        let output = this.clone();
        output.add(vector);
        return output;
    }

    subtracted(vector)
    {
        let output = this.clone();
        output.subtract(vector);
        return output;
    }

    scaled(scalar)
    {
        let output = this.clone();
        output.scale(scalar);
        return output;
    }

    negated()
    {
        let output = this.clone();
        output.negate();
        return output;
    }

    normalized()
    {
        let output = this.clone();
        output.negate();
        return output;
    }

    inverted()
    {
        let output = this.clone();
        output.invert();
        return output;
    }
}

class Vector3 extends Vector
{
    constructor(x = 0.0, y = null, z = null)
    {
        if(typeof x !== "number")
            super(x, y, z);
        else if(y == null)
            super([x, x, x]);
        else if(z == null)
            super([x, y, 0.0]);
        else
            super([x, y, z]);
    }

    clone()
    {
        return new Vector3(this);
    }

    cross(vector)
    {
        vec3.cross(this, vector);
    }

    transform(matrix)
    {
        this[0] = this[0] * matrix[0] + matrix[3];
        this[1] = this[1] * matrix[5]  + matrix[7];
        this[2] = this[2] * matrix[10] + matrix[11];
    }

    transformNormal(matrix)
    {
        this.normalize();
        mat4.multiplyVec3(matrix, this);
        this.scale(this.norm());
    }

    crossed(vector)
    {
        let output = this.clone();
        vec3.cross(output, vector);
        return output;
    }

    transformed(matrix)
    {
        let output = this.clone();
        output.transform(matrix);
        return output;
    }

    transformedNormal(matrix)
    {
        let output = this.clone();
        output.transformNormal(matrix);
        return output;
    }

    toAmmoVector()
    {
        return new Ammo.btVector3(this[0], this[1], this[2]);
    }

    get x()
    {
        return this[0];
    }

    get y()
    {
        return this[1];
    }

    get z()
    {
        return this[2];
    }

    get xy()
    {
        return new Vector2(this.slice(0, 2));
    }

    // TODO add more combinations like .xz() .yx()

    get r()
    {
        return this.x;
    }

    get g()
    {
        return this.y;
    }

    get b()
    {
        return this.z;
    }

    set x(value)
    {
        this[0] = value;
    }

    set y(value)
    {
        this[1] = value;
    }

    set z(value)
    {
        this[2] = value;
    }

    set xy(value)
    {
        this[0] = value[0];
        this[1] = value[1];
    }

    static get zero() // out of ten
    {
        return new Vector3(0.0);
    }

    static get up() // if you can
    {
        return new Vector3([0.0, 1.0, 0.0]);
    }

    static get down() // and move it all around
    {
        return new Vector3([0.0, -1.0, 0.0]);
    }

    static fromAmmoVector(vector)
    {
        return new Vector3([vector.x(), vector.y(), vector.z()]);
    }
}


class Vector2 extends Vector
{
    // We only keep c because this object
    // can be instantiated using the constructor
    // as a copy method. That's the trade-off for
    // using inheritance with Float32Array
    constructor(x = 0.0, y = null, c = null)
    {
        if(typeof x !== "number")
            super(x, y, c);
        else if(y == null)
            super([x, x]);
        else
            super([x, y]);
    }

    clone()
    {
        return new Vector2(this);
    }

    cross(vector)
    {
        vec2.cross(this, vector);
    }

    get x()
    {
        return this[0];
    }

    get y()
    {
        return this[1];
    }

    static get zero() // out of ten
    {
        return new Vector2(0.0);
    }

    static get up() // and fight
    {
        return new Vector2([0.0, 1.0]);
    }

    static get down() // on it
    {
        return new Vector2([0.0, -1.0]);
    }

    static fromAmmoVector(vector)
    {
        return new Vector2([vector.x(), vector.y()]);
    }

}