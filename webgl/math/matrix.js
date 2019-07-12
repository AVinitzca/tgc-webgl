
class Matrix4 extends Float32Array
{
    constructor(buffer, byteOffset, length)
    {
        super(buffer, byteOffset, length);
    }

    clone()
    {
        return new Matrix4(this);
    }

    multiply(other)
    {
        let destination = this.clone();
        mat4.multiply(destination, other, destination);
        return destination;
    }

    translate(vector)
    {
        return this.multiply(Matrix4.translation(vector));
    }

    scale(vector)
    {
        return this.multiply(Matrix4.scaling(vector));
    }

    rotate(angle, axis)
    {
        return this.multiply(Matrix4.rotation(angle, axis));
    }

    rotateX(angle)
    {
        return this.multiply(Matrix4.rotationX(angle));
    }

    rotateY(angle)
    {
        return this.multiply(Matrix4.rotationY(angle));
    }

    rotateZ(angle)
    {
        return this.multiply(Matrix4.rotationZ(angle));
    }

    transpose()
    {
        let destination = Matrix4.identity();
        mat4.transpose(this, destination);
        return destination;
    }

    determinant()
    {
        return mat4.determinant(this);
    }

    inverse()
    {
        let destination = Matrix4.identity();
        mat4.inverse(this, destination);
        return destination;
    }

    static identity()
    {
        return Matrix4.__identityPrototype.clone();
    }

    static translation(vector)
    {
        let destination = Matrix4.identity();
        destination[12] = vector[0];
        destination[13] = vector[1];
        destination[14] = vector[2];
        return destination;
    }

    static scaling(vector)
    {
        let destination = Matrix4.identity();
        destination[0]  = vector[0];
        destination[5]  = vector[1];
        destination[10] = vector[2];
        return destination;
    }

    static rotation(angle, axis)
    {
        let destination = Matrix4.identity();
        mat4.rotate(destination, angle, axis, destination);
        return destination;
    }

    static rotationX(angle)
    {
        let sinA = Math.sin(angle);
        let cosA = Math.cos(angle);
        return new Matrix4([
            1.0, 0.0, 0.0, 0.0,
            0.0, cosA, sinA, 0.0,
            0.0, -sinA, cosA, 0.0,
            0.0, 0.0, 0.0, 1.0,
        ]);
    }

    static rotationY(angle)
    {
        let sinA = Math.sin(angle);
        let cosA = Math.cos(angle);
        return new Matrix4([
           cosA, 0.0, -sinA, 0.0,
           0.0, 1.0, 0.0, 0.0,
           sinA, 0.0, cosA, 0.0,
           0.0, 0.0, 0.0, 1.0,
        ]);
    }

    static rotationZ(angle)
    {
        let sinA = Math.sin(angle);
        let cosA = Math.cos(angle);
        return new Matrix4([
            cosA, sinA, 0.0, 0.0,
            -sinA, cosA, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0,
        ]);
    }

    static lookAtLeftHanded(position, lookAt, up)
    {
        let destination = Matrix4.identity();
        mat4.lookAt(position, lookAt, up, destination);
        return destination;
    }

    static fromRotationTranslation(rotationQuaternion, translation)
    {
        let destination = Matrix4.identity();
        mat4.fromRotationTranslation(rotationQuaternion, translation, destination);
        return destination;
    }

    static frustum(left, right, bottom, top, near, far)
    {
        let destination = Matrix4.identity();
        mat4.frustum(left, right, bottom, top, near, far, destination);
        return destination;
    }

    static perspective(verticalFOV, aspectRatio, near, far)
    {
        let destination = Matrix4.identity();
        mat4.perspective(verticalFOV, aspectRatio, near, far, destination);
        return destination;
    }

    static orthogonalProjection(left, right, bottom, top, near, far)
    {
        let destination = Matrix4.identity();
        mat4.ortho(left, right, bottom, top, near, far, destination);
        return destination;
    }
}

Matrix4.__identityPrototype = new Matrix4
([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
]);
