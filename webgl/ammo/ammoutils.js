class AmmoUtils
{
    static getPositionRotationMatrix(rigidBody)
    {
        var motionState = rigidBody.getMotionState();
        var transformWorld = new Ammo.btTransform();
        if (motionState)
        {
            motionState.getWorldTransform(transformWorld);
            var origin = transformWorld.getOrigin();
            var rotation = transformWorld.getRotation();
            var rot = quat4.createFrom(rotation.x(), rotation.y(), rotation.z(), rotation.w());
            return Matrix4.fromRotationTranslation(rot, Vector3.fromAmmoVector(origin));
        }
        return Matrix4.identity();
    }
}