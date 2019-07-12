/*
    If you're going to copy this camera, at least fix
    the UP vector messing up.
    Thanks

    I know I stole it from TGC
 */

class BlurFreeCamera
{
    constructor(initialPosition, initialDirection)
    {
        this.position = initialPosition;

        this.directionView = new Vector3(0.0, 0.0, -1.0);

        this.yaw = initialDirection.dot(initialPosition);
        this.pitch = -initialPosition.crossed(initialDirection).norm();
        this.movementSpeed = 600.0;
        this.rotationSpeed = 0.01;

        this.up = Vector3.up;

        this.cameraRotation = Matrix4.rotationX(this.pitch).rotateY(this.yaw);
    }

    update(input, elapsedTime)
    {
        var moveVector = Vector3.zero;

        if (input.keyDown('w'))
        {
            moveVector.add(new Vector3(0, 0, -1));
        }
        if (input.keyDown('s'))
        {
            moveVector.add(new Vector3(0, 0, 1));
        }
        if (input.keyDown('a'))
        {
            moveVector.add(new Vector3(-1, 0, 0));
        }
        if (input.keyDown('d'))
        {
            moveVector.add(new Vector3(1, 0, 0));
        }

        if(input.mouseMoved())
        {
            let delta = input.mouseDelta();
            this.yaw -= delta.y * this.rotationSpeed;
            this.pitch -= delta.x * this.rotationSpeed;
            this.cameraRotation = Matrix4.rotationY(this.pitch).rotateX(this.yaw);
        }

        if(!moveVector.isZero())
        {
            moveVector.normalize();
            moveVector.scale(this.movementSpeed * elapsedTime);
            moveVector.transformNormal(this.cameraRotation);
        }

        this.position.add(moveVector);

        let cameraRotatedTarget = this.directionView.transformedNormal(this.cameraRotation);
        this.lookAt = this.position.added(cameraRotatedTarget);


        this.up = Vector3.up.transformedNormal(this.cameraRotation);
    }

}