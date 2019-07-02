function AmmoUtils(){}

AmmoUtils.getPositionRotationMatrix = function(rigidBody)
{
    var motionState = rigidBody.getMotionState();
    var transformWorld = new Ammo.btTransform();
    if (motionState)
    {
        motionState.getWorldTransform(transformWorld);
        var origin = transformWorld.getOrigin();
        var rotation = transformWorld.getRotation();
        var rot = quat4.createFrom(rotation.x(), rotation.y(), rotation.z(), rotation.w());
        return mat4.fromRotationTranslation(rot, Vector3.fromAmmoVector(origin));
    }
    return mat4.identity();
}
